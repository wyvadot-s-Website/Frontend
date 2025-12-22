import React from 'react'
import { Users, ShoppingCart, ClipboardList, Mail, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function Dashboard() {
    const stats = [
        {
            icon: Users,
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-500',
            title: 'Total Users',
            value: '12,584',
            subtitle: 'New Users: 8,342',
            change: 'Existing: 4,242'
        },
        {
            icon: ShoppingCart,
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-500',
            title: 'Active Orders',
            value: '1,247',
            subtitle: 'Shop: 1000 Checkout',
            change: 'Services: 247'
        },
        {
            icon: ClipboardList,
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-500',
            title: 'Services Form Submitted',
            value: '5,832',
            subtitle: '+112 today',
            change: ''
        },
        {
            icon: Mail,
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-500',
            title: 'Active Newsletter Subscriptions',
            value: '4,521',
            subtitle: 'Renewals: 142 this week',
            change: ''
        }
    ]

    const recentUsers = [
        { name: 'Michael Chen', email: 'michael@example.com', tel: '+234', status: 'Active' },
        { name: 'Emma Wilson', email: 'emma@example.com', tel: '+234', status: 'Active' },
        { name: 'David Brown', email: 'david@example.com', tel: '+234', status: 'Active' },
        { name: 'Sarah Johnson', email: 'sarah@example.com', tel: '+234', status: 'Active' }
    ]

    const recentShop = [
        { name: 'Michael Chen', date: 'Dec 18, 2025', product: 'Hammer', status: 'Delivered' },
        { name: 'Emma Wilson', date: 'Dec 18, 2025', product: 'Hammer', status: 'Pending' },
        { name: 'David Brown', date: 'Dec 18, 2025', product: 'Hammer', status: 'Pending' },
        { name: 'Sarah Johnson', date: 'Dec 18, 2025', product: 'Hammer', status: 'Still in cart' }
    ]

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`${stat.iconBg} p-3 rounded-lg`}>
                                    <stat.icon className={stat.iconColor} size={24} />
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                            <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                            <div className="text-xs text-gray-500">
                                <p>{stat.subtitle}</p>
                                {stat.change && <p>{stat.change}</p>}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Users Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <CardTitle className="text-xl font-bold">Recent Users</CardTitle>
                    <Button className="bg-orange-500 hover:bg-orange-600">View all</Button>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Name</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Email</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tel</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {recentUsers.map((user, index) => (
                                <tr key={index} className="border-b last:border-0">
                                    <td className="py-3 px-4 font-medium">{user.name}</td>
                                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                                    <td className="py-3 px-4 text-gray-600">{user.tel}</td>
                                    <td className="py-3 px-4">
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                            {user.status}
                                        </Badge>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical size={16} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Shop Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <CardTitle className="text-xl font-bold">Recent Shop</CardTitle>
                    <Button className="bg-orange-500 hover:bg-orange-600">View all</Button>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Name</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Product</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {recentShop.map((order, index) => (
                                <tr key={index} className="border-b last:border-0">
                                    <td className="py-3 px-4 font-medium">{order.name}</td>
                                    <td className="py-3 px-4 text-gray-600">{order.date}</td>
                                    <td className="py-3 px-4 text-gray-600">{order.product}</td>
                                    <td className="py-3 px-4">
                                        <Badge
                                            className={
                                                order.status === 'Delivered'
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                                    : order.status === 'Pending'
                                                        ? 'bg-orange-100 text-orange-700 hover:bg-orange-100'
                                                        : 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                                            }
                                        >
                                            {order.status}
                                        </Badge>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical size={16} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Dashboard