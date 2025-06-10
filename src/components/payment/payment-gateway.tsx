'use client';

import { useState } from 'react';
import { CreditCard, Smartphone, Building, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface PaymentMethod {
  id: string;
  name: string;
  icon: any;
  description: string;
  processingFee: number;
  supported: boolean;
}

interface PaymentGatewayProps {
  amount: number;
  description: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

export function PaymentGateway({ amount, description, onSuccess, onError, onCancel }: PaymentGatewayProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [upiId, setUpiId] = useState('');
  const [netBankingBank, setNetBankingBank] = useState('');
  const { toast } = useToast();

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, RuPay',
      processingFee: 2.5,
      supported: true
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: Smartphone,
      description: 'PhonePe, Google Pay, Paytm',
      processingFee: 0,
      supported: true
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: Building,
      description: 'All major banks',
      processingFee: 1.5,
      supported: true
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: Smartphone,
      description: 'Paytm, PhonePe, Amazon Pay',
      processingFee: 1.0,
      supported: true
    }
  ];

  const banks = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Punjab National Bank',
    'Bank of Baroda',
    'Canara Bank',
    'Union Bank of India'
  ];

  const calculateTotal = () => {
    const method = paymentMethods.find(m => m.id === selectedMethod);
    const processingFee = method ? (amount * method.processingFee) / 100 : 0;
    return amount + processingFee;
  };

  const processPayment = async () => {
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulate different payment outcomes
      const success = Math.random() > 0.1; // 90% success rate

      if (success) {
        const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        onSuccess(paymentId);
        toast({
          title: 'Payment Successful!',
          description: `Payment of ₹${calculateTotal().toFixed(2)} completed successfully.`,
        });
      } else {
        throw new Error('Payment failed due to insufficient funds');
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Payment failed');
      toast({
        title: 'Payment Failed',
        description: 'Please try again or use a different payment method.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const validateCardNumber = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    return cleaned.length >= 13 && cleaned.length <= 19 && /^\d+$/.test(cleaned);
  };

  const validateExpiry = (expiry: string) => {
    const [month, year] = expiry.split('/');
    if (!month || !year) return false;
    const currentDate = new Date();
    const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    return expiryDate > currentDate;
  };

  const validateCVV = (cvv: string) => {
    return cvv.length >= 3 && cvv.length <= 4 && /^\d+$/.test(cvv);
  };

  const isFormValid = () => {
    switch (selectedMethod) {
      case 'card':
        return validateCardNumber(cardDetails.number) && 
               validateExpiry(cardDetails.expiry) && 
               validateCVV(cardDetails.cvv) && 
               cardDetails.name.trim().length > 0;
      case 'upi':
        return upiId.includes('@') && upiId.length > 5;
      case 'netbanking':
        return netBankingBank.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-green-600" />
            Secure Payment
          </CardTitle>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">{description}</span>
            <Badge className="bg-green-100 text-green-800">SSL Secured</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span>₹{amount.toFixed(2)}</span>
              </div>
              {selectedMethod && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Fee</span>
                  <span>₹{((amount * (paymentMethods.find(m => m.id === selectedMethod)?.processingFee || 0)) / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Choose Payment Method</h3>
            <Tabs value={selectedMethod} onValueChange={setSelectedMethod}>
              <TabsList className="grid w-full grid-cols-4">
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <TabsTrigger key={method.id} value={method.id} disabled={!method.supported}>
                      <div className="flex flex-col items-center space-y-1">
                        <IconComponent className="h-4 w-4" />
                        <span className="text-xs">{method.name.split(' ')[0]}</span>
                      </div>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {/* Card Payment */}
              <TabsContent value="card" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
                        setCardDetails(prev => ({ ...prev, number: value }));
                      }}
                      maxLength={19}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.substring(0, 2) + '/' + value.substring(2, 4);
                          }
                          setCardDetails(prev => ({ ...prev, expiry: value }));
                        }}
                        maxLength={5}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        type="password"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* UPI Payment */}
              <TabsContent value="upi" className="space-y-4">
                <div>
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    placeholder="yourname@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Enter your UPI ID (e.g., 9876543210@paytm, yourname@oksbi)
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Smartphone className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm text-blue-800">
                      You will receive a payment request on your UPI app
                    </span>
                  </div>
                </div>
              </TabsContent>

              {/* Net Banking */}
              <TabsContent value="netbanking" className="space-y-4">
                <div>
                  <Label htmlFor="bank">Select Your Bank</Label>
                  <Select value={netBankingBank} onValueChange={setNetBankingBank}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {banks.map((bank) => (
                        <SelectItem key={bank} value={bank}>
                          {bank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-sm text-yellow-800">
                      You will be redirected to your bank's secure website
                    </span>
                  </div>
                </div>
              </TabsContent>

              {/* Digital Wallet */}
              <TabsContent value="wallet" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {['Paytm', 'PhonePe', 'Amazon Pay'].map((wallet) => (
                    <Button key={wallet} variant="outline" className="h-16 flex flex-col">
                      <Smartphone className="h-6 w-6 mb-1" />
                      <span className="text-xs">{wallet}</span>
                    </Button>
                  ))}
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Smartphone className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="text-sm text-purple-800">
                      Choose your preferred wallet to complete payment
                    </span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Security Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1">Your payment is secure</p>
                <p>We use industry-standard encryption to protect your payment information. Your card details are never stored on our servers.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            
            <Button
              onClick={processPayment}
              disabled={!isFormValid() || isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay ₹{calculateTotal().toFixed(2)}
                </>
              )}
            </Button>
          </div>

          {/* Payment Methods Accepted */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">We accept</p>
            <div className="flex justify-center space-x-4">
              <Badge variant="outline">Visa</Badge>
              <Badge variant="outline">Mastercard</Badge>
              <Badge variant="outline">RuPay</Badge>
              <Badge variant="outline">UPI</Badge>
              <Badge variant="outline">Net Banking</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
