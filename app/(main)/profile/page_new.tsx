"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
import { Camera, Palette, Mail, User, Calendar, Check, X } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadImage, fileToBase64 } from "@/lib/storage";

// Available genres
const AVAILABLE_GENRES = [
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Thriller",
  "Romance",
  "Historical Fiction",
  "Contemporary",
  "Young Adult",
  "Horror",
  "Literary Fiction",
  "Classics",
  "Poetry",
  "Memoir",
  "Biography",
  "Self-Help",
  "Philosophy",
  "True Crime",
  "Adventure",
  "Dystopian",
  "Magic Realism",
  "Gothic",
  "Western",
  "Graphic Novels",
  "Short Stories",
];

// Banner color/gradient options
const BANNER_OPTIONS = [
  { name: "Olive Green", value: "#566033" },
  { name: "Warm Brown", value: "#4D453F" },
  {
    name: "Forest Gradient",
    value: "linear-gradient(135deg, #566033 0%, #5F6B39 100%)",
  },
  {
    name: "Earthy Gradient",
    value: "linear-gradient(135deg, #4D453F 0%, #8B7968 100%)",
  },
  {
    name: "Sage Gradient",
    value: "linear-gradient(135deg, #7B8A5C 0%, #A3A692 100%)",
  },
];

export default function ProfilePage() {
  const { user, userProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    userProfile?.favoriteGenres || [],
  );
  const [displayName, setDisplayName] = useState(
    userProfile?.displayName || "",
  );
  const [aboutText, setAboutText] = useState(userProfile?.bio || "");
  const [profileImage, setProfileImage] = useState<string | null>(
    userProfile?.photoURL || null,
  );
  const [bannerImage, setBannerImage] = useState<string | null>(
    userProfile?.bannerImage || null,
  );
  const [bannerBackground, setBannerBackground] = useState<string>(
    userProfile?.bannerColor || BANNER_OPTIONS[0].value,
  );
  const [showBannerMenu, setShowBannerMenu] = useState(false);
  const [showAllGenres, setShowAllGenres] = useState(false);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Update local state when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setSelectedGenres(userProfile.favoriteGenres || []);
      setDisplayName(userProfile.displayName || "");
      setAboutText(userProfile.bio || "");
      setProfileImage(userProfile.photoURL || null);
      setBannerImage(userProfile.bannerImage || null);
      setBannerBackground(userProfile.bannerColor || BANNER_OPTIONS[0].value);
    }
  }, [userProfile]);

  const getInitials = () => {
    if (userProfile?.displayName) {
      return userProfile.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.[0].toUpperCase() || "U";
  };

  const formatDate = (date: any) => {
    if (!date) return "N/A";
    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const handleGenreToggle = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleProfileImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image too large", {
          description: "Profile image must be less than 5MB",
        });
        return;
      }

      setProfileFile(file);

      try {
        const preview = await fileToBase64(file);
        setProfileImage(preview);
      } catch (error) {
        console.error("Error generating preview:", error);
        toast.error("Error loading image preview");
      }
    }
  };

  const handleBannerImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image too large", {
          description: "Banner image must be less than 5MB",
        });
        return;
      }

      setBannerFile(file);

      try {
        const preview = await fileToBase64(file);
        setBannerImage(preview);
        setBannerBackground("");
      } catch (error) {
        console.error("Error generating preview:", error);
        toast.error("Error loading image preview");
      }
    }
  };

  const handleBannerBackgroundSelect = (background: string) => {
    setBannerBackground(background);
    setBannerImage(null);
    setBannerFile(null);
    setShowBannerMenu(false);
  };

  const handleSave = async () => {
    if (!user) return;

    setIsUploading(true);

    try {
      let profileImageURL = profileImage;
      let bannerImageURL = bannerImage;

      if (profileFile) {
        toast.info("Uploading profile image...");
        profileImageURL = await uploadImage(profileFile, user.uid, "profile");
      }

      if (bannerFile) {
        toast.info("Uploading banner image...");
        bannerImageURL = await uploadImage(bannerFile, user.uid, "banner");
      }

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName:
          displayName.trim() || user.email?.split("@")[0] || "Reader",
        bio: aboutText,
        photoURL: profileImageURL,
        bannerImage: bannerFile ? bannerImageURL : bannerImage,
        bannerColor: bannerFile ? "" : bannerBackground,
        favoriteGenres: selectedGenres,
        updatedAt: new Date(),
      });

      setProfileFile(null);
      setBannerFile(null);

      toast.success("Profile updated successfully", {
        description: "Your changes have been saved",
      });
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile", {
        description: error.message || "Please try again later",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const displayedGenres = showAllGenres
    ? AVAILABLE_GENRES
    : AVAILABLE_GENRES.slice(0, 12);

  return (
    <div className="min-h-screen bg-[#EFF0EB] pb-16">
      {/* Banner Section */}
      <div className="relative w-full" style={{ aspectRatio: "16/3" }}>
        {/* Banner Background */}
        <div
          className="absolute inset-0 w-full h-full"
          style={
            bannerImage
              ? {
                  backgroundImage: `url(${bannerImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : { background: bannerBackground }
          }
          onMouseEnter={() => isEditing && setShowBannerMenu(true)}
          onMouseLeave={() => setShowBannerMenu(false)}
        >
          {/* Banner Edit Overlay */}
          {isEditing && showBannerMenu && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-center">
                <Palette className="w-12 h-12 text-white mx-auto mb-2" />
                <p className="text-white text-lg font-medium">
                  Set your ambience
                </p>
              </div>
            </div>
          )}

          {/* Banner Menu */}
          {isEditing && showBannerMenu && (
            <div className="absolute top-4 right-4 bg-[#FCFBF8] rounded-xl p-4 w-80 shadow-xl z-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-serif font-semibold text-lg text-[#5F6B39]">
                  Choose background
                </h4>
                <button
                  onClick={() => setShowBannerMenu(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                {BANNER_OPTIONS.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleBannerBackgroundSelect(option.value)}
                    className="h-16 rounded-lg border-2 border-gray-300 hover:border-[#5F6B39] transition-all overflow-hidden"
                    style={{ background: option.value }}
                    title={option.name}
                  />
                ))}
              </div>

              <button
                onClick={() => {
                  bannerInputRef.current?.click();
                  setShowBannerMenu(false);
                }}
                className="w-full px-4 py-2 bg-white border-2 border-[#5F6B39] text-[#5F6B39] rounded-lg hover:bg-[#5F6B39] hover:text-white transition-all font-medium"
              >
                Upload Custom Image
              </button>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div
          className="absolute left-16 w-20 h-20 rounded-full border-4 border-white bg-[#5F6B39] flex items-center justify-center text-white text-2xl font-serif font-semibold shadow-lg overflow-hidden"
          style={{ bottom: "-16px" }}
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            getInitials()
          )}
          {isEditing && (
            <button
              onClick={() => profileInputRef.current?.click()}
              className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            >
              <Camera className="w-6 h-6 text-white" />
            </button>
          )}
        </div>

        {/* Edit Button */}
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 px-6 py-2 bg-[#5F6B39] text-white rounded-lg hover:bg-[#4D5630] transition-all font-medium"
          >
            Edit my profile
          </button>
        )}

        {/* Hidden file inputs */}
        <input
          ref={profileInputRef}
          type="file"
          accept="image/*"
          onChange={handleProfileImageChange}
          className="hidden"
        />
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          onChange={handleBannerImageChange}
          className="hidden"
        />
      </div>

      {/* Content */}
      <div style={{ paddingLeft: "72px", paddingRight: "72px" }}>
        {/* Profile Name & Subtitle */}
        <div className="mt-8 mb-8">
          <h1 className="text-7xl font-serif font-semibold text-[#5F6B39] mb-2">
            {displayName ||
              userProfile?.displayName ||
              user?.email?.split("@")[0] ||
              "Reader"}
          </h1>
          <p className="text-sm font-light text-gray-600">
            Manage your personal information and reading preferences
          </p>
        </div>

        {/* General Info Card */}
        <div
          className="bg-[#FCFBF8] rounded-xl p-6 mb-8"
          style={{
            boxShadow: "0 2px 17.1px 0 rgba(0, 0, 0, 0.05)",
          }}
        >
          <h2 className="text-3xl font-serif font-semibold text-[#5F6B39] mb-6">
            General info
          </h2>

          <div className="grid grid-cols-3 gap-6">
            {/* Email */}
            <div>
              <label className="block text-base font-medium mb-2">Email</label>
              <div className="text-sm font-light text-gray-700">
                {user?.email}
              </div>
            </div>

            {/* Email Status */}
            <div>
              <label className="block text-base font-medium mb-2">
                Email Status
              </label>
              <div className="text-sm font-light text-gray-700 flex items-center gap-2">
                {user?.emailVerified ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Verified</span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 text-orange-600" />
                    <span>Not verified</span>
                  </>
                )}
              </div>
            </div>

            {/* Member Since */}
            <div>
              <label className="block text-base font-medium mb-2">
                Member Since
              </label>
              <div className="text-sm font-light text-gray-700">
                {formatDate(userProfile?.createdAt)}
              </div>
            </div>
          </div>
        </div>

        {/* About You Card */}
        <div
          className="bg-[#FCFBF8] rounded-xl p-6 mb-8"
          style={{
            boxShadow: "0 2px 17.1px 0 rgba(0, 0, 0, 0.05)",
          }}
        >
          <h2 className="text-3xl font-serif font-semibold text-[#5F6B39] mb-6">
            About you
          </h2>

          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Display Name */}
              <div>
                <label className="block text-base font-medium mb-2">
                  How should we call you?
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="The name that makes you comfortable..."
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#5F6B39] focus:outline-none transition-all text-sm font-light disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-base font-medium mb-2">
                  Tell your story
                </label>
                <textarea
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                  placeholder="Share what makes you a reader, your favorite escape, or simply say hello..."
                  disabled={!isEditing}
                  maxLength={500}
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#5F6B39] focus:outline-none transition-all text-sm font-light resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {aboutText.length} / 500
                </p>
              </div>
            </div>

            {/* Right Column - Genres */}
            <div>
              <label className="block text-base font-medium mb-2">
                Worlds you love to explore
              </label>
              <p className="text-sm font-light text-gray-600 mb-4">
                Help us suggest books that resonate with your soul
              </p>

              {/* Selected Genres */}
              {selectedGenres.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">
                    Your selected genres
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedGenres.map((genre) => (
                      <span
                        key={genre}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#5F6B39] text-white text-sm rounded-full"
                      >
                        {genre}
                        {isEditing && (
                          <button
                            onClick={() => handleGenreToggle(genre)}
                            className="hover:opacity-70"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Browse All Genres */}
              <div>
                <p className="text-sm font-medium mb-2">Browse all genres</p>
                <div className="flex flex-wrap gap-2">
                  {displayedGenres
                    .filter((g) => !selectedGenres.includes(g))
                    .map((genre) => (
                      <button
                        key={genre}
                        onClick={() => isEditing && handleGenreToggle(genre)}
                        disabled={!isEditing}
                        className="px-3 py-1.5 border-2 border-gray-300 text-[#5F6B39] text-sm rounded-full hover:border-[#5F6B39] hover:bg-[#5F6B39]/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {genre}
                      </button>
                    ))}
                </div>

                {AVAILABLE_GENRES.length > 12 && (
                  <button
                    onClick={() => setShowAllGenres(!showAllGenres)}
                    className="mt-3 text-sm text-[#5F6B39] hover:underline font-medium"
                  >
                    {showAllGenres ? "Show less" : "Show all genres"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Plan Card */}
        <div
          className="bg-[#FCFBF8] rounded-xl p-6 mb-8"
          style={{
            boxShadow: "0 2px 17.1px 0 rgba(0, 0, 0, 0.05)",
          }}
        >
          <h2 className="text-3xl font-serif font-semibold text-[#5F6B39] mb-6">
            Plan
          </h2>

          <div className="text-center max-w-md mx-auto">
            <div className="inline-block px-4 py-1.5 bg-[#5F6B39] text-white rounded-full text-sm font-medium mb-4">
              {userProfile?.subscription === "premium" ? "PREMIUM" : "FREE"}
            </div>

            <h3 className="text-xl font-semibold mb-3">
              {userProfile?.subscription === "premium"
                ? "Premium Member"
                : "Free Plan"}
            </h3>

            <p className="text-sm font-light text-gray-600 mb-6">
              {userProfile?.subscription === "premium"
                ? "Enjoy unlimited access to all Nook features"
                : "Upgrade to unlock unlimited nooks, advanced tracking, and exclusive reading insights"}
            </p>

            {userProfile?.subscription !== "premium" && (
              <button className="px-6 py-3 border-2 border-[#5F6B39] text-[#5F6B39] rounded-lg hover:bg-[#5F6B39] hover:text-white transition-all font-medium">
                Explore Premium
              </button>
            )}
          </div>
        </div>

        {/* Danger Zone Card */}
        <div
          className="bg-[#FCFBF8] rounded-xl p-6 mb-8"
          style={{
            boxShadow: "0 2px 17.1px 0 rgba(0, 0, 0, 0.05)",
          }}
        >
          <h2 className="text-3xl font-serif font-semibold text-[#5F6B39] mb-6">
            Danger zone
          </h2>

          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium mb-1">Delete Account</h4>
                <p className="text-sm font-light text-gray-600">
                  Once you delete your account, there's no going back. Please
                  be certain.
                </p>
              </div>
              <button
                onClick={() =>
                  toast.error("Feature not implemented yet", {
                    description: "Account deletion will be available soon",
                  })
                }
                className="px-6 py-2 bg-[#D14343] text-white rounded-lg hover:bg-[#B93939] transition-all font-medium whitespace-nowrap ml-4"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Save/Cancel Buttons */}
        {isEditing && (
          <div className="flex justify-end gap-4 mb-8">
            <button
              onClick={() => setIsEditing(false)}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isUploading}
              className="px-8 py-3 bg-[#5F6B39] text-white rounded-lg hover:bg-[#4D5630] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center py-8 border-t border-gray-200">
          <p className="text-sm font-light text-gray-600 mb-2">
            Need help? Contact us at{" "}
            <a
              href="mailto:support@nook.com"
              className="text-[#5F6B39] hover:underline"
            >
              support@nook.com
            </a>
          </p>
          <p className="text-xs text-gray-500">
            © 2024 Nook. All rights reserved. |{" "}
            <a href="/privacy" className="hover:underline">
              Privacy Policy
            </a>{" "}
            |{" "}
            <a href="/terms" className="hover:underline">
              Terms of Service
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

