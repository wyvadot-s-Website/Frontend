import React, { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteService,
  deleteServiceImage,
  fetchServicesContentAdmin,
  uploadServiceImage,
  updateServices,
  uploadServicesHeroImages,
  updateServicesPage,
} from "@/services/adminServicesService";
import { DEFAULT_SERVICES } from "@/utils/servicesContent";

const emptyPage = {
  hero: { title: "", subtitle: "", backgroundImages: [] },
  intro: { heading: "", description: "" },
  cta: { heading: "", description: "", buttonText: "", buttonLink: "" },
};

const normalizeHighlights = (value) =>
  String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const formatHighlights = (items = []) => items.join("\n");

export default function ServicesCMS() {
  const token = localStorage.getItem("admin_token");
  const [page, setPage] = useState(emptyPage);
  const [services, setServices] = useState([]);
  const [heroFiles, setHeroFiles] = useState([]);
  const [serviceToAdd, setServiceToAdd] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadContent = async () => {
    try {
      setLoading(true);
      const result = await fetchServicesContentAdmin(token);
      const data = result.data || {};
      setPage({
        hero: {
          title: data.hero?.title || "",
          subtitle: data.hero?.subtitle || "",
          backgroundImages: data.hero?.backgroundImages || [],
        },
        intro: {
          heading: data.intro?.heading || "",
          description: data.intro?.description || "",
        },
        cta: {
          heading: data.cta?.heading || "",
          description: data.cta?.description || "",
          buttonText: data.cta?.buttonText || "",
          buttonLink: data.cta?.buttonLink || "",
        },
      });
      setServices(
        (data.services || []).map((service, index) => ({
          ...service,
          highlightsText: formatHighlights(service.highlights),
          order: service.order ?? index,
        }))
      );
    } catch (error) {
      toast.error(error.message || "Failed to load Services content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updatePageField = (section, field, value) => {
    setPage((current) => ({
      ...current,
      [section]: { ...current[section], [field]: value },
    }));
  };

  const updateService = (index, field, value) => {
    setServices((current) =>
      current.map((service, serviceIndex) =>
        serviceIndex === index ? { ...service, [field]: value } : service
      )
    );
  };

  const moveService = (index, direction) => {
    setServices((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((service, order) => ({ ...service, order }));
    });
  };

  const handleSavePage = async () => {
    try {
      setSaving(true);
      await updateServicesPage(page, token);
      toast.success("Services page content saved");
    } catch (error) {
      toast.error(error.message || "Failed to save Services page");
    } finally {
      setSaving(false);
    }
  };

  const handleUploadHero = async () => {
    if (!heroFiles.length) return toast.error("Select hero images first");
    try {
      setSaving(true);
      await uploadServicesHeroImages(heroFiles, token);
      toast.success("Services hero images uploaded");
      setHeroFiles([]);
      loadContent();
    } catch (error) {
      toast.error(error.message || "Failed to upload hero images");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveServices = async () => {
    try {
      setSaving(true);
      const payload = services.map((service) => ({
        ...service,
        highlights: normalizeHighlights(service.highlightsText),
        highlightsText: undefined,
      }));
      await updateServices(payload, token);
      toast.success("Services saved");
      loadContent();
    } catch (error) {
      toast.error(error.message || "Failed to save services");
    } finally {
      setSaving(false);
    }
  };

  const handleServiceImage = async (serviceKey, file) => {
    if (!file) return;
    try {
      await uploadServiceImage(serviceKey, file, token);
      toast.success("Service image uploaded");
      loadContent();
    } catch (error) {
      toast.error(error.message || "Failed to upload service image");
    }
  };

  const handleDeleteServiceImage = async (serviceKey) => {
    try {
      await deleteServiceImage(serviceKey, token);
      toast.success("Service image removed");
      loadContent();
    } catch (error) {
      toast.error(error.message || "Failed to remove service image");
    }
  };

  const handleDeleteService = async (serviceKey, title) => {
    if (!window.confirm(`Delete ${title || "this service"}?`)) return;
    try {
      await deleteService(serviceKey, token);
      toast.success("Service deleted");
      loadContent();
    } catch (error) {
      toast.error(error.message || "Failed to delete service");
    }
  };

  const missingServices = DEFAULT_SERVICES.filter(
    (service) => !services.some((item) => item.serviceKey === service.serviceKey)
  );

  const handleAddService = () => {
    const service = DEFAULT_SERVICES.find((item) => item.serviceKey === serviceToAdd);
    if (!service) return toast.error("Select a service to add");

    setServices((current) => [
      ...current,
      {
        ...service,
        description: service.description || "",
        highlights: service.highlights || [],
        highlightsText: formatHighlights(service.highlights || []),
        image: { url: "", publicId: "" },
        order: current.length,
        isVisible: true,
      },
    ]);
    setServiceToAdd("");
  };

  if (loading) {
    return <div className="py-16 text-center text-sm text-gray-500">Loading Services CMS...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <section className="space-y-5">
        <div className="border-b pb-3">
          <h2 className="text-2xl font-bold text-gray-900">Hero & Page Copy</h2>
          <p className="text-sm text-gray-500">Control the Services page heading, introduction, and call to action.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Hero Title</Label>
            <Input value={page.hero.title} onChange={(e) => updatePageField("hero", "title", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Hero Subtitle</Label>
            <Input value={page.hero.subtitle} onChange={(e) => updatePageField("hero", "subtitle", e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Intro Heading</Label>
            <Input value={page.intro.heading} onChange={(e) => updatePageField("intro", "heading", e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Intro Description</Label>
            <Textarea rows={3} value={page.intro.description} onChange={(e) => updatePageField("intro", "description", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>CTA Heading</Label>
            <Input value={page.cta.heading} onChange={(e) => updatePageField("cta", "heading", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>CTA Button Text</Label>
            <Input value={page.cta.buttonText} onChange={(e) => updatePageField("cta", "buttonText", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>CTA Button Link</Label>
            <Input value={page.cta.buttonLink} onChange={(e) => updatePageField("cta", "buttonLink", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>CTA Description</Label>
            <Textarea rows={3} value={page.cta.description} onChange={(e) => updatePageField("cta", "description", e.target.value)} />
          </div>
        </div>

        <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input type="file" accept="image/*" multiple onChange={(e) => setHeroFiles(Array.from(e.target.files || []))} />
            <Button type="button" onClick={handleUploadHero} disabled={saving || !heroFiles.length} className="bg-orange-500 hover:bg-orange-600">
              <Upload className="mr-2 h-4 w-4" /> Upload Hero Images
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(page.hero.backgroundImages || []).map((image, index) => (
              <img key={image.publicId || index} src={image.url} alt={`Services hero ${index + 1}`} className="h-20 w-full rounded-md border object-cover" />
            ))}
          </div>
        </div>

        <Button onClick={handleSavePage} disabled={saving} className="bg-green-600 hover:bg-green-700">
          Save Page Content
        </Button>
      </section>

      <section className="space-y-5">
        <div className="border-b pb-3">
          <h2 className="text-2xl font-bold text-gray-900">Services</h2>
          <p className="text-sm text-gray-500">Edit service copy, details, visibility, images, and display order.</p>
        </div>

        {services.map((service, index) => (
          <Card key={service.serviceKey} className="overflow-hidden">
            <CardContent className="space-y-5 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{service.title || service.serviceKey}</h3>
                  <p className="text-xs text-gray-500">{service.serviceKey}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="icon" onClick={() => moveService(index, -1)} disabled={index === 0}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="outline" size="icon" onClick={() => moveService(index, 1)} disabled={index === services.length - 1}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="destructive" size="icon" onClick={() => handleDeleteService(service.serviceKey, service.title)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Service Title</Label>
                  <Input value={service.title} onChange={(e) => updateService(index, "title", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Short Description</Label>
                  <Input value={service.shortDescription || ""} onChange={(e) => updateService(index, "shortDescription", e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Detailed Description</Label>
                  <Textarea rows={4} value={service.description || ""} onChange={(e) => updateService(index, "description", e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Highlights (one per line)</Label>
                  <Textarea rows={4} value={service.highlightsText || ""} onChange={(e) => updateService(index, "highlightsText", e.target.value)} />
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={service.isVisible !== false} onChange={(e) => updateService(index, "isVisible", e.target.checked)} className="h-4 w-4" />
                  Visible on Services page
                </label>
              </div>

              <div className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center">
                {service.image?.url ? (
                  <img src={service.image.url} alt={service.title} className="h-20 w-20 rounded-md border object-cover" />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-md border bg-gray-50 text-gray-400">
                    <ImagePlus className="h-6 w-6" />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-2 sm:flex-row">
                  <Input type="file" accept="image/*" onChange={(e) => handleServiceImage(service.serviceKey, e.target.files?.[0])} />
                  {service.image?.url && (
                    <Button type="button" variant="outline" onClick={() => handleDeleteServiceImage(service.serviceKey)}>
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {missingServices.length > 0 && (
          <div className="flex flex-col gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 sm:flex-row sm:items-center">
            <select
              value={serviceToAdd}
              onChange={(e) => setServiceToAdd(e.target.value)}
              className="h-10 flex-1 rounded-md border border-gray-300 bg-white px-3 text-sm"
            >
              <option value="">Select a service to add</option>
              {missingServices.map((service) => (
                <option key={service.serviceKey} value={service.serviceKey}>
                  {service.title}
                </option>
              ))}
            </select>
            <Button type="button" variant="outline" onClick={handleAddService}>
              Add Service
            </Button>
          </div>
        )}

        <Button onClick={handleSaveServices} disabled={saving} className="bg-orange-500 hover:bg-orange-600">
          Save Services
        </Button>
      </section>
    </div>
  );
}
