import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";

import {
  fetchProjectsAdmin,
  addProject,
  updateProject,
  deleteProject,
} from "@/services/adminProjectService";

export default function ProjectCMS() {
  const token = localStorage.getItem("admin_token");

  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const [image, setImage] = useState(null);

  /* ================= LOAD PROJECTS ================= */
  const loadProjects = async () => {
    try {
      const res = await fetchProjectsAdmin(token);

      if (res.success) {
        setProjects(res.data);
      } else {
        toast.error(res.message || "Failed to load projects");
      }
    } catch (error) {
      toast.error("Failed to load projects");
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  /* ================= INPUT HANDLERS ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!editingId && projects.length >= 4) {
      return toast.error("Maximum of 4 projects allowed");
    }

    if (!form.title || !form.description) {
      return toast.error("All fields are required");
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    if (image) formData.append("image", image);

    try {
      if (editingId) {
        await updateProject(editingId, formData, token);
        toast.success("Project updated");
      } else {
        await addProject(formData, token);
        toast.success("Project added");
      }

      setForm({ title: "", description: "" });
      setImage(null);
      setEditingId(null);
      loadProjects();
    } catch (err) {
      toast.error(err.message);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (project) => {
    setEditingId(project._id);
    setForm({
      title: project.title,
      description: project.description,
    });
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    try {
      await deleteProject(id, token);
      toast.success("Project deleted");
      loadProjects();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* ===== ADD / EDIT FORM ===== */}
      <div className="space-y-4 pb-6 border-b">
        <div className="space-y-2">
          <Label>Project Title</Label>
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Project Title"
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Project description"
            className="h-20"
          />
        </div>

        <div className="space-y-2">
          <Label>Project Image</Label>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              id="project-image"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <Label
              htmlFor="project-image"
              className="flex-1 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer"
            >
              {image ? image.name : "Choose image"}
            </Label>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          className="bg-orange-500 hover:bg-orange-600 w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          {editingId ? "Update Project" : "Save Project"}
        </Button>
      </div>

      {/* ===== CREATED PROJECTS ===== */}
      {projects.length === 0 ? null : (
        <div className="space-y-4">
          <h3 className="font-semibold">Created Projects</h3>

          {projects.map((project) => (
            <div
              key={project._id}
              className="flex items-center justify-between border p-4 rounded-lg"
            >
              <div>
                <p className="font-medium">{project.title}</p>
                <p className="text-sm text-gray-600">{project.description}</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleEdit(project)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(project._id)}
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
