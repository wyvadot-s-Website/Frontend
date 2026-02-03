import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

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
     <div className="space-y-6">
  {/* Input Fields in Grid Layout */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* Name */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Name
      </label>
      <Input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Team Member 1"
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      />
    </div>

    {/* Role */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Role
      </label>
      <Input
        name="position"
        value={form.position}
        onChange={handleChange}
        placeholder="Project Manager"
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      />
    </div>

    {/* Bio */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Bio
      </label>
      <Input
        name="bio"
        value={form.bio}
        onChange={handleChange}
        placeholder="Bio"
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      />
    </div>
  </div>

  {/* Team Image Upload */}
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      Team Image
    </label>
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <Input
          type="file"
          accept="image/*"
          className="hidden"
          id="team-image"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
        <Label
          htmlFor="team-image"
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
        Upload
      </Button>
    </div>
  </div>

  {/* Existing Team Members List */}
  {team.length > 0 && (
    <div className="space-y-4 pt-6 border-t">
      <h3 className="font-semibold text-gray-900">Team Members</h3>
      <div className="space-y-3">
        {team.map((member) => (
          <Card key={member._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Team Member Image */}
                {member.imageUrl && (
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  />
                )}
                
                {/* Team Member Info */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Name</p>
                    <p className="font-medium text-gray-900">{member.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Role</p>
                    <p className="text-gray-700">{member.position}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Bio</p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(member)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(member._id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )}
</div>

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
