import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useImageUpload } from "@/hooks/useImageUpload";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type VerificationStatus = Database["public"]["Enums"]["verification_status"];

interface Verification {
  id: string;
  verification_type: string;
  status: VerificationStatus;
  document_url: string | null;
  selfie_url: string | null;
  created_at: string | null;
}

export const useVerification = () => {
  const { user } = useAuth();
  const { uploadImage, uploading } = useImageUpload();
  const [verification, setVerification] = useState<Verification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setVerification(null);
      setLoading(false);
      return;
    }

    fetchVerification();
  }, [user]);

  const fetchVerification = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("verifications")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      setVerification(data);
    } catch (error) {
      console.error("Error fetching verification:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (file: File) => {
    if (!user) {
      toast.error("You must be logged in");
      return null;
    }

    const result = await uploadImage(file, "verification-docs", "documents");
    return result;
  };

  const uploadSelfie = async (file: File) => {
    if (!user) {
      toast.error("You must be logged in");
      return null;
    }

    const result = await uploadImage(file, "verification-docs", "selfies");
    return result;
  };

  const submitVerification = async (
    documentUrl: string,
    selfieUrl: string,
    verificationType: string = "private_seller"
  ) => {
    if (!user) {
      toast.error("You must be logged in");
      return false;
    }

    try {
      const { error } = await supabase.from("verifications").insert({
        user_id: user.id,
        verification_type: verificationType,
        document_url: documentUrl,
        selfie_url: selfieUrl,
        status: "pending",
      });

      if (error) throw error;

      toast.success("Verification submitted! We'll review your documents within 24 hours.");
      await fetchVerification();
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to submit verification");
      return false;
    }
  };

  const isVerified = verification?.status === "approved";
  const isPending = verification?.status === "pending";
  const isRejected = verification?.status === "rejected";

  return {
    verification,
    loading,
    uploading,
    uploadDocument,
    uploadSelfie,
    submitVerification,
    isVerified,
    isPending,
    isRejected,
    refetch: fetchVerification,
  };
};
