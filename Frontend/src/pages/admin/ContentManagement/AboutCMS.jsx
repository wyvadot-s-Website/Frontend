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
    <TabsContent value="about" className="space-y-6">
      {/* About Us - Main Heading */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">
          About Us - Main Heading
        </h3>
        <Input
          value={form.aboutText}
          onChange={(e) =>
            setForm({ ...form, aboutText: e.target.value })
          }
        />
      </div>

      {/* About Us - Scroll Text */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">
          About Us - Scroll Text
        </h3>
        <Input
          value={form.promiseText}
          onChange={(e) =>
            setForm({ ...form, promiseText: e.target.value })
          }
        />
      </div>

      {/* History */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">History</h3>
        <Input
          value={form.history}
          onChange={(e) =>
            setForm({ ...form, history: e.target.value })
          }
        />
      </div>

      {/* Mission */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Mission</h3>
        <Input
          value={form.mission}
          onChange={(e) =>
            setForm({ ...form, mission: e.target.value })
          }
        />
      </div>

      {/* Vision */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Vision</h3>
        <Input
          value={form.vision}
          onChange={(e) =>
            setForm({ ...form, vision: e.target.value })
          }
        />
      </div>

      {/* Hero Section Background */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">
          Hero Section Background
        </h3>
        <div className="flex items-center gap-4">
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            id="about-hero-bg"
            onChange={(e) => setHeroImage(e.target.files[0])}
          />
          <Label htmlFor="about-hero-bg" className="border p-4 cursor-pointer">
            Select Image
          </Label>
          <Button onClick={handleHeroUpload}>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      {/* Spotlight Images */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">
          About Us - Spotlight Images
        </h3>
        <div className="flex items-center gap-4">
          <Input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            id="about-spotlight"
            onChange={(e) => setPromiseImages([...e.target.files])}
          />
          <Label htmlFor="about-spotlight" className="border p-4 cursor-pointer">
            Select Images (Max 4)
          </Label>
          <Button onClick={handlePromiseUpload}>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button onClick={handleSaveText}>
          <Upload className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>
    </TabsContent>
  );
}
