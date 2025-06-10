"use client";

import { useState, useEffect } from "react";
import {
  Gift,
  Users,
  Share2,
  Copy,
  Check,
  Trophy,
  Star,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  totalEarnings: number;
  currentTierPoints: number;
  nextTierPoints: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
}

interface ReferralReward {
  id: string;
  type: "cash" | "premium" | "credits";
  amount: number;
  description: string;
  claimed: boolean;
  claimedAt?: Date;
}

export function ReferralProgram() {
  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 12,
    successfulReferrals: 8,
    pendingReferrals: 4,
    totalEarnings: 2400,
    currentTierPoints: 850,
    nextTierPoints: 1000,
    tier: "Silver",
  });
  const [rewards, setRewards] = useState<ReferralReward[]>([]);
  const [shareMethod, setShareMethod] = useState<
    "link" | "whatsapp" | "email" | "social"
  >("link");
  const { toast } = useToast();

  useEffect(() => {
    // Generate referral code (in real app, this would come from API)
    setReferralCode("MARRY2024XYZ");

    // Mock rewards data
    setRewards([
      {
        id: "1",
        type: "cash",
        amount: 500,
        description: "Referral bonus for Priya Sharma joining",
        claimed: true,
        claimedAt: new Date("2024-01-15"),
      },
      {
        id: "2",
        type: "premium",
        amount: 30,
        description: "30 days premium for successful match",
        claimed: false,
      },
      {
        id: "3",
        type: "credits",
        amount: 100,
        description: "Super like credits for active referral",
        claimed: true,
        claimedAt: new Date("2024-01-10"),
      },
    ]);
  }, []);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(
      `https://matrimony.com/join?ref=${referralCode}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    toast({
      title: "Referral Link Copied!",
      description: "Share this link with friends and family to earn rewards.",
    });
  };

  const shareViaWhatsApp = () => {
    const message = `🎉 Join India's most trusted matrimony platform and find your perfect life partner! Use my referral code ${referralCode} and get special benefits. https://matrimony.com/join?ref=${referralCode}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const shareViaEmail = () => {
    const subject = "Find Your Perfect Life Partner - Join Jeevanik";
    const body = `Hi,

I wanted to share something special with you! I've been using Jeevanik platform and it's amazing for finding life partners.

Use my referral code: ${referralCode}
Join here: https://matrimony.com/join?ref=${referralCode}

You'll get special benefits when you sign up, and I'll earn some rewards too!

Best regards`;

    window.open(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        body
      )}`,
      "_blank"
    );
  };

  const claimReward = (rewardId: string) => {
    setRewards((prev) =>
      prev.map((reward) =>
        reward.id === rewardId
          ? { ...reward, claimed: true, claimedAt: new Date() }
          : reward
      )
    );

    toast({
      title: "Reward Claimed!",
      description: "Your reward has been added to your account.",
    });
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Bronze":
        return "text-orange-600 bg-orange-100";
      case "Silver":
        return "text-gray-600 bg-gray-100";
      case "Gold":
        return "text-yellow-600 bg-yellow-100";
      case "Platinum":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "Bronze":
        return <Trophy className="h-4 w-4" />;
      case "Silver":
        return <Star className="h-4 w-4" />;
      case "Gold":
        return <Gift className="h-4 w-4" />;
      case "Platinum":
        return <Heart className="h-4 w-4" />;
      default:
        return <Trophy className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Referral Program
        </h1>
        <p className="text-gray-600">
          Invite friends and family, earn amazing rewards!
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalReferrals}
            </div>
            <p className="text-sm text-gray-600">Total Referrals</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Check className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {stats.successfulReferrals}
            </div>
            <p className="text-sm text-gray-600">Successful</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Gift className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              ₹{stats.totalEarnings}
            </div>
            <p className="text-sm text-gray-600">Total Earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div
              className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getTierColor(
                stats.tier
              )} mb-2`}
            >
              {getTierIcon(stats.tier)}
              <span className="ml-1">{stats.tier}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.currentTierPoints}
            </div>
            <p className="text-sm text-gray-600">Tier Points</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referral Code & Sharing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Share2 className="h-5 w-5 mr-2" />
              Share Your Referral Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Referral Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Referral Code
              </label>
              <div className="flex space-x-2">
                <Input
                  value={`https://matrimony.com/join?ref=${referralCode}`}
                  readOnly
                  className="flex-1"
                />
                <Button
                  onClick={copyReferralCode}
                  variant="outline"
                  className="px-3"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Share Methods */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Quick Share Options</h4>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={shareViaWhatsApp}
                  variant="outline"
                  className="justify-start"
                >
                  <div className="w-5 h-5 bg-green-500 rounded mr-2"></div>
                  WhatsApp
                </Button>

                <Button
                  onClick={shareViaEmail}
                  variant="outline"
                  className="justify-start"
                >
                  <div className="w-5 h-5 bg-blue-500 rounded mr-2"></div>
                  Email
                </Button>
              </div>
            </div>

            {/* Referral Benefits */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">
                🎁 Referral Benefits
              </h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• ₹500 for each successful referral</li>
                <li>• 30 days premium when they get married</li>
                <li>• Bonus credits for active referrals</li>
                <li>• Tier upgrades with more benefits</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Tier Progress & Rewards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              Tier Progress & Rewards
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Tier */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Current Tier
                </span>
                <Badge className={getTierColor(stats.tier)}>
                  {getTierIcon(stats.tier)}
                  <span className="ml-1">{stats.tier}</span>
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{stats.currentTierPoints} points</span>
                  <span>{stats.nextTierPoints} points to next tier</span>
                </div>
                <Progress
                  value={(stats.currentTierPoints / stats.nextTierPoints) * 100}
                  className="h-2"
                />
              </div>
            </div>

            {/* Available Rewards */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Available Rewards
              </h4>
              <div className="space-y-3">
                {rewards.map((reward) => (
                  <div
                    key={reward.id}
                    className={`p-3 border rounded-lg ${
                      reward.claimed
                        ? "bg-gray-50 border-gray-200"
                        : "bg-white border-green-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {reward.type === "cash" && (
                            <Gift className="h-4 w-4 text-green-600" />
                          )}
                          {reward.type === "premium" && (
                            <Star className="h-4 w-4 text-purple-600" />
                          )}
                          {reward.type === "credits" && (
                            <Heart className="h-4 w-4 text-rose-600" />
                          )}

                          <span className="font-medium text-gray-900">
                            {reward.type === "cash" && `₹${reward.amount}`}
                            {reward.type === "premium" &&
                              `${reward.amount} days premium`}
                            {reward.type === "credits" &&
                              `${reward.amount} credits`}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {reward.description}
                        </p>
                        {reward.claimed && reward.claimedAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            Claimed on {reward.claimedAt.toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      {!reward.claimed ? (
                        <Button
                          size="sm"
                          onClick={() => claimReward(reward.id)}
                          className="ml-3"
                        >
                          Claim
                        </Button>
                      ) : (
                        <Badge variant="outline" className="ml-3">
                          Claimed
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tier Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Tier Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                tier: "Bronze",
                points: "0-250",
                benefits: [
                  "₹300 per referral",
                  "Basic support",
                  "5% bonus credits",
                ],
              },
              {
                tier: "Silver",
                points: "251-500",
                benefits: [
                  "₹500 per referral",
                  "Priority support",
                  "10% bonus credits",
                  "Monthly premium trial",
                ],
              },
              {
                tier: "Gold",
                points: "501-1000",
                benefits: [
                  "₹750 per referral",
                  "Dedicated support",
                  "15% bonus credits",
                  "Quarterly premium",
                  "Early access features",
                ],
              },
              {
                tier: "Platinum",
                points: "1000+",
                benefits: [
                  "₹1000 per referral",
                  "VIP support",
                  "25% bonus credits",
                  "Annual premium",
                  "Exclusive events",
                  "Custom features",
                ],
              },
            ].map((tier, index) => (
              <div
                key={tier.tier}
                className={`p-4 border rounded-lg ${
                  tier.tier === stats.tier
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <div
                  className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium mb-3 ${getTierColor(
                    tier.tier
                  )}`}
                >
                  {getTierIcon(tier.tier)}
                  <span className="ml-1">{tier.tier}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {tier.points} points
                </p>
                <ul className="text-sm space-y-1">
                  {tier.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-3 w-3 text-green-600 mr-1 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
