import React, { useEffect, useState } from "react";
import { Upload, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"

import {
  fetchHomeContent,
  updateHero,
  updateStats,
  addWhyChoose,
  deleteWhyChoose,
} from "@/services/adminHomeService";
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

export default function HomeCMS() {
  const token = localStorage.getItem("admin_token");

  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Add these missing state variables
  const [heroImage, setHeroImage] = useState(null);
  const [heroBackground, setHeroBackground] = useState(null);

  const [stats, setStats] = useState([]);
  const [whyChoose, setWhyChoose] = useState([]);

  const [whyTitle, setWhyTitle] = useState("");
  const [whyDesc, setWhyDesc] = useState("");

  useEffect(() => {
    loadHome();
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
    try {
      const formData = new FormData();
      formData.append("title", heroTitle);
      formData.append("subtitle", heroSubtitle);
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
      return;
    }

    try {
      const formData = new FormData();
      formData.append("backgroundImage", heroBackground);

      await updateHero(formData, token);
      
      toast.success("Hero background uploaded successfully");
      setHeroBackground(null);
      loadHome();
    } catch (error) {
      toast.error(error.message || "Failed to upload hero background");
    }
  };

  /* ---------------- STATS ---------------- */
  const updateSingleStat = (index, field, value) => {
    const updated = [...stats];
    updated[index][field] = value;
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
      await addWhyChoose(
        { title: whyTitle, description: whyDesc },
        token
      );

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
      {/* HERO SECTION */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Hero Section</h2>
        
        {/* Hero Section Image */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Hero Section Image
          </label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                type="file"
                accept="image/*"
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
              className="bg-orange-500 hover:bg-orange-600 text-white px-6"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>
        </div>

        {/* Hero Section Title */}
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

        {/* Hero Section Subtitle */}
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
        {whyChoose.length > 0 && (
          <div className="space-y-3">
            {whyChoose.map((item) => (
              <Card key={item._id} className="hover:shadow-md transition-shadow">
                <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{item.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
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

        {/* Add New Item Form */}
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
          <Button 
            onClick={handleAddWhyChoose} 
            className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto px-8"
          >
            Add Why Choose Us
          </Button>
        </div>
      </section>
    </div>
  );
}