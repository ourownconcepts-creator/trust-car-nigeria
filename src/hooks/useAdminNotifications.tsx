import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRoles } from "@/hooks/useUserRoles";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type CarListing = Database["public"]["Tables"]["car_listings"]["Row"];
type Verification = Database["public"]["Tables"]["verifications"]["Row"];

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
}

interface AdminNotification {
  id: string;
  type: "listing" | "verification" | "fraud";
  title: string;
  message: string;
  timestamp: string;
  data?: any;
}

export const useAdminNotifications = () => {
  const { isAdmin } = useUserRoles();
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [pendingListingsCount, setPendingListingsCount] = useState(0);
  const [pendingVerificationsCount, setPendingVerificationsCount] = useState(0);
  const [fraudAlertsCount, setFraudAlertsCount] = useState(0);

  const addNotification = useCallback((notification: Omit<AdminNotification, "id" | "timestamp">) => {
    const newNotification: AdminNotification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    
    setNotifications((prev) => [newNotification, ...prev].slice(0, 50));
    
    // Show toast notification
    toast.info(notification.title, {
      description: notification.message,
    });
  }, []);

  useEffect(() => {
    if (!isAdmin()) return;

    // Fetch initial counts
    const fetchCounts = async () => {
      const [listingsRes, verificationsRes, alertsRes] = await Promise.all([
        supabase
          .from("car_listings")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending_approval"),
        supabase
          .from("verifications")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("fraud_alerts")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
      ]);

      setPendingListingsCount(listingsRes.count || 0);
      setPendingVerificationsCount(verificationsRes.count || 0);
      setFraudAlertsCount(alertsRes.count || 0);
    };

    fetchCounts();

    // Subscribe to real-time updates for new listings
    const listingsChannel = supabase
      .channel("admin-listings")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "car_listings",
          filter: "status=eq.pending_approval",
        },
        (payload) => {
          const listing = payload.new as CarListing;
          console.log("New listing submitted:", listing.title);
          
          setPendingListingsCount((prev) => prev + 1);
          addNotification({
            type: "listing",
            title: "New Listing Submitted",
            message: `${listing.title} is awaiting approval`,
            data: listing,
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "car_listings",
        },
        (payload) => {
          const listing = payload.new as CarListing;
          const oldListing = payload.old as Partial<CarListing>;
          
          // If status changed from pending_approval to something else
          if (oldListing.status === "pending_approval" && listing.status !== "pending_approval") {
            setPendingListingsCount((prev) => Math.max(0, prev - 1));
          }
          // If status changed to pending_approval
          if (oldListing.status !== "pending_approval" && listing.status === "pending_approval") {
            setPendingListingsCount((prev) => prev + 1);
          }
        }
      )
      .subscribe();

    // Subscribe to real-time updates for verifications
    const verificationsChannel = supabase
      .channel("admin-verifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "verifications",
          filter: "status=eq.pending",
        },
        (payload) => {
          const verification = payload.new as Verification;
          console.log("New verification submitted:", verification.user_id);
          
          setPendingVerificationsCount((prev) => prev + 1);
          addNotification({
            type: "verification",
            title: "New Verification Request",
            message: `A user has submitted verification documents`,
            data: verification,
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "verifications",
        },
        (payload) => {
          const verification = payload.new as Verification;
          const oldVerification = payload.old as Partial<Verification>;
          
          if (oldVerification.status === "pending" && verification.status !== "pending") {
            setPendingVerificationsCount((prev) => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    // Subscribe to real-time updates for fraud alerts
    const fraudChannel = supabase
      .channel("admin-fraud")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "fraud_alerts",
        },
        (payload) => {
          const alert = payload.new as FraudAlert;
          console.log("New fraud alert:", alert.alert_type);
          
          setFraudAlertsCount((prev) => prev + 1);
          addNotification({
            type: "fraud",
            title: `Fraud Alert: ${alert.severity.toUpperCase()}`,
            message: alert.message,
            data: alert,
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "fraud_alerts",
        },
        (payload) => {
          const alert = payload.new as FraudAlert;
          const oldAlert = payload.old as Partial<FraudAlert>;
          
          if (oldAlert.status === "pending" && alert.status !== "pending") {
            setFraudAlertsCount((prev) => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(listingsChannel);
      supabase.removeChannel(verificationsChannel);
      supabase.removeChannel(fraudChannel);
    };
  }, [isAdmin, addNotification]);

  const clearNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    pendingListingsCount,
    pendingVerificationsCount,
    fraudAlertsCount,
    clearNotifications,
    totalPendingCount: pendingListingsCount + pendingVerificationsCount + fraudAlertsCount,
  };
};
