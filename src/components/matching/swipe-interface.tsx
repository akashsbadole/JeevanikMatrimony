"use client";

import { useState, useRef, useEffect } from "react";
import { Heart, X, Star, MessageCircle, Info, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  name: string;
  age: number;
  height: string;
  profession: string;
  education: string;
  location: string;
  photos: string[];
  bio: string;
  interests: string[];
  isVerified: boolean;
  isOnline: boolean;
  lastActive: string;
  compatibility: number;
  religion: string;
  caste: string;
  motherTongue: string;
}

interface SwipeInterfaceProps {
  profiles: Profile[];
  onLike: (profileId: string) => void;
  onPass: (profileId: string) => void;
  onSuperLike: (profileId: string) => void;
  onMessage: (profileId: string) => void;
}

export function SwipeInterface({
  profiles,
  onLike,
  onPass,
  onSuperLike,
  onMessage,
}: SwipeInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<
    "left" | "right" | "up" | null
  >(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [recentActions, setRecentActions] = useState<
    Array<{ profileId: string; action: "like" | "pass" | "superlike" }>
  >([]);

  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const currentProfile = profiles[currentIndex];

  useEffect(() => {
    if (currentIndex >= profiles.length) {
      toast({
        title: "No more profiles",
        description:
          "You've seen all available profiles. Check back later for new matches!",
      });
    }
  }, [currentIndex, profiles.length, toast]);

  const handleSwipe = (direction: "left" | "right" | "up") => {
    if (!currentProfile) return;

    setSwipeDirection(direction);

    setTimeout(() => {
      if (direction === "right") {
        onLike(currentProfile.id);
        setRecentActions((prev) => [
          ...prev,
          { profileId: currentProfile.id, action: "like" },
        ]);
        toast({
          title: "Interest Sent! 💕",
          description: `You liked ${currentProfile.name}'s profile`,
        });
      } else if (direction === "left") {
        onPass(currentProfile.id);
        setRecentActions((prev) => [
          ...prev,
          { profileId: currentProfile.id, action: "pass" },
        ]);
      } else if (direction === "up") {
        onSuperLike(currentProfile.id);
        setRecentActions((prev) => [
          ...prev,
          { profileId: currentProfile.id, action: "superlike" },
        ]);
        toast({
          title: "Super Like Sent! ⭐",
          description: `You super liked ${currentProfile.name}'s profile`,
        });
      }

      setCurrentIndex((prev) => prev + 1);
      setSwipeDirection(null);
      setCurrentPhotoIndex(0);
      setShowDetails(false);
    }, 300);
  };

  const handleUndo = () => {
    if (recentActions.length === 0 || currentIndex === 0) return;

    const lastAction = recentActions[recentActions.length - 1];
    setRecentActions((prev) => prev.slice(0, -1));
    setCurrentIndex((prev) => prev - 1);

    toast({
      title: "Action Undone",
      description: "Your last action has been undone",
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const startX = e.clientX;
    const startY = e.clientY;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      setDragOffset({ x: deltaX, y: deltaY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      const threshold = 100;
      if (
        Math.abs(dragOffset.x) > threshold ||
        Math.abs(dragOffset.y) > threshold
      ) {
        if (Math.abs(dragOffset.x) > Math.abs(dragOffset.y)) {
          handleSwipe(dragOffset.x > 0 ? "right" : "left");
        } else if (dragOffset.y < -threshold) {
          handleSwipe("up");
        }
      }
      setDragOffset({ x: 0, y: 0 });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const nextPhoto = () => {
    if (
      currentProfile &&
      currentPhotoIndex < currentProfile.photos.length - 1
    ) {
      setCurrentPhotoIndex((prev) => prev + 1);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex((prev) => prev - 1);
    }
  };

  if (!currentProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <Heart className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No more profiles
        </h3>
        <p className="text-gray-500">Check back later for new matches!</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto relative">
      {/* Profile Card */}
      <Card
        ref={cardRef}
        className={`relative overflow-hidden transition-all duration-300 ${
          swipeDirection === "left"
            ? "transform -translate-x-full rotate-12 opacity-0"
            : swipeDirection === "right"
            ? "transform translate-x-full -rotate-12 opacity-0"
            : swipeDirection === "up"
            ? "transform -translate-y-full scale-110 opacity-0"
            : "transform translate-x-0 translate-y-0 rotate-0 opacity-100"
        }`}
        style={{
          transform: isDragging
            ? `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${
                dragOffset.x * 0.1
              }deg)`
            : undefined,
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="relative h-96 cursor-grab active:cursor-grabbing">
          {/* Photo */}
          <img
            src={currentProfile.photos[currentPhotoIndex]}
            alt={currentProfile.name}
            className="w-full h-full object-cover"
            onClick={nextPhoto}
          />

          {/* Photo Indicators */}
          {currentProfile.photos.length > 1 && (
            <div className="absolute top-4 left-4 right-4 flex space-x-1">
              {currentProfile.photos.map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 h-1 rounded-full ${
                    index === currentPhotoIndex ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Status Indicators */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            {currentProfile.isVerified && (
              <Badge className="bg-green-600 text-white">✓ Verified</Badge>
            )}
            {currentProfile.isOnline && (
              <Badge className="bg-blue-600 text-white">● Online</Badge>
            )}
          </div>

          {/* Compatibility Score */}
          <div className="absolute top-4 left-4">
            <div className="bg-[#1ec3da]/50 text-white px-2 py-1 rounded-full text-sm font-medium">
              {currentProfile.compatibility}% Match
            </div>
          </div>

          {/* Swipe Indicators */}
          {isDragging && (
            <>
              {dragOffset.x > 50 && (
                <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                  <div className="bg-green-500 text-white p-4 rounded-full">
                    <Heart className="h-8 w-8" />
                  </div>
                </div>
              )}
              {dragOffset.x < -50 && (
                <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                  <div className="bg-red-500 text-white p-4 rounded-full">
                    <X className="h-8 w-8" />
                  </div>
                </div>
              )}
              {dragOffset.y < -50 && (
                <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                  <div className="bg-blue-500 text-white p-4 rounded-full">
                    <Star className="h-8 w-8" />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Profile Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">
                {currentProfile.name}, {currentProfile.age}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="text-white hover:bg-white/20"
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-1 text-sm">
              <p>{currentProfile.profession}</p>
              <p>{currentProfile.location}</p>
              <p>
                {currentProfile.height} • {currentProfile.education}
              </p>
            </div>

            {showDetails && (
              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <strong>Religion:</strong> {currentProfile.religion}
                </p>
                <p>
                  <strong>Mother Tongue:</strong> {currentProfile.motherTongue}
                </p>
                <p>
                  <strong>About:</strong> {currentProfile.bio}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {currentProfile.interests
                    .slice(0, 3)
                    .map((interest, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-white border-white/30"
                      >
                        {interest}
                      </Badge>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center items-center space-x-4 mt-6">
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleSwipe("left")}
          className="rounded-full w-14 h-14 border-red-200 hover:bg-red-50 hover:border-red-300"
        >
          <X className="h-6 w-6 text-red-500" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleUndo}
          disabled={recentActions.length === 0}
          className="rounded-full w-10 h-10"
        >
          <Undo2 className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => handleSwipe("up")}
          className="rounded-full w-14 h-14 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
        >
          <Star className="h-6 w-6 text-blue-500" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onMessage(currentProfile.id)}
          className="rounded-full w-10 h-10"
        >
          <MessageCircle className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => handleSwipe("right")}
          className="rounded-full w-14 h-14 border-green-200 hover:bg-green-50 hover:border-green-300"
        >
          <Heart className="h-6 w-6 text-green-500" />
        </Button>
      </div>

      {/* Instructions */}
      <div className="text-center mt-4 text-sm text-gray-500">
        <p>
          Swipe right to like • Swipe left to pass • Swipe up for super like
        </p>
      </div>
    </div>
  );
}
