import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Car, Eye, MessageCircle, Heart, Plus, Settings, User, 
  Shield, AlertCircle, CheckCircle2, Clock, TrendingUp,
  ChevronRight, MoreHorizontal, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MessagesTab from "@/components/MessagesTab";
import { useAuth } from "@/hooks/useAuth";
import { useVerification } from "@/hooks/useVerification";
import { useCarListings } from "@/hooks/useCarListings";
import { useMessages } from "@/hooks/useMessages";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type CarListing = Database["public"]["Tables"]["car_listings"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const Dashboard = () => {
  const { user } = useAuth();
  const { verification, isVerified, isPending, loading: verificationLoading } = useVerification();
  const { fetchUserListings, deleteListing, updateListing } = useCarListings();
  const { unreadCount } = useMessages();
  
  const [listings, setListings] = useState<CarListing[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        const [userListings, profileData] = await Promise.all([
          fetchUserListings(),
          supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle(),
        ]);

        setListings(userListings);
        if (profileData.data) {
          setProfile(profileData.data);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case "pending_approval":
        return <Badge className="bg-verification text-verification-foreground">Pending Review</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "sold":
        return <Badge variant="secondary">Sold</Badge>;
      case "expired":
        return <Badge variant="outline">Expired</Badge>;
      default:
        return <Badge variant="secondary">{status || "Draft"}</Badge>;
    }
  };

  const handleDeleteListing = async (id: string) => {
    const success = await deleteListing(id);
    if (success) {
      setListings(listings.filter((l) => l.id !== id));
    }
  };

  const handleMarkAsSold = async (id: string) => {
    const success = await updateListing(id, { status: "sold" });
    if (success) {
      setListings(listings.map((l) => 
        l.id === id ? { ...l, status: "sold" as const } : l
      ));
    }
  };

  const activeListings = listings.filter((l) => l.status === "active").length;
  const totalViews = listings.reduce((sum, l) => sum + (l.views_count || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - List Your Car</title>
        <meta name="description" content="Manage your car listings, messages, and profile on List Your Car." />
      </Helmet>

      <div className="min-h-screen bg-muted/30">
        <Navbar />

        <main className="pt-20 pb-12">
          <div className="container-wide py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold">
                  Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}!
                </h1>
                <p className="text-muted-foreground">Manage your listings and connect with buyers</p>
              </div>
              <Link to="/sell">
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> List a Car
                </Button>
              </Link>
            </div>

            {/* Verification Banner */}
            {!verificationLoading && !isVerified && !isPending && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-verification/10 border border-verification/20 rounded-xl p-4 mb-8"
              >
                <div className="flex items-center gap-4">
                  <AlertCircle className="h-6 w-6 text-verification flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium">Complete your verification</p>
                    <p className="text-sm text-muted-foreground">Verify your identity to start listing cars</p>
                  </div>
                  <Link to="/sell">
                    <Button variant="outline" size="sm">
                      Verify Now <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}

            {isPending && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-verification/10 border border-verification/20 rounded-xl p-4 mb-8"
              >
                <div className="flex items-center gap-4">
                  <Clock className="h-6 w-6 text-verification flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium">Verification under review</p>
                    <p className="text-sm text-muted-foreground">We're reviewing your documents. This usually takes 24 hours.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Active Listings", value: activeListings.toString(), icon: Car, color: "text-primary" },
                { label: "Total Views", value: totalViews.toString(), icon: Eye, color: "text-success" },
                { label: "Total Listings", value: listings.length.toString(), icon: MessageCircle, color: "text-verification" },
                { label: "Status", value: isVerified ? "Verified" : isPending ? "Pending" : "Unverified", icon: Shield, color: isVerified ? "text-success" : "text-verification" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-xl border border-border p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    {stat.label === "Status" && isVerified && (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    )}
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Main Content */}
            <Tabs defaultValue="listings" className="space-y-6">
              <TabsList>
                <TabsTrigger value="listings">My Listings</TabsTrigger>
                <TabsTrigger value="messages" className="relative">
                  Messages
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-medium px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {unreadCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>

              <TabsContent value="listings" className="space-y-4">
                {listings.length === 0 ? (
                  <div className="bg-card rounded-xl border border-border p-12 text-center">
                    <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No listings yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first listing to start selling</p>
                    <Link to="/sell">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" /> List Your Car
                      </Button>
                    </Link>
                  </div>
                ) : (
                  listings.map((listing) => (
                    <motion.div
                      key={listing.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card rounded-xl border border-border overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-48 h-40 md:h-auto bg-muted">
                          <img
                            src={listing.images?.[0] || "/placeholder.svg"}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4 md:p-6">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{listing.title}</h3>
                              <p className="text-xl font-bold text-primary">{formatPrice(listing.price)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(listing.status)}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleMarkAsSold(listing.id)}>
                                    Mark as Sold
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => handleDeleteListing(listing.id)}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm text-muted-foreground mt-4">
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" /> {listing.views_count || 0} views
                            </span>
                            <span className="flex items-center gap-1">
                              <Car className="h-4 w-4" /> {listing.mileage?.toLocaleString() || 0} km
                            </span>
                          </div>

                          {listing.status === "pending_approval" && (
                            <div className="flex items-center gap-2 mt-4 text-sm text-verification">
                              <Clock className="h-4 w-4" />
                              Under review - typically takes 24 hours
                            </div>
                          )}

                          {listing.status === "rejected" && listing.rejection_reason && (
                            <div className="flex items-center gap-2 mt-4 text-sm text-destructive">
                              <AlertCircle className="h-4 w-4" />
                              {listing.rejection_reason}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="messages">
                <MessagesTab />
              </TabsContent>

              <TabsContent value="profile">
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User className="h-10 w-10 text-primary" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{profile?.full_name || "User"}</h2>
                      <p className="text-muted-foreground">{profile?.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {isVerified ? (
                          <Badge className="bg-success text-success-foreground">
                            <Shield className="h-3 w-3 mr-1" /> Verified Seller
                          </Badge>
                        ) : isPending ? (
                          <Badge variant="secondary">
                            <Clock className="h-3 w-3 mr-1" /> Verification Pending
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <AlertCircle className="h-3 w-3 mr-1" /> Unverified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <span>Personal Information</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        <span>Verification Documents</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isVerified && <CheckCircle2 className="h-4 w-4 text-success" />}
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div className="flex items-center gap-3">
                        <Settings className="h-5 w-5 text-muted-foreground" />
                        <span>Account Settings</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Dashboard;
