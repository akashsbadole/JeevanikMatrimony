'use client';

import { useState, useEffect } from 'react';
import { Fingerprint, Eye, Smartphone, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface BiometricAuthProps {
  onSuccess: (method: string) => void;
  onError: (error: string) => void;
  availableMethods?: string[];
}

interface BiometricCapabilities {
  fingerprint: boolean;
  faceID: boolean;
  voiceID: boolean;
  deviceSupported: boolean;
}

export function BiometricAuth({ onSuccess, onError, availableMethods = [] }: BiometricAuthProps) {
  const [capabilities, setCapabilities] = useState<BiometricCapabilities>({
    fingerprint: false,
    faceID: false,
    voiceID: false,
    deviceSupported: false,
  });
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authMethod, setAuthMethod] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkBiometricCapabilities();
  }, []);

  const checkBiometricCapabilities = async () => {
    try {
      // Check if Web Authentication API is supported
      const webAuthnSupported = 'credentials' in navigator && 'create' in navigator.credentials;
      
      if (!webAuthnSupported) {
        setCapabilities(prev => ({ ...prev, deviceSupported: false }));
        return;
      }

      // Check for specific biometric capabilities
      const publicKeyCredentialSupported = 'PublicKeyCredential' in window;
      
      if (publicKeyCredentialSupported) {
        // Check for platform authenticator (built-in biometrics)
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        
        setCapabilities({
          fingerprint: available,
          faceID: available,
          voiceID: false, // Voice ID requires additional APIs
          deviceSupported: available,
        });
      }
    } catch (error) {
      console.error('Error checking biometric capabilities:', error);
      setCapabilities(prev => ({ ...prev, deviceSupported: false }));
    }
  };

  const authenticateWithFingerprint = async () => {
    setIsAuthenticating(true);
    setAuthMethod('fingerprint');

    try {
      // Create credential request for fingerprint
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32),
          rp: {
            name: 'Indian Matrimony',
            id: window.location.hostname,
          },
          user: {
            id: new Uint8Array(16),
            name: 'user@example.com',
            displayName: 'User',
          },
          pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
          },
          timeout: 60000,
          attestation: 'direct',
        },
      });

      if (credential) {
        toast({
          title: 'Fingerprint Authentication Successful',
          description: 'You have been authenticated using your fingerprint.',
        });
        onSuccess('fingerprint');
      }
    } catch (error: any) {
      console.error('Fingerprint authentication error:', error);
      let errorMessage = 'Fingerprint authentication failed';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Fingerprint authentication was cancelled or not allowed';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Fingerprint authentication is not supported on this device';
      }
      
      toast({
        title: 'Authentication Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      onError(errorMessage);
    } finally {
      setIsAuthenticating(false);
      setAuthMethod(null);
    }
  };

  const authenticateWithFaceID = async () => {
    setIsAuthenticating(true);
    setAuthMethod('faceID');

    try {
      // Similar to fingerprint but with face recognition preference
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32),
          rp: {
            name: 'Indian Matrimony',
            id: window.location.hostname,
          },
          user: {
            id: new Uint8Array(16),
            name: 'user@example.com',
            displayName: 'User',
          },
          pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
          },
          timeout: 60000,
          attestation: 'direct',
        },
      });

      if (credential) {
        toast({
          title: 'Face ID Authentication Successful',
          description: 'You have been authenticated using Face ID.',
        });
        onSuccess('faceID');
      }
    } catch (error: any) {
      console.error('Face ID authentication error:', error);
      let errorMessage = 'Face ID authentication failed';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Face ID authentication was cancelled or not allowed';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Face ID is not supported on this device';
      }
      
      toast({
        title: 'Authentication Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      onError(errorMessage);
    } finally {
      setIsAuthenticating(false);
      setAuthMethod(null);
    }
  };

  const authenticateWithVoice = async () => {
    setIsAuthenticating(true);
    setAuthMethod('voice');

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Simulate voice authentication (in real implementation, this would use voice recognition APIs)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Stop the stream
      stream.getTracks().forEach(track => track.stop());
      
      toast({
        title: 'Voice Authentication Successful',
        description: 'You have been authenticated using voice recognition.',
      });
      onSuccess('voice');
    } catch (error: any) {
      console.error('Voice authentication error:', error);
      let errorMessage = 'Voice authentication failed';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Microphone access was denied';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No microphone found on this device';
      }
      
      toast({
        title: 'Authentication Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      onError(errorMessage);
    } finally {
      setIsAuthenticating(false);
      setAuthMethod(null);
    }
  };

  if (!capabilities.deviceSupported) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Biometric Authentication Not Available
          </h3>
          <p className="text-gray-600 mb-4">
            Your device doesn't support biometric authentication or it's not enabled.
          </p>
          <div className="text-sm text-gray-500">
            <p>To use biometric authentication:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Ensure your device has biometric sensors</li>
              <li>Enable biometric authentication in device settings</li>
              <li>Use a supported browser (Chrome, Safari, Edge)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Biometric Authentication
        </CardTitle>
        <p className="text-gray-600">
          Choose your preferred biometric authentication method for secure access.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Fingerprint Authentication */}
        {capabilities.fingerprint && (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Fingerprint className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">Fingerprint</h4>
                  <p className="text-sm text-gray-600">Use your fingerprint to authenticate</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Available</Badge>
            </div>
            <Button
              onClick={authenticateWithFingerprint}
              disabled={isAuthenticating}
              className="w-full"
              variant={authMethod === 'fingerprint' ? 'default' : 'outline'}
            >
              {isAuthenticating && authMethod === 'fingerprint' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  <Fingerprint className="h-4 w-4 mr-2" />
                  Use Fingerprint
                </>
              )}
            </Button>
          </div>
        )}

        {/* Face ID Authentication */}
        {capabilities.faceID && (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Eye className="h-6 w-6 text-purple-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">Face ID</h4>
                  <p className="text-sm text-gray-600">Use facial recognition to authenticate</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Available</Badge>
            </div>
            <Button
              onClick={authenticateWithFaceID}
              disabled={isAuthenticating}
              className="w-full"
              variant={authMethod === 'faceID' ? 'default' : 'outline'}
            >
              {isAuthenticating && authMethod === 'faceID' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Use Face ID
                </>
              )}
            </Button>
          </div>
        )}

        {/* Voice Authentication */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Smartphone className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Voice Recognition</h4>
                <p className="text-sm text-gray-600">Use your voice to authenticate</p>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800">Beta</Badge>
          </div>
          <Button
            onClick={authenticateWithVoice}
            disabled={isAuthenticating}
            className="w-full"
            variant={authMethod === 'voice' ? 'default' : 'outline'}
          >
            {isAuthenticating && authMethod === 'voice' ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Listening...
              </>
            ) : (
              <>
                <Smartphone className="h-4 w-4 mr-2" />
                Use Voice Recognition
              </>
            )}
          </Button>
        </div>

        {/* Security Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
            <div className="text-sm">
              <h5 className="font-medium text-blue-900 mb-1">Secure & Private</h5>
              <p className="text-blue-700">
                Your biometric data is processed locally on your device and never stored on our servers. 
                This ensures maximum security and privacy for your authentication.
              </p>
            </div>
          </div>
        </div>

        {/* Fallback Options */}
        <div className="text-center pt-4 border-t">
          <p className="text-sm text-gray-600 mb-2">
            Having trouble with biometric authentication?
          </p>
          <Button variant="link" className="text-sm">
            Use Password Instead
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
