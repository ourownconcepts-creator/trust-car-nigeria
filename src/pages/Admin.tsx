import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Car, Shield, AlertTriangle, CheckCircle2, XCircle,
  Eye, Search, Clock, Activity, Bell, Loader2, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import Logo from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";
import AdminContactMessages from "@/components/AdminContactMessages";

type CarListing = Database["public"]["Tables"]["car_listings"]["Row"];
type Verification = Database["public"]["Tables"]["verifications"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ListingWithProfile extends CarListing {
  profiles?: Profile | null;
}

interface VerificationWithProfile extends Verification {
  profiles?: Profile | null;
}

interface FraudAlert {
  id: string;
  listing_id: string | null;
  alert_type: string;
  severity: string;
  message: string;
  related_listing_id: string | null;
  similarity_score: number | null;
  status: string;
  created_at: string;
  listing?: CarListing | null;
  related_listing?: CarListing | null;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, loading: rolesLoading } = useUserRoles();
  const { 
    notifications, 
    pendingListingsCount, 
    pendingVerificationsCount, 
    fraudAlertsCount,
    totalPendingCount,
    clearNotifications 
  } = useAdminNotifications();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingListings, setPendingListings] = useState<ListingWithProfile[]>([]);
  const [pendingVerifications, setPendingVerifications] = useState<VerificationWithProfile[]>([]);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
  const [contactMessagesCount, setContactMessagesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; id: string; type: "listing" | "verification" }>({
    open: false,
    id: "",
    type: "listing",
  });
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (!rolesLoading && !isAdmin()) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
    }
  }, [rolesLoading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin()) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      const [listingsRes, verificationsRes, alertsRes, contactRes] = await Promise.all([
        supabase
          .from("car_listings")
          .select("*")
          .eq("status", "pending_approval")
          .order("created_at", { ascending: false }),
        supabase
          .from("verifications")
          .select("*")
          .eq("status", "pending")
          .order("created_at", { ascending: false }),
        supabase
          .from("fraud_alerts")
          .select("*")
          .eq("status", "pending")
          .order("created_at", { ascending: false }),
        supabase
          .from("contact_messages")
          .select("id", { count: "exact" })
          .eq("status", "unread"),
      ]);

      if (listingsRes.error) throw listingsRes.error;
      if (verificationsRes.error) throw verificationsRes.error;
      
      setContactMessagesCount(contactRes.count || 0);

      // Fetch profiles for listings
      const listingUserIds = listingsRes.data?.map((l) => l.user_id) || [];
      const verificationUserIds = verificationsRes.data?.map((v) => v.user_id) || [];
      const allUserIds = [...new Set([...listingUserIds, ...verificationUserIds])];

      let profilesMap: Record<string, Profile> = {};
      if (allUserIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("*")
          .in("id", allUserIds);
        
        profilesMap = (profiles || []).reduce((acc, p) => {
          acc[p.id] = p;
          return acc;
        }, {} as Record<string, Profile>);
      }

      setPendingListings(
        (listingsRes.data || []).map((l) => ({
          ...l,
          profiles: profilesMap[l.user_id] || null,
        }))
      );

      setPendingVerifications(
        (verificationsRes.data || []).map((v) => ({
          ...v,
          profiles: profilesMap[v.user_id] || null,
        }))
      );

      // Fetch related listings for fraud alerts
      if (alertsRes.data && alertsRes.data.length > 0) {
        const alertListingIds = alertsRes.data
          .flatMap((a: any) => [a.listing_id, a.related_listing_id])
          .filter(Boolean);

        let alertListingsMap: Record<string, CarListing> = {};
        if (alertListingIds.length > 0) {
          const { data: alertListings } = await supabase
            .from("car_listings")
            .select("*")
            .in("id", alertListingIds);
          
          alertListingsMap = (alertListings || []).reduce((acc, l) => {
            acc[l.id] = l;
            return acc;
          }, {} as Record<string, CarListing>);
        }

        setFraudAlerts(
          (alertsRes.data as FraudAlert[]).map((a) => ({
            ...a,
            listing: a.listing_id ? alertListingsMap[a.listing_id] : null,
            related_listing: a.related_listing_id ? alertListingsMap[a.related_listing_id] : null,
          }))
        );
      } else {
        setFraudAlerts([]);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleApproveListing = async (id: string) => {
    try {
      const { error } = await supabase
        .from("car_listings")
        .update({
          status: "active",
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Listing approved");
      setPendingListings(pendingListings.filter((l) => l.id !== id));
    } catch (error: any) {
      toast.error(error.message || "Failed to approve listing");
    }
  };

  const handleRejectListing = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      const { error } = await supabase
        .from("car_listings")
        .update({
          status: "rejected",
          rejection_reason: rejectionReason,
        })
        .eq("id", rejectDialog.id);

      if (error) throw error;
      
      toast.success("Listing rejected");
      setPendingListings(pendingListings.filter((l) => l.id !== rejectDialog.id));
      setRejectDialog({ open: false, id: "", type: "listing" });
      setRejectionReason("");
    } catch (error: any) {
      toast.error(error.message || "Failed to reject listing");
    }
  };

  const handleApproveVerification = async (id: string, userId: string) => {
    try {
      const [verificationUpdate, profileUpdate] = await Promise.all([
        supabase
          .from("verifications")
          .update({
            status: "approved",
            reviewed_by: user?.id,
            reviewed_at: new Date().toISOString(),
          })
          .eq("id", id),
        supabase
          .from("profiles")
          .update({ is_verified: true })
          .eq("id", userId),
      ]);

      if (verificationUpdate.error) throw verificationUpdate.error;
      if (profileUpdate.error) throw profileUpdate.error;
      
      toast.success("Verification approved");
      setPendingVerifications(pendingVerifications.filter((v) => v.id !== id));
    } catch (error: any) {
      toast.error(error.message || "Failed to approve verification");
    }
  };

  const handleRejectVerification = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      const { error } = await supabase
        .from("verifications")
        .update({
          status: "rejected",
          rejection_reason: rejectionReason,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", rejectDialog.id);

      if (error) throw error;
      
      toast.success("Verification rejected");
      setPendingVerifications(pendingVerifications.filter((v) => v.id !== rejectDialog.id));
      setRejectDialog({ open: false, id: "", type: "verification" });
      setRejectionReason("");
    } catch (error: any) {
      toast.error(error.message || "Failed to reject verification");
    }
  };

  const handleDismissAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from("fraud_alerts")
        .update({
          status: "reviewed",
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", alertId);

      if (error) throw error;
      
      toast.success("Alert dismissed");
      setFraudAlerts(fraudAlerts.filter((a) => a.id !== alertId));
    } catch (error: any) {
      toast.error(error.message || "Failed to dismiss alert");
    }
  };

  if (rolesLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin()) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - List Your Car</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-muted/30">
        {/* Admin Sidebar */}
        <aside className="fixed left-0 top-0 h-full w-64 bg-primary text-primary-foreground p-6 hidden lg:block">
          <div className="mb-8">
            <Logo size="md" />
          </div>

          <nav className="space-y-2">
            {[
              { label: "Dashboard", icon: Activity, active: true },
              { label: "Listings", icon: Car, badge: pendingListingsCount },
              { label: "Verifications", icon: Shield, badge: pendingVerificationsCount },
              { label: "Messages", icon: MessageSquare, badge: contactMessagesCount },
              { label: "Users", icon: Users },
              { label: "Fraud Alerts", icon: AlertTriangle, badge: fraudAlertsCount },
            ].map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                  item.active ? "bg-primary-foreground/20" : "hover:bg-primary-foreground/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="lg:ml-64 p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage listings, verifications, and monitor fraud</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Notifications Sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {totalPendingCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                        {totalPendingCount > 99 ? "99+" : totalPendingCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle className="flex items-center justify-between">
                      Notifications
                      {notifications.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearNotifications}>
                          Clear all
                        </Button>
                      )}
                    </SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-100px)] mt-4">
                    <AnimatePresence>
                      {notifications.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          No new notifications
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={`p-4 border-b border-border ${
                              notification.type === "fraud" 
                                ? "bg-destructive/5" 
                                : notification.type === "verification" 
                                ? "bg-primary/5" 
                                : "bg-verification/5"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {notification.type === "listing" && <Car className="h-5 w-5 text-verification" />}
                              {notification.type === "verification" && <Shield className="h-5 w-5 text-primary" />}
                              {notification.type === "fraud" && <AlertTriangle className="h-5 w-5 text-destructive" />}
                              <div>
                                <p className="font-medium text-sm">{notification.title}</p>
                                <p className="text-xs text-muted-foreground">{notification.message}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(notification.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Pending Listings", value: pendingListings.length.toString(), icon: Car, color: "text-verification" },
              { label: "Pending Verifications", value: pendingVerifications.length.toString(), icon: Shield, color: "text-primary" },
              { label: "Fraud Alerts", value: fraudAlerts.length.toString(), icon: AlertTriangle, color: "text-destructive" },
              { label: "Unread Messages", value: contactMessagesCount.toString(), icon: MessageSquare, color: "text-primary" },
              { label: "Total Pending", value: (totalPendingCount + contactMessagesCount).toString(), icon: Activity, color: "text-success" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border border-border p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="listings" className="space-y-6">
            <TabsList>
              <TabsTrigger value="listings" className="relative">
                Pending Listings
                {pendingListings.length > 0 && (
                  <span className="ml-2 bg-verification text-verification-foreground text-xs px-1.5 py-0.5 rounded-full">
                    {pendingListings.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="verifications" className="relative">
                Verifications
                {pendingVerifications.length > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                    {pendingVerifications.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="fraud" className="relative">
                Fraud Alerts
                {fraudAlerts.length > 0 && (
                  <span className="ml-2 bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full">
                    {fraudAlerts.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="messages" className="relative">
                Contact Messages
                {contactMessagesCount > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                    {contactMessagesCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Pending Listings */}
            <TabsContent value="listings" className="space-y-4">
              {pendingListings.length === 0 ? (
                <div className="bg-card rounded-xl border border-border p-12 text-center">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-success mb-4" />
                  <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                  <p className="text-muted-foreground">No pending listings to review</p>
                </div>
              ) : (
                pendingListings.map((listing) => (
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
                          <Badge variant="secondary">
                            {listing.profiles?.is_verified ? "Verified Seller" : "Unverified"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                          <div>
                            <span className="font-medium text-foreground">Seller:</span>{" "}
                            {listing.profiles?.full_name || "Unknown"}
                          </div>
                          <div>
                            <span className="font-medium text-foreground">VIN:</span> {listing.vin}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" /> 
                            Submitted: {new Date(listing.created_at || "").toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Location:</span> {listing.location}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            className="bg-success hover:bg-success/90"
                            onClick={() => handleApproveListing(listing.id)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => setRejectDialog({ open: true, id: listing.id, type: "listing" })}
                          >
                            <XCircle className="h-4 w-4 mr-1" /> Reject
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" /> Review
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </TabsContent>

            {/* Verifications */}
            <TabsContent value="verifications" className="space-y-4">
              {pendingVerifications.length === 0 ? (
                <div className="bg-card rounded-xl border border-border p-12 text-center">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-success mb-4" />
                  <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                  <p className="text-muted-foreground">No pending verifications to review</p>
                </div>
              ) : (
                pendingVerifications.map((verification) => (
                  <motion.div
                    key={verification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card rounded-xl border border-border p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {verification.profiles?.full_name || "Unknown User"}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="capitalize">
                              {verification.verification_type}
                            </Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" /> 
                              {new Date(verification.created_at || "").toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-3">Submitted Documents:</p>
                      <div className="flex flex-wrap gap-4 mb-4">
                        {verification.document_url && (
                          <a 
                            href={verification.document_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary underline"
                          >
                            View ID Document
                          </a>
                        )}
                        {verification.selfie_url && (
                          <a 
                            href={verification.selfie_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary underline"
                          >
                            View Selfie
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          className="bg-success hover:bg-success/90"
                          onClick={() => handleApproveVerification(verification.id, verification.user_id)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Verify
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => setRejectDialog({ open: true, id: verification.id, type: "verification" })}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </TabsContent>

            {/* Fraud Alerts */}
            <TabsContent value="fraud" className="space-y-4">
              {fraudAlerts.length === 0 ? (
                <div className="bg-card rounded-xl border border-border p-12 text-center">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-success mb-4" />
                  <h3 className="text-lg font-medium mb-2">No fraud alerts</h3>
                  <p className="text-muted-foreground">The system is monitoring for suspicious activity</p>
                </div>
              ) : (
                fraudAlerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-xl border p-6 ${
                      alert.severity === "high"
                        ? "bg-destructive/10 border-destructive/20"
                        : "bg-verification/10 border-verification/20"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <AlertTriangle
                        className={`h-6 w-6 flex-shrink-0 ${
                          alert.severity === "high" ? "text-destructive" : "text-verification"
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={alert.severity === "high" ? "destructive" : "secondary"}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {alert.alert_type.replace("_", " ")}
                          </Badge>
                          {alert.similarity_score && (
                            <Badge variant="outline">
                              {alert.similarity_score}% match
                            </Badge>
                          )}
                          <span className="text-sm text-muted-foreground">
                            {new Date(alert.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="font-medium mb-2">{alert.message}</p>
                        
                        {alert.listing && (
                          <p className="text-sm text-muted-foreground">
                            Listing: <span className="text-foreground">{alert.listing.title}</span>
                          </p>
                        )}
                        {alert.related_listing && (
                          <p className="text-sm text-muted-foreground">
                            Related to: <span className="text-foreground">{alert.related_listing.title}</span>
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" /> Investigate
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleDismissAlert(alert.id)}
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </TabsContent>

            {/* Contact Messages */}
            <TabsContent value="messages">
              <AdminContactMessages />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Rejection Dialog */}
      <Dialog open={rejectDialog.open} onOpenChange={(open) => setRejectDialog({ ...rejectDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Reject {rejectDialog.type === "listing" ? "Listing" : "Verification"}
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection. This will be sent to the user.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog({ open: false, id: "", type: "listing" })}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={rejectDialog.type === "listing" ? handleRejectListing : handleRejectVerification}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Admin;
