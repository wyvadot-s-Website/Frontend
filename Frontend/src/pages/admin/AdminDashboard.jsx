import React from 'react'
import { Users, ShoppingCart, ClipboardList, Mail, FileText } from 'lucide-react'
// import { Sidebar } from '../../Layout/sidebar'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { RecentUsersTable } from '@/components/dashboard/RecentUsersTable'
import { RecentShopTable } from '@/components/dashboard/RecentShopTable'
// import { CustomerProfile } from '@/components/dashboard/CustomerProfile'

const statsData = [
    {
      icon: Users,
      title: 'Total Users',
      value: 12584,
      details: ['New Users: 8,342', 'Existing: 4,242'],
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-50'
    },
    {
      icon: ShoppingCart,
      title: 'Active Orders',
      value: 1247,
      details: ['Ships: 1000 Checkout', 'Services: 247'],
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-50'
    },
    {
      icon: FileText,
      title: 'Services Form Submitted',
      value: 5832,
      details: ['+142 today'],
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-50'
    },
    {
      icon: Mail,
      title: 'Active Newsletter Subscriptions',
      value: 4521,
      details: ['Renewals: 142 this week'],
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-50'
    }
  ];


function Dashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* <Sidebar /> */}
      
      <div className="flex-1 flex flex-col">
        {/* <DashboardHeader /> */}
        
        <div className="flex-1 flex">
          {/* Main Content */}
          <main className="flex-1 p-6 space-y-6 overflow-auto">
            {/* Stats Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>

            {/* Tables */}
            <RecentUsersTable />
            <RecentShopTable />
          </main>

          {/* Customer Profile Panel */}
         
        </div>
      </div>
    </div>
  )
}

export default Dashboard
