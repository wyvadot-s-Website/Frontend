import React from 'react';
import { Users, ShoppingCart, FileText, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function StatsCard({ icon: Icon, title, value, details, iconColor, iconBgColor }) {
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2 rounded-lg ${iconBgColor}`}>
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-600 font-medium mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{value.toLocaleString()}</h3>
          <div className="space-y-0.5">
            {details.map((detail, index) => (
              <p key={index} className="text-xs text-gray-500">{detail}</p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}