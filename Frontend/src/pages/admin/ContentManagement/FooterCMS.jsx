import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { fetchFooterAdmin, saveFooter } from "@/services/adminFooterService";
import { toast } from "sonner";

export default function FooterCMS() {
  const token = localStorage.getItem("admin_token");
  const [form, setForm] = useState({
    address: "",
    phone: "",
    email: "",
    socialLinks: {
      whatsapp: "",
      facebook: "",
      instagram: "",
      linkedin: "",
      twitter: "",
    },
  });

  useEffect(() => {
    loadFooter();
  }, []);

  const loadFooter = async () => {
    const res = await fetchFooterAdmin(token);
    if (res?.data) setForm(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSocialChange = (e) => {
    setForm({
      ...form,
      socialLinks: {
        ...form.socialLinks,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSubmit = async () => {
    await saveFooter(form, token);
    toast.success("Footer updated successfully");
  };

  return (
    <div className="space-y-6">
      <Label>Address</Label>
      <Input name="address" value={form.address} onChange={handleChange} />

      <Label>Phone</Label>
      <Input name="phone" value={form.phone} onChange={handleChange} />

      <Label>Email</Label>
      <Input name="email" value={form.email} onChange={handleChange} />

      <Label>WhatsApp</Label>
      <Input
        name="whatsapp"
        value={form.socialLinks.whatsapp}
        onChange={handleSocialChange}
      />

      <Label>Facebook</Label>
      <Input
        name="facebook"
        value={form.socialLinks.facebook}
        onChange={handleSocialChange}
      />

      <Label>Instagram</Label>
      <Input
        name="instagram"
        value={form.socialLinks.instagram}
        onChange={handleSocialChange}
      />

      <Label>LinkedIn</Label>
      <Input
        name="linkedin"
        value={form.socialLinks.linkedin}
        onChange={handleSocialChange}
      />

      <Label>Twitter</Label>
      <Input
        name="twitter"
        value={form.socialLinks.twitter}
        onChange={handleSocialChange}
      />

      <Button onClick={handleSubmit} className="bg-orange-500 w-full">
        Save Footer
      </Button>
    </div>
  );
}
