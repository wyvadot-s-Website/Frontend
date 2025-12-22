import React, { useState } from 'react'
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  FolderKanban, 
  FileStack, 
  Plus,
  ChevronDown,
  User,
  UserPlus,
  LogOut,
  Menu,
  Bell
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import logo from "../../public/af586a3ee0894e6b9fdd44a1f9c63d062d814420.png"
import { Outlet, Link, useLocation } from 'react-router-dom'

function AdminLayout() {
     const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0)
    const location = useLocation();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/theboss/dashboard' },
        { icon: FileText, label: 'Content Management', path: '/theboss/content' },
        { icon: Briefcase, label: 'Services', path: '/theboss/services' },
        { icon: FolderKanban, label: 'Projects', path: '/theboss/projects' },
        { icon: FileStack, label: 'Forms & Submissions', path: '/theboss/forms' }
    ]

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-white border-r transition-all duration-300 overflow-hidden flex flex-col h-screen`}>
      {/* Logo */}
      <div className="p-4">
        <img src={logo} alt="" className='w-30'/>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          <p className="text-xs text-gray-500 font-semibold mb-3 px-3">Navigation</p>
          {menuItems.map((item, index) => (
  <Link
    key={index}
    to={item.path}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
      location.pathname === item.path
        ? 'bg-gray-100 text-gray-900 font-medium'
        : 'text-gray-600 hover:bg-gray-50'
    }`}
  >
    <item.icon size={18} />
    {item.label}
  </Link>
))}
        </div>

        <div className="">
          {/* <p className="text-xs text-gray-500 font-semibold mb-3 px-3">Integrations</p> */}
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <Plus size={18} />
            Integrations
          </button>
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gray-200 text-gray-700 text-sm">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">john@doe.com</p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>View account</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Add Admin</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden border m-4 rounded-xl border border-[#E5E7EB]">
                {/* Header */}
               <header className="bg-white border-b px-6 py-3">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="h-9 w-9"
      >
        <Menu size={18} />
      </Button>
      
      <h1 className="text-sm font-medium text-gray-900">
        {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
      </h1>
    </div>

    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="relative h-9 w-9">
        <Bell size={18} className="text-gray-600" />
        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
      </Button>
    </div>
  </div>
</header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout