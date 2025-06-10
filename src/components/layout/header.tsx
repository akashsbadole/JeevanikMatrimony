"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Heart, Menu, X, User, Settings, LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, user, isLoaded } = useUser();

  const navigation = [
    { name: "Search", href: "/search" },
    { name: "Discover", href: "/discover" },
    { name: "Success Stories", href: "/success-stories" },
    { name: "Services", href: "/services" },
    { name: "Mobile App", href: "/mobile-app" },
    { name: "Pricing", href: "/pricing" },
    { name: "Help", href: "/help" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-rose-600" />
            <span className="text-2xl font-bold text-gray-900">
              Indian Matrimony
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-rose-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!isLoaded ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            ) : isSignedIn ? (
              <div className="flex items-center space-x-4">
                <Link href="/search">
                  <Button variant="ghost" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </Link>

                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>

                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                    },
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
                    Join Free
                  </Button>
                </SignUpButton>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-rose-600 block px-3 py-2 text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {isSignedIn ? (
                <div className="border-t border-gray-200 pt-4 pb-3">
                  <div className="flex items-center px-3">
                    <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                      {user?.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt="Profile"
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <User className="h-5 w-5 text-rose-600" />
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {user?.fullName ||
                          user?.emailAddresses[0]?.emailAddress}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user?.emailAddresses[0]?.emailAddress}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <Link
                      href="/profile"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-rose-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-rose-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/interests"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-rose-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Interests
                    </Link>
                    <Link
                      href="/messages"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-rose-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Messages
                    </Link>
                    <div className="px-3 py-2">
                      <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: "w-8 h-8",
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4 pb-3 space-y-2">
                  <div className="px-3">
                    <SignInButton mode="modal">
                      <button className="block w-full text-left py-2 text-base font-medium text-gray-700 hover:text-rose-600">
                        Sign In
                      </button>
                    </SignInButton>
                  </div>
                  <div className="px-3">
                    <SignUpButton mode="modal">
                      <button className="block w-full py-2 text-base font-medium bg-rose-600 text-white rounded-md text-center">
                        Join Free
                      </button>
                    </SignUpButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
