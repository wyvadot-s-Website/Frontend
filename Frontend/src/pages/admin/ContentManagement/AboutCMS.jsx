import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

import {
  fetchAboutAdmin,
  updateAboutText,
  updateAboutHeroImage,
  addPromiseImage,
} from "@/services/adminAboutService.js";

export default function AboutCMS() {
  const token = localStorage.getItem("admin_token");

  const [form, setForm] = useState({
    aboutText: "",
    promiseText: "",
    history: "",
    mission: "",
    vision: "",
  });

  const [heroImage, setHeroImage] = useState(null);
  const [promiseImages, setPromiseImages] = useState([]);

  /**
   * LOAD ABOUT CONTENT
   */
  useEffect(() => {
    const loadAbout = async () => {
      try {
        const res = await fetchAboutAdmin(token);
        const data = res.data;

        setForm({
          aboutText: data.aboutText || "",
          promiseText: data.promiseText || "",
          history: data.history || "",
          mission: data.mission || "",
          vision: data.vision || "",
        });
      } catch {
        toast.error("Failed to load About content");
      }
    };

    loadAbout();
  }, [token]);

  /**
   * SAVE TEXT CONTENT
   */
  const handleSaveText = async () => {
    try {
      await updateAboutText(form, token);
      toast.success("About content updated");
    } catch (err) {
      toast.error(err.message);
    }
  };

  /**
   * UPLOAD HERO IMAGE
   */
  const handleHeroUpload = async () => {
    if (!heroImage) return toast.error("Select an image");

    const formData = new FormData();
    formData.append("image", heroImage);

    try {
      await updateAboutHeroImage(formData, token);
      toast.success("Hero image updated");
    } catch (err) {
      toast.error(err.message);
    }
  };

  /**
   * UPLOAD PROMISE IMAGES
   */
  const handlePromiseUpload = async () => {
    if (!promiseImages.length) {
      return toast.error("Select images");
    }

    try {
      for (let file of promiseImages) {
        const fd = new FormData();
        fd.append("image", file);
        await addPromiseImage(fd, token);
      }
      toast.success("Promise images uploaded");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <TabsContent value="about" className="space-y-8">
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
          className="hidden"
          id="about-hero-bg"
          onChange={(e) => setHeroImage(e.target.files?.[0] || null)}
        />
        <Label 
          htmlFor="about-hero-bg" 
          className="flex items-center justify-between w-full border border-gray-300 rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <span className="text-gray-600">
            {heroImage ? heroImage.name : "No file chosen"}
          </span>
        </Label>
      </div>
      <Button 
        onClick={handleHeroUpload}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6"
      >
        <Upload className="mr-2 h-4 w-4" />
        Upload
      </Button>
    </div>
  </div>

  {/* About Us - Main Heading */}
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      About Us - Main Heading
    </label>
    <Input
      value={form.aboutText}
      onChange={(e) => setForm({ ...form, aboutText: e.target.value })}
      placeholder="About Wyvadotr"
      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
    />
  </div>

  {/* About Us - Scroll Text */}
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      About Us - Scroll Text
    </label>
    <Input
      value={form.promiseText}
      onChange={(e) => setForm({ ...form, promiseText: e.target.value })}
      placeholder="Our Promise as a company ......"
      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
    />
  </div>

  {/* History */}
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      History
    </label>
    <Input
      value={form.history}
      onChange={(e) => setForm({ ...form, history: e.target.value })}
      placeholder="Our Promise as a company ......"
      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
    />
  </div>

  {/* Mission */}
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      Mission
    </label>
    <Input
      value={form.mission}
      onChange={(e) => setForm({ ...form, mission: e.target.value })}
      placeholder="Our Promise as a company ......"
      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
    />
  </div>

  {/* Vision */}
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      Vision
    </label>
    <Input
      value={form.vision}
      onChange={(e) => setForm({ ...form, vision: e.target.value })}
      placeholder="Our Promise as a company ......"
      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
    />
  </div>

  {/* About Us - Scroll Images */}
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      About Us - Scroll Images
    </label>
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <Input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          id="about-spotlight"
          onChange={(e) => setPromiseImages([...e.target.files])}
        />
        <Label 
          htmlFor="about-spotlight" 
          className="flex items-center justify-between w-full border border-gray-300 rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <span className="text-gray-600">
            {promiseImages && promiseImages.length > 0 
              ? `${promiseImages.length} file(s) selected (Select 4)` 
              : "No file chosen (Select 4)"}
          </span>
        </Label>
      </div>
      <Button 
        onClick={handlePromiseUpload}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6"
      >
        <Upload className="mr-2 h-4 w-4" />
        Upload
      </Button>
    </div>
  </div>

  {/* Save Button */}
  <div className="pt-4">
    <Button 
      onClick={handleSaveText}
      className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto px-8"
    >
      Save About Section
    </Button>
  </div>
</TabsContent>
  );
}
