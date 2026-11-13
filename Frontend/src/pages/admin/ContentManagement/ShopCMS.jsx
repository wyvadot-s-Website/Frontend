import React, { useEffect, useState } from "react";
import { Upload, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  fetchShopContentAdmin,
  updateShopPage,
  uploadShopHeroImages,
  deleteShopHeroImage,
} from "@/services/adminShopContentService";

export default function ShopCMS() {
  const token = localStorage.getItem("admin_token");

  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroBackgrounds, setHeroBackgrounds] = useState([]);
  const [heroBackgroundFiles, setHeroBackgroundFiles] = useState([]);

  useEffect(() => {
    loadShop();
  }, []);

  const loadShop = async () => {
    try {
      const data = await fetchShopContentAdmin(token);
      setHeroTitle(data?.hero?.title || "");
      setHeroSubtitle(data?.hero?.subtitle || "");
      setHeroBackgrounds(data?.hero?.backgroundImages || []);
    } catch (e) {
      toast.error(e?.message || "Failed to load shop content");
    }
  };

  const handleSaveHeroText = async () => {
    try {
      await updateShopPage(
        {
          hero: {
            title: heroTitle,
            subtitle: heroSubtitle,
          },
        },
        token
      );
      toast.success("Hero text updated successfully");
      loadShop();
    } catch (error) {
      toast.error(error.message || "Failed to update hero text");
    }
  };

  const handleUploadHeroImages = async () => {
    if (!heroBackgroundFiles || heroBackgroundFiles.length === 0) {
      toast.error("Please select background images first");
      return;
    }

    if (heroBackgroundFiles.length > 4) {
      toast.error("You can only upload a maximum of 4 images");
      return;
    }

    try {
      const formData = new FormData();
      heroBackgroundFiles.forEach((file) => {
        formData.append("backgroundImages", file);
      });

      await uploadShopHeroImages(formData, token);

      toast.success("Hero slider images updated successfully");
      setHeroBackgroundFiles([]);
      loadShop();
    } catch (error) {
      toast.error(error.message || "Failed to upload hero images");
    }
  };

  const handleDeleteHeroImage = async (publicId) => {
    try {
      await deleteShopHeroImage(publicId, token);
      toast.success("Hero image deleted successfully");
      loadShop();
    } catch (error) {
      toast.error(error.message || "Failed to delete hero image");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
          Hero Section
        </h2>

        {heroBackgrounds?.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              Current Slider Images
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {heroBackgrounds.map((img, idx) => (
                <div
                  key={img.publicId || idx}
                  className="rounded-md overflow-hidden border relative group"
                >
                  <img
                    src={img.url}
                    alt={`Hero slide ${idx + 1}`}
                    className="w-full h-20 object-cover"
                  />
                  <button
                    onClick={() => handleDeleteHeroImage(img.publicId)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete image"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Hero Slider Images (Max 4)
          </label>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  setHeroBackgroundFiles(Array.from(e.target.files || []))
                }
                className="hidden"
                id="shop-hero-bg-upload"
              />
              <Label
                htmlFor="shop-hero-bg-upload"
                className="flex items-center justify-between w-full border border-gray-300 rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-600">
                  {heroBackgroundFiles?.length
                    ? `${heroBackgroundFiles.length} file(s) selected`
                    : "No file chosen"}
                </span>
              </Label>
            </div>

            <Button
              onClick={handleUploadHeroImages}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>

          <p className="text-xs text-gray-500">
            Uploading 1–4 images will replace all existing slider images.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Hero Section Title
          </label>
          <Input
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            placeholder="Shop"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Hero Section Subtitle
          </label>
          <Input
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            placeholder="Professional Construction & Engineering Services"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <Button
          onClick={handleSaveHeroText}
          className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto px-8"
        >
          Save Hero Text
        </Button>
      </section>
    </div>
  );
}
