import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";

import {
  fetchTestimonialsAdmin,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/services/adminTestimonialService";

export default function TestimonialCMS() {
  const token = localStorage.getItem("admin_token");

  const [testimonials, setTestimonials] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    clientName: "",
    company: "",
    testimonial: "",
    rating: "",
  });

  /* ================= FETCH TESTIMONIALS ================= */
  const loadTestimonials = async () => {
    try {
      const res = await fetchTestimonialsAdmin(token);
      setTestimonials(res?.data?.length ? res.data : []);
    } catch {
      toast.error("Failed to load testimonials");
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  /* ================= INPUT HANDLER ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    try {
      const payload = {
        clientName: form.clientName,
        company: form.company || "",
        testimonial: form.testimonial,
        rating: form.rating,
      };

      if (editingId) {
        await updateTestimonial(editingId, payload, token);
        toast.success("Testimonial updated");
      } else {
        await addTestimonial(payload, token);
        toast.success("Testimonial added");
      }

      setForm({
        clientName: "",
        company: "",
        testimonial: "",
        rating: "",
      });
      setEditingId(null);
      loadTestimonials();
    } catch (err) {
      toast.error(err.message);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      clientName: item.clientName,
      company: item.company || "",
      testimonial: item.testimonial,
      rating: item.rating,
    });
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    try {
      await deleteTestimonial(id, token);
      toast.success("Testimonial deleted");
      loadTestimonials();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* ===== ADD / EDIT FORM (UNCHANGED UI) ===== */}
      <div className="space-y-4 pb-6 border-b">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Client Name</Label>
            <Input
              name="clientName"
              value={form.clientName}
              onChange={handleChange}
              placeholder="Client name"
            />
          </div>

          <div className="space-y-2">
            <Label>Company (optional)</Label>
            <Input
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Company"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Testimonial</Label>
          <Input
            name="testimonial"
            value={form.testimonial}
            onChange={handleChange}
            className="h-20"
            placeholder="What the client said"
          />
        </div>

        <div className="space-y-2">
          <Label>Rating</Label>
          <Input
            type="number"
            step="0.5"
            min="0"
            max="5"
            name="rating"
            value={form.rating}
            onChange={handleChange}
            placeholder="5"
          />
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        className="bg-orange-500 hover:bg-orange-600 w-full max-w-md mx-auto"
      >
        <Upload className="mr-2 h-4 w-4" />
        {editingId ? "Update Testimonial" : "Save Testimonial"}
      </Button>

      {/* ===== CREATED TESTIMONIALS ===== */}
      {testimonials.length === 0 ? null : (
        <div className="space-y-4 pt-6 border-t">
          <h3 className="font-semibold">Created Testimonials</h3>

          {testimonials.map((item) => (
            <div
              key={item._id}
              className="border p-4 rounded-lg space-y-1"
            >
              <p className="font-medium">{item.clientName}</p>
              {item.company && (
                <p className="text-sm text-gray-500">{item.company}</p>
              )}
              <p className="text-sm">{item.testimonial}</p>
              <p className="text-sm font-semibold">
                Rating: {item.rating} ⭐
              </p>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => handleEdit(item)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
