import React, { useEffect, useState } from "react";
import { Upload, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
<<<<<<< HEAD
import { toast } from "sonner"
=======
import { toast } from "sonner";
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e

import {
  fetchHomeContent,
  updateHero,
  updateStats,
  addWhyChoose,
  deleteWhyChoose,
} from "@/services/adminHomeService";
<<<<<<< HEAD
import { FileText, Wrench, Users, MessageSquare } from "lucide-react";

function StatCard({ stat, onChange, Icon }) {
  return (
    <Card className="border shadow-sm bg-white">
      <CardContent className="p-5">
        {/* Icon and Label Row */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded bg-orange-50 flex items-center justify-center ">
            {Icon && <Icon className="w-3 h-3 text-orange-500" />}
          </div>
          <Input
            value={stat.label}
            onChange={(e) => onChange("label", e.target.value)}
            placeholder="Label"
            className="border-0 p-0 h-auto text-xs text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {/* Value */}
        <Input
          value={stat.value}
          onChange={(e) => onChange("value", e.target.value)}
          placeholder="Value"
          className="border-0 p-0 h-auto text-3xl font-bold text-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </CardContent>
    </Card>
  );
}
=======
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e

export default function HomeCMS() {
  const token = localStorage.getItem("admin_token");

<<<<<<< HEAD
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Add these missing state variables
  const [heroImage, setHeroImage] = useState(null);
  const [heroBackground, setHeroBackground] = useState(null);

  const [stats, setStats] = useState([]);
  const [whyChoose, setWhyChoose] = useState([]);

=======
  // HERO
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroBackground, setHeroBackground] = useState([]); // files (1–4)
  const [existingHeroBackgrounds, setExistingHeroBackgrounds] = useState([]); // urls from backend

  // STATS
  const [stats, setStats] = useState([]);

  // WHY CHOOSE US
  const [whyChoose, setWhyChoose] = useState([]);
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
  const [whyTitle, setWhyTitle] = useState("");
  const [whyDesc, setWhyDesc] = useState("");

  useEffect(() => {
    loadHome();
<<<<<<< HEAD
  }, []);

  const loadHome = async () => {
    const data = await fetchHomeContent(token);
    setHeroTitle(data.hero.title);
    setHeroSubtitle(data.hero.subtitle);
    setStats(data.stats);
    setWhyChoose(data.whyChooseUs);
  };

  /* ---------------- HERO ---------------- */
  const handleSaveHero = async () => {
=======
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadHome = async () => {
    try {
      const data = await fetchHomeContent(token);

      setHeroTitle(data?.hero?.title || "");
      setHeroSubtitle(data?.hero?.subtitle || "");
      setExistingHeroBackgrounds(data?.hero?.backgroundImages || []);

      setStats(data?.stats || []);
      setWhyChoose(data?.whyChooseUs || []);
    } catch (e) {
      toast.error(e?.message || "Failed to load home content");
    }
  };

  /* ---------------- HERO (TEXT) ---------------- */
  const handleSaveHeroText = async () => {
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
    try {
      const formData = new FormData();
      formData.append("title", heroTitle);
      formData.append("subtitle", heroSubtitle);
<<<<<<< HEAD
      if (selectedFile) {
        formData.append("backgroundImage", selectedFile);
      }

      await updateHero(formData, token);

      toast.success("Hero section updated successfully");
      loadHome();
    } catch (error) {
      toast.error(error.message || "Failed to update hero section");
    }
  };

  // Add these missing handlers
  const handleUploadHeroImage = async () => {
    if (!heroImage) {
      toast.error("Please select an image first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("heroImage", heroImage);

      // Adjust this endpoint to match your API
      await updateHero(formData, token);
      
      toast.success("Hero image uploaded successfully");
      setHeroImage(null);
      loadHome();
    } catch (error) {
      toast.error(error.message || "Failed to upload hero image");
    }
  };

  const handleUploadHeroBackground = async () => {
    if (!heroBackground) {
      toast.error("Please select a background image first");
=======

      await updateHero(formData, token);

      toast.success("Hero text updated successfully");
      loadHome();
    } catch (error) {
      toast.error(error.message || "Failed to update hero text");
    }
  };

  /* ---------------- HERO (SLIDER IMAGES 1–4) ---------------- */
  const handleUploadHeroBackground = async () => {
    if (!heroBackground || heroBackground.length === 0) {
      toast.error("Please select background images first");
      return;
    }

    if (heroBackground.length > 4) {
      toast.error("You can only upload a maximum of 4 images");
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
      return;
    }

    try {
      const formData = new FormData();
<<<<<<< HEAD
      formData.append("backgroundImage", heroBackground);

      await updateHero(formData, token);
      
      toast.success("Hero background uploaded successfully");
      setHeroBackground(null);
      loadHome();
    } catch (error) {
      toast.error(error.message || "Failed to upload hero background");
=======
      heroBackground.forEach((file) => {
        // IMPORTANT: must match backend upload.array("backgroundImages", 4)
        formData.append("backgroundImages", file);
      });

      await updateHero(formData, token);

      toast.success("Hero slider images updated successfully");
      setHeroBackground([]);
      loadHome();
    } catch (error) {
      toast.error(error.message || "Failed to upload hero images");
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
    }
  };

  /* ---------------- STATS ---------------- */
  const updateSingleStat = (index, field, value) => {
    const updated = [...stats];
<<<<<<< HEAD
    updated[index][field] = value;
=======
    updated[index] = { ...updated[index], [field]: value };
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
    setStats(updated);
  };

  const handleSaveStats = async () => {
    try {
      await updateStats(stats, token);
      toast.success("Stats updated successfully");
      loadHome();
    } catch (error) {
      toast.error(error.message || "Failed to update stats");
    }
  };

  /* ---------------- WHY CHOOSE US ---------------- */
  const handleAddWhyChoose = async () => {
    if (!whyTitle || !whyDesc) {
      toast.error("Please fill in both title and description");
      return;
    }

    try {
<<<<<<< HEAD
      await addWhyChoose(
        { title: whyTitle, description: whyDesc },
        token
      );

=======
      await addWhyChoose({ title: whyTitle, description: whyDesc }, token);
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
      toast.success("Item added successfully");
      setWhyTitle("");
      setWhyDesc("");
      loadHome();
    } catch (error) {
      toast.error(error.message || "Failed to add item");
    }
  };

  const handleDeleteWhy = async (id) => {
    try {
      await deleteWhyChoose(id, token);
      toast.success("Item deleted successfully");
      loadHome();
    } catch (error) {
      toast.error(error.message || "Failed to delete item");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
<<<<<<< HEAD
      {/* HERO SECTION */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Hero Section</h2>
        
        {/* Hero Section Image */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Hero Section Image
          </label>
=======
      {/* ================= HERO SECTION ================= */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
          Hero Section
        </h2>

        {/* Existing slider images preview */}
        {existingHeroBackgrounds?.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              Current Slider Images
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {existingHeroBackgrounds.map((img, idx) => (
                <div
                  key={img.publicId || idx}
                  className="rounded-md overflow-hidden border"
                >
                  <img
                    src={img.url}
                    alt={`Hero slide ${idx + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload slider images (1–4) */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Hero Slider Images (Max 4)
          </label>

>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                type="file"
                accept="image/*"
<<<<<<< HEAD
                onChange={(e) => setHeroImage(e.target.files?.[0] || null)}
                className="hidden"
                id="hero-image-upload"
              />
              <Label 
                htmlFor="hero-image-upload" 
                className="flex items-center justify-between w-full border border-gray-300 rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-600">
                  {heroImage ? heroImage.name : "No file chosen"}
                </span>
              </Label>
            </div>
            <Button 
              onClick={handleUploadHeroImage} 
=======
                multiple
                onChange={(e) =>
                  setHeroBackground(Array.from(e.target.files || []))
                }
                className="hidden"
                id="hero-bg-upload"
              />
              <Label
                htmlFor="hero-bg-upload"
                className="flex items-center justify-between w-full border border-gray-300 rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-600">
                  {heroBackground?.length
                    ? `${heroBackground.length} file(s) selected`
                    : "No file chosen"}
                </span>
              </Label>
            </div>

            <Button
              onClick={handleUploadHeroBackground}
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
              className="bg-orange-500 hover:bg-orange-600 text-white px-6"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>
<<<<<<< HEAD
        </div>

        {/* Hero Section Title */}
=======

          <p className="text-xs text-gray-500">
            Uploading 1–4 images will replace the oldest 1–4 images on the
            slider.
          </p>
        </div>

        {/* Hero Title */}
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Hero Section Title
          </label>
          <Input
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            placeholder="What We Build, We Build With Purpose"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

<<<<<<< HEAD
        {/* Hero Section Subtitle */}
=======
        {/* Hero Subtitle */}
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
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

<<<<<<< HEAD
        {/* Hero Section Background */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Hero Section Background
          </label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setHeroBackground(e.target.files?.[0] || null)}
                className="hidden"
                id="hero-bg-upload"
              />
              <Label 
                htmlFor="hero-bg-upload" 
                className="flex items-center justify-between w-full border border-gray-300 rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-600">
                  {heroBackground ? heroBackground.name : "No file chosen"}
                </span>
              </Label>
            </div>
            <Button 
              onClick={handleUploadHeroBackground} 
              className="bg-orange-500 hover:bg-orange-600 text-white px-6"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>
        </div>

        {/* Save Hero Text Button */}
        <Button 
          onClick={handleSaveHero} 
          className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto px-8"
        >
          Save Hero Section
        </Button>
      </section>

      {/* STATS SECTION */}
<section className="space-y-6">
  <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Performance Stats</h2>
  
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {stats.map((stat, i) => (
      <div key={i} className="space-y-3">
        {/* Label */}
        <label className="block text-sm text-gray-600 font-semibold">
          {stat.label || `Stat ${i + 1} Label`}
        </label>
        
        {/* Editable Card */}
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            
            {/* Value Input */}
            <Input
              value={stat.value}
              onChange={(e) => updateSingleStat(i, "value", e.target.value)}
              placeholder="e.g., 60+"
              className="text-3xl font-bold text-gray-900 border-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center"
            />
          </CardContent>
        </Card>
      </div>
    ))}
  </div>
  
  <Button 
    onClick={handleSaveStats} 
    className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto px-8 py-3"
  >
    Save Stats
  </Button>
</section>

      {/* WHY CHOOSE US SECTION */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Why Choose Us</h2>
        
        {/* Existing Items */}
=======
        <Button
          onClick={handleSaveHeroText}
          className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto px-8"
        >
          Save Hero Text
        </Button>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
          Performance Stats
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="space-y-3">
              <label className="block text-sm text-gray-600 font-semibold">
                {stat.label || `Stat ${i + 1} Label`}
              </label>

              <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <Input
                    value={stat.value}
                    onChange={(e) => updateSingleStat(i, "value", e.target.value)}
                    placeholder="e.g., 60+"
                    className="text-3xl font-bold text-gray-900 border-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center"
                  />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <Button
          onClick={handleSaveStats}
          className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto px-8 py-3"
        >
          Save Stats
        </Button>
      </section>

      {/* ================= WHY CHOOSE US SECTION ================= */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
          Why Choose Us
        </h2>

>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
        {whyChoose.length > 0 && (
          <div className="space-y-3">
            {whyChoose.map((item) => (
              <Card key={item._id} className="hover:shadow-md transition-shadow">
                <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{item.title}</h4>
<<<<<<< HEAD
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
=======
                    <p className="text-sm text-gray-600 mt-1">
                      {item.description}
                    </p>
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteWhy(item._id)}
                    className="shrink-0"
                  >
                    <Trash2 size={16} />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

<<<<<<< HEAD
        {/* Add New Item Form */}
=======
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <h3 className="font-semibold text-gray-700">Add New Item</h3>
          <Input
            value={whyTitle}
            onChange={(e) => setWhyTitle(e.target.value)}
            placeholder="Title (e.g., We Are Reliable)"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <Input
            value={whyDesc}
            onChange={(e) => setWhyDesc(e.target.value)}
            placeholder="Description"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
<<<<<<< HEAD
          <Button 
            onClick={handleAddWhyChoose} 
=======
          <Button
            onClick={handleAddWhyChoose}
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
            className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto px-8"
          >
            Add Why Choose Us
          </Button>
        </div>
      </section>
    </div>
  );
}