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

function StatCard({ stat, onChange }) {
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-4 space-y-2">
        <Input
          value={stat.label}
          onChange={(e) => onChange("label", e.target.value)}
          placeholder="Label"
        />
        <Input
          value={stat.value}
          onChange={(e) => onChange("value", e.target.value)}
          placeholder="Value (e.g 50+)"
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


  /* ---------------- STATS ---------------- */
  const updateSingleStat = (index, field, value) => {
    const updated = [...stats];
    updated[index][field] = value;
    setStats(updated);
  };

  const handleSaveStats = async () => {
    await updateStats(stats, token);
    loadHome();
  };

  /* ---------------- WHY CHOOSE US ---------------- */
  const handleAddWhyChoose = async () => {
    if (!whyTitle || !whyDesc) return;

    await addWhyChoose(
      { title: whyTitle, description: whyDesc },
      token
    );

    setWhyTitle("");
    setWhyDesc("");
    loadHome();
  };

  const handleDeleteWhy = async (id) => {
    await deleteWhyChoose(id, token);
    loadHome();
  };

  return (
    <div className="space-y-10">

      {/* HERO */}
      <section className="space-y-4">
        <h3 className="font-semibold text-lg">Hero Section</h3>

        <Input
          value={heroTitle}
          onChange={(e) => setHeroTitle(e.target.value)}
          placeholder="Hero Title"
        />

        <Input
          value={heroSubtitle}
          onChange={(e) => setHeroSubtitle(e.target.value)}
          placeholder="Hero Subtitle"
        />

        <div className="flex items-center gap-4">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="hidden"
            id="hero-upload"
          />
          <Label htmlFor="hero-upload" className="border p-3 cursor-pointer">
            {selectedFile ? selectedFile.name : "Choose background image"}
          </Label>

          <Button onClick={handleSaveHero} className="bg-orange-500">
            <Upload className="mr-2 h-4 w-4" />
            Save Hero
          </Button>
        </div>
      </section>

      {/* STATS */}
      <section className="space-y-4">
        <h3 className="font-semibold text-lg">Performance Stats</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <StatCard
              key={i}
              stat={stat}
              onChange={(field, value) =>
                updateSingleStat(i, field, value)
              }
            />
          ))}
        </div>

        <Button onClick={handleSaveStats} className="bg-orange-500">
          Save Stats
        </Button>
      </section>

      {/* WHY CHOOSE US */}
      <section className="space-y-4">
        <h3 className="font-semibold text-lg">Why Choose Us</h3>

        {whyChoose.map((item) => (
          <Card key={item._id}>
            <CardContent className="flex justify-between items-start p-4">
              <div>
                <h4 className="font-semibold">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteWhy(item._id)}
              >
                <Trash2 size={16} />
              </Button>
            </CardContent>
          </Card>
        ))}

        <Input
          value={whyTitle}
          onChange={(e) => setWhyTitle(e.target.value)}
          placeholder="Title (e.g We Are Reliable)"
        />

        <Input
          value={whyDesc}
          onChange={(e) => setWhyDesc(e.target.value)}
          placeholder="Description"
        />

        <Button onClick={handleAddWhyChoose} className="bg-orange-500">
          Add Why Choose Us
        </Button>
      </section>
    </div>
  );
}
