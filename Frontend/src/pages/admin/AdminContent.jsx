import React, { useState } from 'react';
import { FileText, Briefcase, Users, MessageSquare, Upload } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    { icon: FileText, title: 'Pages', value: 8 },
    { icon: Briefcase, title: 'Services', value: 6 },
    { icon: Users, title: 'Team Members', value: 12 },
    { icon: MessageSquare, title: 'Testimonials', value: 24 }
  ];

  const performanceStats = [
    { label: 'years of combined experience', value: '60+' },
    { label: 'Projects Delivered', value: '50+' },
    { label: 'Repeat Clients/Customer Retention', value: '99%' },
    { label: 'On-Time Delivery Rate', value: '95%' }
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
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="footer">Footer</TabsTrigger>
            </TabsList>

            <TabsContent value="home" className="space-y-6">
              {/* Hero Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Hero Section Title</h3>
                <Input 
                  placeholder="What We Build, We Build With Purpose"
                  defaultValue="What We Build, We Build With Purpose"
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Hero Section Subtitle</h3>
                <Input 
                  placeholder="Professional Construction & Engineering Services"
                  defaultValue="Professional Construction & Engineering Services"
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Hero Section Background</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="hero-bg-upload"
                    />
                    <Label 
                      htmlFor="hero-bg-upload"
                      className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors"
                    >
                      <span className="text-sm text-gray-500">
                        {selectedFile ? selectedFile.name : 'No file chosen'}
                      </span>
                    </Label>
                  </div>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
                {performanceStats.map((stat, index) => (
                  <StatCard key={index} {...stat} />
                ))}
              </div>

              {/* Why Choose Us */}
              <div className="space-y-4 pt-6">
                <h3 className="font-semibold text-gray-900">Why Choose Us</h3>
                <Input 
                  placeholder="Why Choose Vrynadot?"
                  defaultValue="Why Choose Vrynadot?"
                />
              </div>

              <div className="flex justify-end pt-6">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Upload className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="about" className="space-y-6">
              {/* About Us - Main Heading */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">About Us - Main Heading</h3>
                <Input 
                  placeholder="About Vrynadot"
                  defaultValue="About Vrynadot"
                />
              </div>

              {/* About Us - Scroll Text */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">About Us - Scroll Text</h3>
                <Input 
                  placeholder="Our Promise is a company ..."
                  defaultValue="Our Promise is a company ..."
                />
              </div>

              {/* History */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">History</h3>
                <Input 
                  placeholder="Our Promise is a company ..."
                  defaultValue="Our Promise is a company ..."
                />
              </div>

              {/* Mission */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Mission</h3>
                <Input 
                  placeholder="Our Promise is a company ..."
                  defaultValue="Our Promise is a company ..."
                />
              </div>

              {/* Vision */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Vision</h3>
                <Input 
                  placeholder="Our Promise is a company ..."
                  defaultValue="Our Promise is a company ..."
                />
              </div>

              {/* Hero Section Background */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Hero Section Background</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="about-hero-bg"
                    />
                    <Label 
                      htmlFor="about-hero-bg"
                      className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors"
                    >
                      <span className="text-sm text-gray-500">
                        Chosen File: No file chosen
                      </span>
                    </Label>
                  </div>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </div>
              </div>

              {/* About Us - Spotlight Images */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">About Us - Spotlight Images</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      id="about-spotlight"
                    />
                    <Label 
                      htmlFor="about-spotlight"
                      className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors"
                    >
                      <span className="text-sm text-gray-500">
                        Chosen File: No file chosen (Select 4)
                      </span>
                    </Label>
                  </div>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">years of combined experience</Label>
                  <Input defaultValue="60+" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Projects Delivered</Label>
                  <Input defaultValue="50+" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Repeat Clients/Customer Retention</Label>
                  <Input defaultValue="99%" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">On-Time Delivery Rate</Label>
                  <Input defaultValue="95%" />
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Upload className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            </TabsContent>

           <TabsContent value="services" className="space-y-8">
  {/* Service 1 - Project Management & Resources */}
  <div className="space-y-4 pb-6 border-b">
    <h3 className="text-lg font-semibold text-gray-900">Project Management & Resources (PMR)</h3>
    
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Service Title</Label>
      <Input 
        placeholder="Project Management & Resources"
        defaultValue="Project Management & Resources"
      />
    </div>

    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Change Icon</Label>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            id="service-1-icon"
          />
          <Label 
            htmlFor="service-1-icon"
            className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors"
          >
            <span className="text-sm text-gray-500">
              Chosen File: No file chosen
            </span>
          </Label>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </div>
    </div>
  </div>

  {/* Service 2 - Civil Engineering & Construction */}
  <div className="space-y-4 pb-6 border-b">
    <h3 className="text-lg font-semibold text-gray-900">Civil Engineering & Construction (CEC)</h3>
    
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Service Title</Label>
      <Input 
        placeholder="Civil Engineering & Construction"
        defaultValue="Civil Engineering & Construction"
      />
    </div>

    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Change Icon</Label>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            id="service-2-icon"
          />
          <Label 
            htmlFor="service-2-icon"
            className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors"
          >
            <span className="text-sm text-gray-500">
              Chosen File: No file chosen
            </span>
          </Label>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </div>
    </div>
  </div>

  {/* Service 3 - Facility Management & Maintenance */}
  <div className="space-y-4 pb-6 border-b">
    <h3 className="text-lg font-semibold text-gray-900">Facility Management & Maintenance (FMM)</h3>
    
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Service Title</Label>
      <Input 
        placeholder="Facility Management & Maintenance"
        defaultValue="Facility Management & Maintenance"
      />
    </div>

    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Change Icon</Label>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            id="service-3-icon"
          />
          <Label 
            htmlFor="service-3-icon"
            className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors"
          >
            <span className="text-sm text-gray-500">
              Chosen File: No file chosen
            </span>
          </Label>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </div>
    </div>
  </div>

  {/* Service 4 - Energy & Process Services */}
  <div className="space-y-4 pb-6 border-b">
    <h3 className="text-lg font-semibold text-gray-900">Energy & Process Services</h3>
    
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Service Title</Label>
      <Input 
        placeholder="Energy & Process Services"
        defaultValue="Energy & Process Services"
      />
    </div>

    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Change Icon</Label>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            id="service-4-icon"
          />
          <Label 
            htmlFor="service-4-icon"
            className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors"
          >
            <span className="text-sm text-gray-500">
              Chosen File: No file chosen
            </span>
          </Label>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </div>
    </div>
  </div>

  {/* Service 5 - Technology & E-Commerce */}
  <div className="space-y-4 pb-6 border-b">
    <h3 className="text-lg font-semibold text-gray-900">Technology & E-Commerce</h3>
    
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Service Title</Label>
      <Input 
        placeholder="Technology & E-Commerce"
        defaultValue="Technology & E-Commerce"
      />
    </div>

    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Change Icon</Label>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            id="service-5-icon"
          />
          <Label 
            htmlFor="service-5-icon"
            className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors"
          >
            <span className="text-sm text-gray-500">
              Chosen File: No file chosen
            </span>
          </Label>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </div>
    </div>
  </div>

  {/* Service 6 - General Contracts */}
  <div className="space-y-4 pb-6">
    <h3 className="text-lg font-semibold text-gray-900">General Contracts</h3>
    
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Service Title</Label>
      <Input 
        placeholder="General Contracts"
        defaultValue="General Contracts"
      />
    </div>

    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Change Icon</Label>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            id="service-6-icon"
          />
          <Label 
            htmlFor="service-6-icon"
            className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors"
          >
            <span className="text-sm text-gray-500">
              Chosen File: No file chosen
            </span>
          </Label>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </div>
    </div>
  </div>

  <div className="flex justify-end pt-6">
    <Button className="bg-orange-500 hover:bg-orange-600">
      <Upload className="mr-2 h-4 w-4" />
      Save
    </Button>
  </div>
            </TabsContent>

           <TabsContent value="team" className="space-y-6">
  {/* Team Member 1 */}
  <div className="space-y-4 pb-6 border-b">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Name</Label>
        <Input 
          placeholder="Team Member 1"
          defaultValue="Team Member 1"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Role</Label>
        <Input 
          placeholder="Project Manager"
          defaultValue="Project Manager"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Bio</Label>
        <Input 
          placeholder="Bio"
          defaultValue="Bio"
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Hero Section Background</Label>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            id="team-member-1"
          />
          <Label 
            htmlFor="team-member-1"
            className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors"
          >
            <span className="text-sm text-gray-500">
              Chosen File: No file chosen
            </span>
          </Label>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </div>
    </div>
  </div>

  {/* Team Member 2 */}
  <div className="space-y-4 pb-6 border-b">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Name</Label>
        <Input 
          placeholder="Team Member 1"
          defaultValue="Team Member 1"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Role</Label>
        <Input 
          placeholder="Project Manager"
          defaultValue="Project Manager"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Bio</Label>
        <Input 
          placeholder="Bio"
          defaultValue="Bio"
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Hero Section Background</Label>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            id="team-member-2"
          />
          <Label 
            htmlFor="team-member-2"
            className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors"
          >
            <span className="text-sm text-gray-500">
              Chosen File: No file chosen
            </span>
          </Label>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </div>
    </div>
  </div>

  {/* Team Member 3 */}
  <div className="space-y-4 pb-6 border-b">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Name</Label>
        <Input 
          placeholder="Team Member 1"
          defaultValue="Team Member 1"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Role</Label>
        <Input 
          placeholder="Project Manager"
          defaultValue="Project Manager"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Bio</Label>
        <Input 
          placeholder="Bio"
          defaultValue="Bio"
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Hero Section Background</Label>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            id="team-member-3"
          />
          <Label 
            htmlFor="team-member-3"
            className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors"
          >
            <span className="text-sm text-gray-500">
              Chosen File: No file chosen
            </span>
          </Label>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </div>
    </div>
  </div>

  {/* Team Member 4 */}
  <div className="space-y-4 pb-6 border-b">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Name</Label>
        <Input 
          placeholder="Team Member 1"
          defaultValue="Team Member 1"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Role</Label>
        <Input 
          placeholder="Project Manager"
          defaultValue="Project Manager"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Bio</Label>
        <Input 
          placeholder="Bio"
          defaultValue="Bio"
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Hero Section Background</Label>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            id="team-member-4"
          />
          <Label 
            htmlFor="team-member-4"
            className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors"
          >
            <span className="text-sm text-gray-500">
              Chosen File: No file chosen
            </span>
          </Label>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </div>
    </div>
  </div>

  {/* Team Member 5 */}
  <div className="space-y-4 pb-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Name</Label>
        <Input 
          placeholder="Team Member 1"
          defaultValue="Team Member 1"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Role</Label>
        <Input 
          placeholder="Project Manager"
          defaultValue="Project Manager"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Bio</Label>
        <Input 
          placeholder="Bio"
          defaultValue="Bio"
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Hero Section Background</Label>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            id="team-member-5"
          />
          <Label 
            htmlFor="team-member-5"
            className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors"
          >
            <span className="text-sm text-gray-500">
              Chosen File: No file chosen
            </span>
          </Label>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </div>
    </div>
  </div>

  <div className="flex justify-center pt-6">
    <Button className="bg-orange-500 hover:bg-orange-600 w-full max-w-md">
      <Upload className="mr-2 h-4 w-4" />
      Save Team Information
    </Button>
  </div>
            </TabsContent>

            <TabsContent value="testimonials" className="space-y-6">
  {/* Testimonial 1 */}
  <div className="space-y-4 pb-6 border-b">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Client Name</Label>
        <Input 
          placeholder="Client 1"
          defaultValue="Client 1"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Company (optional)</Label>
        <Input 
          placeholder="Client 1"
          defaultValue="Client 1"
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Testimonial</Label>
      <Input 
        placeholder="Excellent service and professional team. Highly recommended!"
        defaultValue="Excellent service and professional team. Highly recommended!"
        className="h-20"
      />
    </div>

    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Rating</Label>
      <Input 
        type="number"
        min="1"
        max="5"
        placeholder="5"
        defaultValue="5"
      />
    </div>
  </div>

  {/* Testimonial 2 */}
  <div className="space-y-4 pb-6 border-b">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Client Name</Label>
        <Input 
          placeholder="Client 1"
          defaultValue="Client 1"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Company (optional)</Label>
        <Input 
          placeholder="Client 1"
          defaultValue="Client 1"
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Testimonial</Label>
      <Input 
        placeholder="Excellent service and professional team. Highly recommended!"
        defaultValue="Excellent service and professional team. Highly recommended!"
        className="h-20"
      />
    </div>

    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Rating</Label>
      <Input 
        type="number"
        min="1"
        max="5"
        placeholder="5"
        defaultValue="5"
      />
    </div>
  </div>

  {/* Testimonial 3 */}
  <div className="space-y-4 pb-6 border-b">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Client Name</Label>
        <Input 
          placeholder="Client 1"
          defaultValue="Client 1"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Company (optional)</Label>
        <Input 
          placeholder="Client 1"
          defaultValue="Client 1"
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Testimonial</Label>
      <Input 
        placeholder="Excellent service and professional team. Highly recommended!"
        defaultValue="Excellent service and professional team. Highly recommended!"
        className="h-20"
      />
    </div>

    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Rating</Label>
      <Input 
        type="number"
        min="1"
        max="5"
        placeholder="5"
        defaultValue="5"
      />
    </div>
  </div>

  {/* Testimonial 4 */}
  <div className="space-y-4 pb-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Client Name</Label>
        <Input 
          placeholder="Client 1"
          defaultValue="Client 1"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Company (optional)</Label>
        <Input 
          placeholder="Client 1"
          defaultValue="Client 1"
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Testimonial</Label>
      <Input 
        placeholder="Excellent service and professional team. Highly recommended!"
        defaultValue="Excellent service and professional team. Highly recommended!"
        className="h-20"
      />
    </div>

    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Rating</Label>
      <Input 
        type="number"
        min="1"
        max="5"
        placeholder="5"
        defaultValue="5"
      />
    </div>
  </div>

  <div className="flex justify-center pt-6">
    <Button className="bg-orange-500 hover:bg-orange-600 w-full max-w-md">
      <Upload className="mr-2 h-4 w-4" />
      Save Testimonials
    </Button>
  </div>
            </TabsContent>

            <TabsContent value="footer">
              <p className="text-gray-500">Footer content goes here...</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}