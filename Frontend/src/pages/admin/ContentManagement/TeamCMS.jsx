import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";

import {
  fetchTeamAdmin,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "@/services/adminTeamService";

export default function TeamCMS() {
  const token = localStorage.getItem("admin_token");

  const [team, setTeam] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    position: "",
    bio: "",
  });

  const [image, setImage] = useState(null);

  /* ================= FETCH TEAM ================= */
  const loadTeam = async () => {
    const res = await fetchTeamAdmin(token);

    if (Array.isArray(res) && res.length > 0) {
      setTeam(res);
    } else {
      setTeam([]);
    }
  };

  useEffect(() => {
    if (token) loadTeam();
  }, [token]);

  /* ================= INPUT HANDLERS ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      // 🚨 image required when creating
      if (!editingId && !image) {
        toast.error("Please select a team image");
        return;
      }

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("position", form.position);
      formData.append("bio", form.bio);

      if (image) {
        formData.append("image", image);
      }

      if (editingId) {
        await updateTeamMember(editingId, formData, token);
        toast.success("Team member updated");
      } else {
        await addTeamMember(formData, token);
        toast.success("Team member added");
      }

      setForm({ name: "", position: "", bio: "" });
      setImage(null);
      setEditingId(null);
      loadTeam();
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleEdit = (member) => {
    setEditingId(member._id);
    setForm({
      name: member.name,
      position: member.position,
      bio: member.bio,
    });
  };

  const handleDelete = async (id) => {
    await deleteTeamMember(id, token);
    loadTeam();
  };

  return (
    <div className="space-y-6">
      {/* ===== ADD / EDIT FORM ===== */}
      <div className="space-y-4 pb-6 border-b">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Team Member Name"
            />
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Input
              name="position"
              value={form.position}
              onChange={handleChange}
              placeholder="Position"
            />
          </div>

          <div className="space-y-2">
            <Label>Bio</Label>
            <Input
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Bio"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Team Image</Label>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              id="team-image"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <Label
              htmlFor="team-image"
              className="flex-1 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer"
            >
              {image ? image.name : "Choose image"}
            </Label>
          </div>
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        className="bg-orange-500 hover:bg-orange-600 w-full"
      >
        <Upload className="mr-2 h-4 w-4" />
        {editingId ? "Update Team Member" : "Save Team Member"}
      </Button>

      {/* ===== CREATED TEAM MEMBERS ===== */}
      {team.length === 0 ? (
        "No Created Team Member"
      ) : (
        <div className="space-y-4 pt-6 border-t">
          <h3 className="font-semibold">Created Team Members</h3>

          {team.map((member) => (
            <div
              key={member._id}
              className="flex items-center justify-between border p-4 rounded-lg"
            >
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-gray-500">{member.position}</p>
                <p className="text-sm text-gray-700 ">{member.bio}</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleEdit(member)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(member._id)}
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
