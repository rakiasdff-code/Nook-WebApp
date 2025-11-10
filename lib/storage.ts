import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./firebase";

/**
 * Upload an image to Firebase Storage
 * @param file - The image file to upload
 * @param userId - The user's ID
 * @param type - Type of image: "profile" or "banner"
 * @returns The download URL of the uploaded image
 */
export async function uploadImage(
  file: File,
  userId: string,
  type: "profile" | "banner",
): Promise<string> {
  try {
    // Validate file
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Image must be less than 5MB");
    }

    // Create a reference to the file location
    const fileExtension = file.name.split(".").pop() || "jpg";
    const filePath = `users/${userId}/${type}.${fileExtension}`;
    const storageRef = ref(storage, filePath);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error(`Error uploading ${type} image:`, error);
    throw error;
  }
}

/**
 * Delete an image from Firebase Storage
 * @param userId - The user's ID
 * @param type - Type of image: "profile" or "banner"
 */
export async function deleteImage(
  userId: string,
  type: "profile" | "banner",
): Promise<void> {
  try {
    // Try common image extensions
    const extensions = ["jpg", "jpeg", "png", "gif", "webp"];

    for (const ext of extensions) {
      try {
        const filePath = `users/${userId}/${type}.${ext}`;
        const storageRef = ref(storage, filePath);
        await deleteObject(storageRef);
        return; // If successful, exit
      } catch (error: any) {
        // If file not found, continue to next extension
        if (error.code !== "storage/object-not-found") {
          throw error;
        }
      }
    }
  } catch (error) {
    console.error(`Error deleting ${type} image:`, error);
    // Don't throw error if deletion fails - image might not exist
  }
}

/**
 * Convert File to base64 for preview (client-side only)
 * @param file - The file to convert
 * @returns Promise with base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
