import React, { useState } from "react";
import {
  FileText,
  Briefcase,
  Users,
  MessageSquare,
  Upload,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HomeCMS from "./ContentManagement/HomeCMS.jsx";
import AboutCMS from "./ContentManagement/AboutCMS.jsx";
import ProjectCMS from "./ContentManagement/ProjectCMS.jsx";
import TeamCMS from "./ContentManagement/TeamCMS.jsx";
import TestimonialCMS from "./ContentManagement/TestimonialCMS.jsx";
import FooterCMS from "./ContentManagement/FooterCMS.jsx";

function ContentStatsCard({ icon: Icon, title, value }) {
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 rounded-lg bg-orange-50">
            <Icon className="h-4 w-4 text-orange-600" />
          </div>
        </div>
        <p className="text-xs text-gray-600 font-medium mb-2">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      </CardContent>
    </Card>
  );
}

function StatCard({ label, value }) {
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-6">
        <p className="text-sm text-gray-600 mb-2">{label}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      </CardContent>
    </Card>
  );
}

export default function AdminContent() {
  const [selectedFile, setSelectedFile] = useState(null);

  const contentStats = [
    { icon: FileText, title: "Pages", value: 8 },
    { icon: Briefcase, title: "Services", value: 6 },
    { icon: Users, title: "Team Members", value: 12 },
    { icon: MessageSquare, title: "Testimonials", value: 24 },
  ];

  const performanceStats = [
    { label: "years of combined experience", value: "60+" },
    { label: "Projects Delivered", value: "50+" },
    { label: "Repeat Clients/Customer Retention", value: "99%" },
    { label: "On-Time Delivery Rate", value: "95%" },
  ];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contentStats.map((stat, index) => (
          <ContentStatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Web Content Section */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-6">Web Content</h2>

          <Tabs defaultValue="home" className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-6">
              <TabsTrigger value="home">Home</TabsTrigger>
              <TabsTrigger value="about">About Us</TabsTrigger>
              <TabsTrigger value="project">Projects</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="footer">Footer</TabsTrigger>
            </TabsList>

            <TabsContent value="home" className="space-y-6">
              {/* Hero Section */}
              <HomeCMS
                selectedFile={selectedFile}
                handleFileChange={handleFileChange}
                performanceStats={performanceStats}
              />
            </TabsContent>

            <TabsContent value="about" className="space-y-6">
              {/* About Us - Main Heading */}
              <AboutCMS />
            </TabsContent>

            <TabsContent value="project" className="space-y-6">
              {/* Projects */}
              <ProjectCMS />
            </TabsContent>


            <TabsContent value="team" className="space-y-6">
              {/* Team Members */}
              <TeamCMS />  
            </TabsContent>

            <TabsContent value="testimonials" className="space-y-6">
              {/* Testimonials */}
              <TestimonialCMS />
            </TabsContent>

            <TabsContent value="footer">
              {/* Footer */}
              <FooterCMS />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
