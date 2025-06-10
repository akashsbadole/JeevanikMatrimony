'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Camera, Upload, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface VideoIntroductionProps {
  videoUrl?: string;
  isOwner?: boolean;
  onVideoUpload?: (file: File) => void;
  onVideoDelete?: () => void;
  maxDuration?: number; // in seconds
}

export function VideoIntroduction({ 
  videoUrl, 
  isOwner = false, 
  onVideoUpload, 
  onVideoDelete,
  maxDuration = 60 
}: VideoIntroductionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showUploadOptions, setShowUploadOptions] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, maxDuration]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }, 
        audio: true 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordedBlob(blob);
        
        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = URL.createObjectURL(blob);
        }
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      toast({
        title: 'Recording Started',
        description: 'Introduce yourself! You have up to 60 seconds.',
      });

    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Recording Failed',
        description: 'Could not access camera and microphone. Please check permissions.',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      toast({
        title: 'Recording Completed',
        description: 'Your video introduction has been recorded successfully!',
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        if (file.size > 50 * 1024 * 1024) { // 50MB limit
          toast({
            title: 'File Too Large',
            description: 'Please select a video file smaller than 50MB.',
            variant: 'destructive',
          });
          return;
        }

        onVideoUpload?.(file);
        setShowUploadOptions(false);
        
        toast({
          title: 'Video Uploaded',
          description: 'Your video introduction has been uploaded successfully!',
        });
      } else {
        toast({
          title: 'Invalid File Type',
          description: 'Please select a valid video file.',
          variant: 'destructive',
        });
      }
    }
  };

  const saveRecording = () => {
    if (recordedBlob) {
      const file = new File([recordedBlob], 'video-introduction.webm', { type: 'video/webm' });
      onVideoUpload?.(file);
      setRecordedBlob(null);
      setShowUploadOptions(false);
    }
  };

  const discardRecording = () => {
    setRecordedBlob(null);
    setRecordingTime(0);
    if (videoRef.current) {
      videoRef.current.src = videoUrl || '';
    }
  };

  const downloadVideo = () => {
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = 'video-introduction.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Camera className="h-5 w-5 mr-2" />
            Video Introduction
          </span>
          {videoUrl && (
            <Badge className="bg-green-100 text-green-800">Available</Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Video Player */}
        <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4">
          {videoUrl || recordedBlob ? (
            <div className="relative aspect-video">
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-cover"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                poster="/api/placeholder/640/360"
              />

              {/* Video Controls Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={togglePlay}
                    className="bg-black/50 text-white hover:bg-black/70 rounded-full w-16 h-16"
                  >
                    {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                  </Button>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>

                    <div className="flex-1">
                      <div 
                        className="bg-white/30 rounded-full h-1 cursor-pointer"
                        onClick={handleSeek}
                      >
                        <div 
                          className="bg-white rounded-full h-1 transition-all duration-200"
                          style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                        />
                      </div>
                    </div>

                    <span className="text-white text-sm font-mono">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>

                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={downloadVideo}
                        className="text-white hover:bg-white/20"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-video flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Video Introduction</h3>
                <p className="text-gray-500 text-sm">
                  {isOwner ? 'Record or upload a video to introduce yourself' : 'This user hasn\'t added a video introduction yet'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Recording Status */}
        {isRecording && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-red-700 font-medium">Recording...</span>
              </div>
              <span className="text-red-700 font-mono">
                {formatTime(recordingTime)} / {formatTime(maxDuration)}
              </span>
            </div>
            <Progress 
              value={(recordingTime / maxDuration) * 100} 
              className="h-2"
            />
          </div>
        )}

        {/* Action Buttons */}
        {isOwner && (
          <div className="space-y-3">
            {!isRecording && !recordedBlob && (
              <div className="flex space-x-3">
                <Button
                  onClick={startRecording}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Record Video
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setShowUploadOptions(!showUploadOptions)}
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Video
                </Button>
              </div>
            )}

            {isRecording && (
              <Button
                onClick={stopRecording}
                variant="outline"
                className="w-full"
              >
                Stop Recording
              </Button>
            )}

            {recordedBlob && (
              <div className="flex space-x-3">
                <Button
                  onClick={saveRecording}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Save Video
                </Button>
                <Button
                  variant="outline"
                  onClick={discardRecording}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Discard
                </Button>
              </div>
            )}

            {showUploadOptions && (
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Video File
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Max file size: 50MB • Recommended: 60 seconds or less
                </p>
              </div>
            )}

            {videoUrl && (
              <Button
                variant="outline"
                onClick={onVideoDelete}
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Video
              </Button>
            )}
          </div>
        )}

        {/* Tips */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">💡 Video Introduction Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Keep it under 60 seconds</li>
            <li>• Speak clearly and smile</li>
            <li>• Good lighting makes a difference</li>
            <li>• Share your interests and what you're looking for</li>
            <li>• Be authentic and genuine</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
