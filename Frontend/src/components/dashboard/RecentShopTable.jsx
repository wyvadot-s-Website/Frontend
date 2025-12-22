import React from 'react'
import { MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const recentShop = [
  { name: 'Michael Chen', date: 'Dec 18, 2025', product: 'Hammer', status: 'Delivered' },
  { name: 'Emma Wilson', date: 'Dec 18, 2025', product: 'Hammer', status: 'Pending' },
  { name: 'David Brown', date: 'Dec 18, 2025', product: 'Hammer', status: 'Pending' },
  { name: 'Sarah Johnson', date: 'Dec 18, 2025', product: 'Hammer', status: 'Still in cart' },
]

const getStatusVariant = (status) => {
  switch (status) {
    case 'Delivered':
      return 'success'
    case 'Pending':
      return 'warning'
    case 'Still in cart':
      return 'info'
    default:
      return 'secondary'
  }
}

export function RecentShopTable() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">Recent Shop</CardTitle>
        <Button size="sm">View all</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">Name</TableHead>
              <TableHead className="text-muted-foreground font-medium">Date</TableHead>
              <TableHead className="text-muted-foreground font-medium">Product</TableHead>
              <TableHead className="text-muted-foreground font-medium">Status</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentShop.map((order, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{order.name}</TableCell>
                <TableCell className="text-muted-foreground">{order.date}</TableCell>
                <TableCell className="text-muted-foreground">{order.product}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
