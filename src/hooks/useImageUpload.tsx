import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UploadResult {
  url: string;
  path: string;
}

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadImage = async (
    file: File,
    bucket: string = "car-images",
    folder?: string
  ): Promise<UploadResult | null> => {
    try {
      setUploading(true);
      setProgress(0);

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return null;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Image must be less than 5MB");
        return null;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to upload images");
        return null;
      }

      // Create file path
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = folder 
        ? `${user.id}/${folder}/${fileName}`
        : `${user.id}/${fileName}`;

      setProgress(30);

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      setProgress(70);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setProgress(100);

      return {
        url: publicUrl,
        path: filePath,
      };
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const uploadMultipleImages = async (
    files: File[],
    bucket: string = "car-images",
    folder?: string
  ): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];
    
    for (const file of files) {
      const result = await uploadImage(file, bucket, folder);
      if (result) {
        results.push(result);
      }
    }
    
    return results;
  };

  const deleteImage = async (path: string, bucket: string = "car-images") => {
    try {
      const { error } = await supabase.storage.from(bucket).remove([path]);
      if (error) throw error;
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to delete image");
      return false;
    }
  };

  return {
    uploadImage,
    uploadMultipleImages,
    deleteImage,
    uploading,
    progress,
  };
};
