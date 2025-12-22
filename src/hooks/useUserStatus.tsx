import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface UserStatus {
  userId: string;
  isOnline: boolean;
  lastActive: Date | null;
}

export const useUserStatus = (userIds: string[]) => {
  const { user } = useAuth();
  const [statuses, setStatuses] = useState<Map<string, UserStatus>>(new Map());

  const fetchStatuses = useCallback(async () => {
    if (userIds.length === 0) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("id, last_active")
      .in("id", userIds);

    if (!error && data) {
      const newStatuses = new Map<string, UserStatus>();
      data.forEach((profile) => {
        const lastActive = profile.last_active ? new Date(profile.last_active) : null;
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const isOnline = lastActive ? lastActive > fiveMinutesAgo : false;

        newStatuses.set(profile.id, {
          userId: profile.id,
          isOnline,
          lastActive,
        });
      });
      setStatuses(newStatuses);
    }
  }, [userIds]);

  // Update own status periodically
  const updateOwnStatus = useCallback(async () => {
    if (!user) return;

    await supabase
      .from("profiles")
      .update({ last_active: new Date().toISOString() })
      .eq("id", user.id);
  }, [user]);

  useEffect(() => {
    fetchStatuses();

    // Refresh statuses every 30 seconds
    const interval = setInterval(fetchStatuses, 30000);

    return () => clearInterval(interval);
  }, [fetchStatuses]);

  // Update own status on mount and every minute
  useEffect(() => {
    if (!user) return;

    updateOwnStatus();
    const interval = setInterval(updateOwnStatus, 60000);

    return () => clearInterval(interval);
  }, [user, updateOwnStatus]);

  const getStatus = (userId: string): UserStatus => {
    return statuses.get(userId) || {
      userId,
      isOnline: false,
      lastActive: null,
    };
  };

  return {
    statuses,
    getStatus,
    refetch: fetchStatuses,
  };
};
