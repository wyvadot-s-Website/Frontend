import React from 'react'
import { Bell, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
      <div className="flex items-center gap-3">
        <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
        <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
      </div>
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5 text-muted-foreground" />
        <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full" />
      </Button>
    </header>
  )
}
