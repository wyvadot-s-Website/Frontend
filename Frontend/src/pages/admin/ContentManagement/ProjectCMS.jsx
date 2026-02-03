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
    <div className="space-y-8">
  {/* ===== CREATED PROJECTS LIST ===== */}
  {projects.length > 0 && (
    <div className="space-y-4">
      {projects.map((project, index) => (
        <div key={project._id} className="border border-gray-200 rounded-lg p-6 space-y-6">
          {/* Project Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Project {index + 1}
            </h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleEdit(project)}
                className="border-gray-300"
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(project._id)}
              >
                Delete
              </Button>
            </div>
          </div>

          {/* Project Details - Read-only view */}
          <div className="space-y-4">
            {/* Category */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Our Best Work
              </label>
              <div className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-600">
                {project.category || "Our Best Work"}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <div className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-900">
                {project.title}
              </div>
            </div>

            {/* Sub Title / Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Sub Title
              </label>
              <div className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-600">
                {project.description}
              </div>
            </div>

            {/* Image Display */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Change / Upload Image
              </label>
              {project.imageUrl && (
                <div className="mb-2">
                  <img 
                    src={project.imageUrl} 
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-md border border-gray-200"
                  />
                </div>
              )}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id={`project-image-${project._id}`}
                    onChange={(e) => {
                      setImage(e.target.files?.[0] || null);
                      setEditingId(project._id);
                    }}
                  />
                  <Label 
                    htmlFor={`project-image-${project._id}`}
                    className="flex items-center justify-between w-full border border-gray-300 rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-600">
                      {image && editingId === project._id ? image.name : "No file chosen"}
                    </span>
                  </Label>
                </div>
                <Button 
                  onClick={() => handleImageUpdate(project._id)}
                  disabled={!image || editingId !== project._id}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}

  {/* ===== ADD NEW PROJECT FORM ===== */}
  <div className="border border-gray-200 rounded-lg p-6 space-y-6">
    <h3 className="text-lg font-semibold text-gray-900">
      {editingId ? "Edit Project" : "Add New Project"}
    </h3>

    <div className="space-y-4">
      {/* Category */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Our Best Work
        </label>
        <Input
          name="category"
          value={form.category || "Our Best Work"}
          onChange={handleChange}
          placeholder="Category"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <Input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {/* Sub Title / Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Sub Title
        </label>
        <Input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Sub Title"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Change / Upload Image
        </label>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              id="new-project-image"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
            <Label 
              htmlFor="new-project-image"
              className="flex items-center justify-between w-full border border-gray-300 rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-600">
                {image ? image.name : "No file chosen"}
              </span>
            </Label>
          </div>
          <Button 
            onClick={handleSubmit}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6"
          >
            <Upload className="mr-2 h-4 w-4" />
            {editingId ? "Update" : "Upload"}
          </Button>
        </div>
      </div>
    </div>

    {editingId && (
      <Button 
        onClick={() => {
          setEditingId(null);
          setForm({ title: "", description: "", category: "" });
          setImage(null);
        }}
        variant="outline"
        className="w-full"
      >
        Cancel Edit
      </Button>
    )}
  </div>

  {/* Empty State */}
  {projects.length === 0 && (
    <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
      <p className="text-gray-500">No projects yet. Add your first project above.</p>
    </div>
  )}
</div>
  );
}
