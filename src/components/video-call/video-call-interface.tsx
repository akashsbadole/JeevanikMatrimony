"use client";

import { useState, useEffect, useRef } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Settings,
  MessageCircle,
  MoreVertical,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VideoCallInterfaceProps {
  callId: string;
  participantName: string;
  participantPhoto: string;
  isIncoming?: boolean;
  onEndCall: () => void;
  onAcceptCall?: () => void;
  onDeclineCall?: () => void;
}

export function VideoCallInterface({
  callId,
  participantName,
  participantPhoto,
  isIncoming = false,
  onEndCall,
  onAcceptCall,
  onDeclineCall,
}: VideoCallInterfaceProps) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true);
  const [callStatus, setCallStatus] = useState<
    "connecting" | "connected" | "ended"
  >("connecting");
  const [callDuration, setCallDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Initialize video call
    initializeCall();

    // Start call timer when connected
    let interval: NodeJS.Timeout;
    if (callStatus === "connected") {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStatus]);

  useEffect(() => {
    // Auto-hide controls after 3 seconds of inactivity
    if (showControls) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls]);

  const initializeCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Simulate connection after 2 seconds
      setTimeout(() => {
        setCallStatus("connected");
      }, 2000);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    // In real implementation, this would toggle the video track
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    // In real implementation, this would toggle the audio track
  };

  const toggleSpeaker = () => {
    setIsSpeakerEnabled(!isSpeakerEnabled);
    // In real implementation, this would toggle speaker/earpiece
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
  };

  if (isIncoming) {
    return (
      <div className="fixed inset-0 bg-[#1ec3da] bg-opacity-90 flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <img
                src={participantPhoto}
                alt={participantName}
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{participantName}</h2>
              <p className="text-gray-600">Incoming video call...</p>
            </div>

            <div className="flex justify-center space-x-6">
              <Button
                onClick={onDeclineCall}
                className="bg-red-600 hover:bg-red-700 rounded-full w-16 h-16"
              >
                <PhoneOff className="h-6 w-6" />
              </Button>

              <Button
                onClick={onAcceptCall}
                className="bg-green-600 hover:bg-green-700 rounded-full w-16 h-16"
              >
                <Phone className="h-6 w-6" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-[#1ec3da] flex flex-col z-50"
      onMouseMove={handleMouseMove}
    >
      {/* Header */}
      <div
        className={`absolute top-0 left-0 right-0 z-10 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="bg-[#1ec3da] bg-opacity-50 p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <img
                src={participantPhoto}
                alt={participantName}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="font-medium">{participantName}</h3>
                <div className="flex items-center space-x-2 text-sm">
                  <Badge
                    className={`${
                      callStatus === "connected"
                        ? "bg-green-600"
                        : callStatus === "connecting"
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                  >
                    {callStatus === "connected"
                      ? "Connected"
                      : callStatus === "connecting"
                      ? "Connecting..."
                      : "Ended"}
                  </Badge>
                  {callStatus === "connected" && (
                    <span>{formatDuration(callDuration)}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-white">
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative">
        {/* Remote Video */}
        <video
          ref={remoteVideoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
        />

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute top-20 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
          <video
            ref={localVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
          {!isVideoEnabled && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <VideoOff className="h-6 w-6 text-white" />
            </div>
          )}
        </div>

        {/* Participant Video Placeholder */}
        {!isVideoEnabled && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              <img
                src={participantPhoto}
                alt={participantName}
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-medium">{participantName}</h3>
              <p className="text-gray-400">Camera is off</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="bg-[#1ec3da] bg-opacity-50 p-6">
          <div className="flex justify-center space-x-4">
            {/* Audio Toggle */}
            <Button
              onClick={toggleAudio}
              className={`rounded-full w-14 h-14 ${
                isAudioEnabled
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isAudioEnabled ? (
                <Mic className="h-6 w-6 text-white" />
              ) : (
                <MicOff className="h-6 w-6 text-white" />
              )}
            </Button>

            {/* Video Toggle */}
            <Button
              onClick={toggleVideo}
              className={`rounded-full w-14 h-14 ${
                isVideoEnabled
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isVideoEnabled ? (
                <Video className="h-6 w-6 text-white" />
              ) : (
                <VideoOff className="h-6 w-6 text-white" />
              )}
            </Button>

            {/* End Call */}
            <Button
              onClick={onEndCall}
              className="bg-red-600 hover:bg-red-700 rounded-full w-14 h-14"
            >
              <PhoneOff className="h-6 w-6 text-white" />
            </Button>

            {/* Speaker Toggle */}
            <Button
              onClick={toggleSpeaker}
              className={`rounded-full w-14 h-14 ${
                isSpeakerEnabled
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-600 hover:bg-gray-500"
              }`}
            >
              {isSpeakerEnabled ? (
                <Volume2 className="h-6 w-6 text-white" />
              ) : (
                <VolumeX className="h-6 w-6 text-white" />
              )}
            </Button>

            {/* Settings */}
            <Button className="bg-gray-700 hover:bg-gray-600 rounded-full w-14 h-14">
              <Settings className="h-6 w-6 text-white" />
            </Button>
          </div>
        </div>
      </div>

      {/* Connection Status Overlay */}
      {callStatus === "connecting" && (
        <div className="absolute inset-0 bg-[#1ec3da] bg-opacity-75 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">Connecting to {participantName}...</p>
          </div>
        </div>
      )}
    </div>
  );
}
