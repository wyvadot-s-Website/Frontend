import React from 'react';
import { Truck, Award, Lock, Phone } from 'lucide-react';

const FeatureCards = () => {
  const features = [
    {
      id: 1,
      icon: <Truck size={40} strokeWidth={1.5} />,
      title: 'Reliable Delivery',
      description: 'Tracked, Secure, Nationwide'
    },
    {
      id: 2,
      icon: <Award size={40} strokeWidth={1.5} />,
      title: 'Certified Quality',
      description: 'Vetted, Durable, Compliant'
    },
    {
      id: 3,
      icon: <Lock size={40} strokeWidth={1.5} />,
      title: 'Secure Payments',
      description: 'Encrypted, Trusted, Seamless'
    },
    {
      id: 4,
      icon: <Phone size={40} strokeWidth={1.5} />,
      title: '24/7 Support',
      description: 'Phone and Email support'
    }
  ];

  return (
    <div className="w-full py-8 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-gray-100 rounded-xl p-6 flex flex-col items-start space-y-2"
            >
              <div className="text-black mb-2">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-black">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureCards;