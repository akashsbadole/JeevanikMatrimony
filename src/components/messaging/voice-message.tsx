'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, Send, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface VoiceMessageProps {
  onSend: (audioBlob: Blob, duration: number) => void;
  onCancel?: () => void;
  maxDuration?: number; // in seconds
  disabled?: boolean;
}

interface VoiceMessagePlayerProps {
  audioUrl: string;
  duration: number;
  timestamp: Date;
  isOwn?: boolean;
  onDelete?: () => void;
}

export function VoiceMessageRecorder({ 
  onSend, 
  onCancel, 
  maxDuration = 300, // 5 minutes
  disabled = false 
}: VoiceMessageProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkMicrophonePermission();
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (isRecording && !isPaused) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording, isPaused, maxDuration]);

  const checkMicrophonePermission = async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      setHasPermission(permission.state === 'granted');
      
      permission.addEventListener('change', () => {
        setHasPermission(permission.state === 'granted');
      });
    } catch (error) {
      console.error('Error checking microphone permission:', error);
    }
  };

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        cleanup();
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      toast({
        title: 'Recording Started',
        description: 'Speak clearly into your microphone',
      });
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Recording Failed',
        description: 'Could not access microphone. Please check permissions.',
        variant: 'destructive',
      });
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const playRecording = () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pausePlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecordingTime(0);
    setIsPlaying(false);
    onCancel?.();
  };

  const sendRecording = () => {
    if (audioBlob) {
      onSend(audioBlob, recordingTime);
      deleteRecording();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (hasPermission === false) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <MicOff className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-3">
            Microphone access is required to send voice messages
          </p>
          <Button onClick={checkMicrophonePermission} size="sm">
            Grant Permission
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        {/* Recording Controls */}
        {!audioBlob && (
          <div className="flex items-center space-x-4">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                disabled={disabled}
                className="bg-red-600 hover:bg-red-700"
              >
                <Mic className="h-4 w-4 mr-2" />
                Start Recording
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  onClick={isPaused ? resumeRecording : pauseRecording}
                  variant="outline"
                  size="sm"
                >
                  {isPaused ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
                
                <Button
                  onClick={stopRecording}
                  variant="outline"
                  size="sm"
                >
                  Stop
                </Button>
                
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`}></div>
                  <span className="text-sm font-mono">{formatTime(recordingTime)}</span>
                  <span className="text-xs text-gray-500">/ {formatTime(maxDuration)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Playback Controls */}
        {audioBlob && audioUrl && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  onClick={isPlaying ? pausePlayback : playRecording}
                  size="sm"
                  variant="outline"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{formatTime(recordingTime)}</Badge>
                  <span className="text-sm text-gray-600">Voice Message</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  onClick={deleteRecording}
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                
                <Button
                  onClick={sendRecording}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>

            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full"
              controls
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function VoiceMessagePlayer({ 
  audioUrl, 
  duration, 
  timestamp, 
  isOwn = false,
  onDelete 
}: VoiceMessagePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const downloadAudio = () => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `voice-message-${timestamp.getTime()}.webm`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center space-x-3 p-3 rounded-lg max-w-xs ${
      isOwn ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-100'
    }`}>
      <Button
        onClick={togglePlayback}
        size="sm"
        variant={isOwn ? "secondary" : "outline"}
        className="flex-shrink-0"
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">Voice Message</span>
          <span className="text-xs opacity-75">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        
        <div className="w-full bg-gray-300 rounded-full h-1">
          <div 
            className={`h-1 rounded-full transition-all duration-300 ${
              isOwn ? 'bg-white' : 'bg-blue-600'
            }`}
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex items-center space-x-1">
        <Button
          onClick={downloadAudio}
          size="sm"
          variant={isOwn ? "secondary" : "outline"}
          className="flex-shrink-0"
        >
          <Download className="h-3 w-3" />
        </Button>
        
        {isOwn && onDelete && (
          <Button
            onClick={onDelete}
            size="sm"
            variant="secondary"
            className="flex-shrink-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
      />
    </div>
  );
}
