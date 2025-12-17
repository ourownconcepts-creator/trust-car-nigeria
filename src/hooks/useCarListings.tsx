import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useImageUpload } from "@/hooks/useImageUpload";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type CarListing = Database["public"]["Tables"]["car_listings"]["Row"];
type CarListingInsert = Database["public"]["Tables"]["car_listings"]["Insert"];

export const useCarListings = () => {
  const { user, session } = useAuth();
  const { uploadMultipleImages, uploading } = useImageUpload();
  const [listings, setListings] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from("car_listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserListings = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from("car_listings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching user listings:", error);
      return [];
    }
  };

  const analyzeListingImages = async (listingId: string, imageUrls: string[]) => {
    if (!session?.access_token || imageUrls.length === 0) return;

    try {
      console.log("Analyzing listing images for fraud detection...");
      const { data, error } = await supabase.functions.invoke("analyze-listing-images", {
        body: { listingId, imageUrls },
      });

      if (error) {
        console.error("Error analyzing images:", error);
        return;
      }

      if (data?.alertsCreated > 0) {
        console.log(`Created ${data.alertsCreated} fraud alerts`);
      }
    } catch (error) {
      console.error("Error calling analyze-listing-images:", error);
    }
  };

  const createListing = async (
    listingData: Omit<CarListingInsert, "user_id" | "id">,
    imageFiles: File[]
  ) => {
    if (!user) {
      toast.error("You must be logged in to create a listing");
      return null;
    }

    try {
      // Upload images first
      const uploadedImages = await uploadMultipleImages(imageFiles, "car-images", "listings");
      const imageUrls = uploadedImages.map((img) => img.url);

      // Create listing
      const { data, error } = await supabase
        .from("car_listings")
        .insert({
          ...listingData,
          user_id: user.id,
          images: imageUrls,
          status: "pending_approval",
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Listing submitted for review!");
      
      // Trigger fraud detection analysis in background
      if (data && imageUrls.length > 0) {
        analyzeListingImages(data.id, imageUrls);
      }

      await fetchListings();
      return data;
    } catch (error: any) {
      toast.error(error.message || "Failed to create listing");
      return null;
    }
  };

  const updateListing = async (id: string, updates: Partial<CarListing>) => {
    try {
      const { error } = await supabase
        .from("car_listings")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
      await fetchListings();
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to update listing");
      return false;
    }
  };

  const deleteListing = async (id: string) => {
    try {
      const { error } = await supabase
        .from("car_listings")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Listing deleted");
      await fetchListings();
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to delete listing");
      return false;
    }
  };

  return {
    listings,
    loading,
    uploading,
    fetchListings,
    fetchUserListings,
    createListing,
    updateListing,
    deleteListing,
  };
};
