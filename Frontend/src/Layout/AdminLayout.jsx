import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import {
    LayoutDashboard,
    FileText,
    Wrench,
    FolderKanban,
    ClipboardList,
    Plus,
    Bell,
    ChevronDown,
    Menu
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: FileText, label: 'Content Management', path: '/admin/content' },
        { icon: Wrench, label: 'Services', path: '/admin/services' },
        { icon: FolderKanban, label: 'Projects', path: '/admin/projects' },
        { icon: ClipboardList, label: 'Forms & Submissions', path: '/admin/forms' }
    ]

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-white border-r transition-all duration-300 overflow-hidden`}>
                <div className="p-6 border-b">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">W</span>
                        </div>
                        <span className="font-bold text-lg">Wyvadat <span className="text-orange-500">PR</span></span>
                    </div>
                </div>

                <nav className="p-4">
                    <div className="space-y-1">
                        <p className="text-xs text-gray-500 font-semibold mb-3 px-3">Navigation</p>
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                                    index === 0
                                        ? 'bg-gray-100 text-gray-900 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 pt-8 border-t">
                        <p className="text-xs text-gray-500 font-semibold mb-3 px-3">Integrations</p>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                            <Plus size={18} />
                            Integrations
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            >
                                <Menu size={20} />
                            </Button>
                            <h1 className="text-xl font-semibold">Dashboard</h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell size={20} />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
                            </Button>

                            <div className="flex items-center gap-3 pl-4 border-l">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">JD</AvatarFallback>
                                </Avatar>
                                <div className="text-sm">
                                    <p className="font-medium">John Doe</p>
                                    <p className="text-xs text-gray-500">johndoe@example.com</p>
                                </div>
                                <ChevronDown size={16} className="text-gray-400" />
                            </div>
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