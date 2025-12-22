import React from 'react'
import { MapPin, ShoppingBag, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export function CustomerProfile() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Customer Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" />
            <AvatarFallback className="bg-primary text-primary-foreground">SM</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">Smith</h3>
              <Badge variant="success" className="text-[10px] px-1.5 py-0">New</Badge>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>San Francisco, CA</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 py-4 border-y border-border">
          <div className="text-center">
            <p className="text-xl font-bold text-primary">12</p>
            <p className="text-xs text-muted-foreground">Shop</p>
          </div>
          <div className="text-center border-x border-border">
            <p className="text-xl font-bold text-foreground">N48.5K</p>
            <p className="text-xs text-muted-foreground">Total Spent</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">4.7</p>
            <p className="text-xs text-muted-foreground">Rating</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h4>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-icon-bg flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-icon-color" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Purchase Cement</p>
                <p className="text-xs text-muted-foreground">Today, 09:45 AM</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-status-info-bg flex items-center justify-center">
                <Star className="h-4 w-4 text-status-info" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Ordered for Project management services</p>
                <p className="text-xs text-muted-foreground">June 18, 2025, 11:15 AM</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
