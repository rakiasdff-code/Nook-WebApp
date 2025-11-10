"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
import { Camera, Image as ImageIcon, X, Palette } from "lucide-react";
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

// Brand color presets for banner
const BANNER_COLORS = [
  {
    name: "Sage Gradient",
    gradient: "linear-gradient(to right, #888C65, #A3A692)",
  },
  {
    name: "Forest Dream",
    gradient: "linear-gradient(to right, #555931, #888C65)",
  },
  {
    name: "Warm Beige",
    gradient: "linear-gradient(to right, #F5F1E8, #E8DCC8)",
  },
  {
    name: "Earthy Brown",
    gradient: "linear-gradient(to right, #59504A, #403935)",
  },
  {
    name: "Soft Cream",
    gradient: "linear-gradient(to right, #FEFDFB, #F2EBDF)",
  },
  {
    name: "Sunset Sage",
    gradient: "linear-gradient(135deg, #D4A574, #888C65)",
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
  const [bannerColor, setBannerColor] = useState<string>(
    userProfile?.bannerColor || BANNER_COLORS[0].gradient,
  );
  const [showBannerMenu, setShowBannerMenu] = useState(false);
  const [isBannerHovered, setIsBannerHovered] = useState(false);
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
      setBannerColor(userProfile.bannerColor || BANNER_COLORS[0].gradient);
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
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image too large", {
          description: "Profile image must be less than 5MB",
        });
        return;
      }

      // Store file for upload
      setProfileFile(file);

      // Generate preview
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
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image too large", {
          description: "Banner image must be less than 5MB",
        });
        return;
      }

      // Store file for upload
      setBannerFile(file);

      // Generate preview
      try {
        const preview = await fileToBase64(file);
        setBannerImage(preview);
        setBannerColor(""); // Clear color when image is set
      } catch (error) {
        console.error("Error generating preview:", error);
        toast.error("Error loading image preview");
      }
    }
  };

  const handleBannerColorSelect = (gradient: string) => {
    setBannerColor(gradient);
    setBannerImage(null); // Clear image when color is set
    setShowBannerMenu(false);
  };

  const handleSave = async () => {
    if (!user) return;

    setIsUploading(true);

    try {
      let profileImageURL = profileImage;
      let bannerImageURL = bannerImage;

      // Upload profile image if new file was selected
      if (profileFile) {
        toast.info("Uploading profile image...");
        profileImageURL = await uploadImage(profileFile, user.uid, "profile");
      }

      // Upload banner image if new file was selected
      if (bannerFile) {
        toast.info("Uploading banner image...");
        bannerImageURL = await uploadImage(bannerFile, user.uid, "banner");
      }

      // Update Firestore with URLs
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName:
          displayName.trim() || user.email?.split("@")[0] || "Reader",
        bio: aboutText,
        photoURL: profileImageURL,
        bannerImage: bannerFile ? bannerImageURL : bannerImage,
        bannerColor: bannerFile ? "" : bannerColor, // Clear color if image was uploaded
        favoriteGenres: selectedGenres,
        updatedAt: new Date(),
      });

      // Clear file states
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

  return (
    <div className="min-h-screen bg-[#EFEDEB]">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-semibold text-[#555931] mb-2">
            Your Profile
          </h1>
          <p className="text-lg font-sans text-[#4D453F]">
            Manage your personal information and reading preferences
          </p>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          {/* Cover Banner */}
          <div
            className="relative h-48 w-full overflow-hidden"
            style={
              bannerImage
                ? {
                    backgroundImage: `url(${bannerImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : { background: bannerColor }
            }
            onMouseEnter={() => setIsBannerHovered(true)}
            onMouseLeave={() => setIsBannerHovered(false)}
          >
            {/* Brush icon appears on hover */}
            {isBannerHovered && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-all duration-300">
                <button
                  onClick={() => setShowBannerMenu(!showBannerMenu)}
                  className="p-4 bg-white/90 rounded-full hover:bg-white transition-all duration-300 shadow-lg"
                >
                  <Palette className="w-6 h-6 text-[#555931]" />
                </button>
              </div>
            )}

            {/* Banner customization menu */}
            {showBannerMenu && (
              <div className="absolute top-4 right-4 bg-white rounded-2xl shadow-xl p-4 w-72 z-10">
                <h4 className="text-lg font-serif font-semibold text-[#4D453F] mb-4">
                  Set your ambience
                </h4>

                {/* Color presets */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {BANNER_COLORS.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => handleBannerColorSelect(color.gradient)}
                      className="h-16 rounded-lg border-2 border-[#A3A692] hover:border-[#555931] transition-all duration-200 overflow-hidden"
                      style={{ background: color.gradient }}
                      title={color.name}
                    />
                  ))}
                </div>

                {/* Upload image option */}
                <button
                  onClick={() => {
                    bannerInputRef.current?.click();
                    setShowBannerMenu(false);
                  }}
                  className="w-full px-4 py-3 bg-[#F5F1E8] border-2 border-[#A3A692] rounded-lg hover:bg-[#555931] hover:text-white hover:border-[#555931] transition-all duration-300 font-sans text-sm font-medium text-[#555931] flex items-center justify-center gap-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  Upload Custom Image
                </button>
              </div>
            )}

            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              onChange={handleBannerImageChange}
              className="hidden"
            />
          </div>

          {/* Profile Info */}
          <div className="px-6 md:px-12 pb-8">
            {/* Avatar and Name Row */}
            <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8">
              <div className="relative -mt-16 ml-8">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-[#555931] flex items-center justify-center text-white text-3xl font-serif shadow-lg overflow-hidden">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials()
                  )}
                </div>
                {isEditing && (
                  <button
                    onClick={() => profileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-[#F5F1E8] transition-all duration-300 border-2 border-[#555931]"
                  >
                    <Camera className="w-4 h-4 text-[#555931]" />
                  </button>
                )}
                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
              </div>

              {/* Name aligned with Edit Profile button - 32px from top */}
              <div
                className="flex-1 flex flex-col md:flex-row md:items-start md:justify-between"
                style={{ marginTop: "32px" }}
              >
                <div>
                  <h2 className="text-3xl font-serif font-semibold text-[#4D453F] mb-1">
                    {displayName ||
                      userProfile?.displayName ||
                      user?.email?.split("@")[0] ||
                      "Reader"}
                  </h2>
                  <p className="text-base font-sans text-[#888C65]">
                    {user?.email}
                  </p>
                </div>

                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 md:mt-0 px-6 py-3 bg-white border-2 border-[#555931] text-[#555931] rounded-lg hover:bg-[#555931] hover:text-white transition-all duration-300 font-sans font-medium"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-3 mt-4 md:mt-0">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 bg-white border-2 border-[#A3A692] text-[#555931] rounded-lg hover:bg-[#F5F1E8] transition-all duration-300 font-sans font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isUploading}
                      className="px-6 py-3 bg-[#555931] text-white rounded-lg hover:bg-[#403935] transition-all duration-300 font-sans font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium font-sans text-[#4D453F] mb-2">
                  Email
                </label>
                <div className="w-full px-4 py-3 border-2 border-[#A3A692] rounded-lg font-sans text-[#403935] bg-[#F5F1E8]">
                  {user?.email}
                </div>
              </div>

              {/* Email Verified */}
              <div className="space-y-2">
                <label className="block text-sm font-medium font-sans text-[#4D453F] mb-2">
                  Email Status
                </label>
                <div className="w-full px-4 py-3 border-2 border-[#A3A692] rounded-lg font-sans text-[#403935] bg-[#F5F1E8] flex items-center gap-2">
                  {user?.emailVerified ? (
                    <>
                      <span className="text-[#555931]">✓</span>
                      <span>Verified</span>
                    </>
                  ) : (
                    <>
                      <span className="text-[#D4A574]">⚠</span>
                      <span>Not verified</span>
                    </>
                  )}
                </div>
              </div>

              {/* Member Since */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium font-sans text-[#4D453F] mb-2">
                  Member Since
                </label>
                <div className="w-full px-4 py-3 border-2 border-[#A3A692] rounded-lg font-sans text-[#403935] bg-[#F5F1E8]">
                  {formatDate(userProfile?.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How Should We Call You */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="text-2xl font-serif text-[#4D453F] mb-2">
            How should we call you?
          </h3>
          <p className="text-sm font-sans text-[#888C65] mb-4">
            We'll use this name in your reading corner and personal messages.
            Leave it empty and we'll use your username.
          </p>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="The name that makes you comfortable..."
            disabled={!isEditing}
            className="w-full px-4 py-3 border-2 border-[#A3A692] rounded-lg focus:border-[#555931] focus:ring-2 focus:ring-[#555931]/20 transition-all duration-200 font-sans text-[#403935] placeholder:text-[#A3A692] disabled:bg-[#F5F1E8] disabled:cursor-not-allowed"
          />
        </div>

        {/* About You */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="text-2xl font-serif text-[#4D453F] mb-2">About you</h3>
          <p className="text-sm font-sans text-[#888C65] mb-4">
            Tell your story
          </p>
          <textarea
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            placeholder="Share what makes you a reader, your favorite escape, or simply say hello..."
            disabled={!isEditing}
            maxLength={500}
            className="w-full px-4 py-3 border-2 border-[#A3A692] rounded-lg focus:border-[#555931] focus:ring-2 focus:ring-[#555931]/20 transition-all duration-200 font-sans text-[#403935] placeholder:text-[#A3A692] min-h-[120px] resize-none disabled:bg-[#F5F1E8] disabled:cursor-not-allowed"
          />
          <p className="text-xs font-sans text-[#888C65] mt-1 text-right">
            {aboutText.length} / 500 characters
          </p>
        </div>

        {/* Literary Genres */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="text-2xl font-serif text-[#4D453F] mb-2">
            Worlds you love to explore
          </h3>
          <p className="text-sm font-sans text-[#888C65] mb-6">
            Help us suggest books that resonate with your soul
          </p>

          {selectedGenres.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-sans font-medium text-[#4D453F] mb-3">
                Your selected genres
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedGenres.map((genre) => (
                  <span
                    key={genre}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#555931] text-white rounded-full font-sans text-sm border-2 border-[#555931] transition-all duration-200"
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

          <h4 className="text-sm font-sans font-medium text-[#4D453F] mb-3">
            Browse all genres
          </h4>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_GENRES.filter((g) => !selectedGenres.includes(g)).map(
              (genre) => (
                <button
                  key={genre}
                  onClick={() => isEditing && handleGenreToggle(genre)}
                  disabled={!isEditing}
                  className="px-4 py-2 border-2 border-[#A3A692] rounded-full text-[#555931] font-sans text-sm cursor-pointer hover:border-[#555931] hover:bg-[#555931]/5 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {genre}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Subscription Card */}
        <div className="bg-gradient-to-br from-[#F5F1E8] to-white rounded-2xl p-6 border-2 border-[#A3A692]/30 shadow-sm mb-6">
          <span className="inline-block px-3 py-1 bg-[#555931] text-white rounded-full text-xs font-sans font-medium mb-3">
            {userProfile?.subscription === "premium" ? "PREMIUM" : "FREE PLAN"}
          </span>
          <h3 className="text-xl font-serif text-[#4D453F] mb-2">
            {userProfile?.subscription === "premium"
              ? "Premium Member"
              : "Upgrade to Premium"}
          </h3>
          <p className="text-sm font-sans text-[#888C65] mb-4">
            {userProfile?.subscription === "premium"
              ? "Enjoy unlimited access to all Nook features"
              : "Unlock unlimited nooks, advanced tracking, and exclusive reading insights"}
          </p>
          {userProfile?.subscription !== "premium" && (
            <button className="px-6 py-3 bg-[#555931] text-white rounded-lg hover:bg-[#403935] transition-all duration-300 font-sans font-medium">
              Upgrade Now
            </button>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-[#C85A54]/5 border-l-4 border-[#C85A54] rounded-lg p-6 mb-6">
          <h3 className="text-xl font-serif text-[#C85A54] mb-2">
            Danger Zone
          </h3>
          <p className="text-sm font-sans text-[#59504A] mb-4">
            Once you delete your account, there's no going back. Please be
            certain.
          </p>
          <button
            onClick={() =>
              toast.error("Feature not implemented yet", {
                description: "Account deletion will be available soon",
              })
            }
            className="px-6 py-3 bg-[#C85A54] text-white rounded-lg hover:bg-[#A84842] transition-all duration-300 font-sans font-medium"
          >
            Delete Account
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="font-sans text-sm text-[#888C65]">
            Need help? Contact us at{" "}
            <a
              href="mailto:support@nook.com"
              className="text-[#555931] hover:text-[#403935] transition-all duration-300 underline"
            >
              support@nook.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
