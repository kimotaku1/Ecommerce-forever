import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { ChevronDown, ChevronUp } from 'lucide-react';

const policyData = [
  {
    title: 'Easy Exchange Policy',
    description: 'Hassle-free exchange within 7 days.',
    details:
      'You can exchange items within 7 days of delivery if they are unused and in original packaging. Simply initiate a request through your order dashboard or contact our support.',
    icon: assets.exchange_icon,
  },
  {
    title: '7 Days Return Policy',
    description: 'Full refunds on eligible returns.',
    details:
      'If you are not satisfied, return the product within 7 days for a full refund. Items must be unused, unwashed, and in original packaging.',
    icon: assets.quality_icon,
  },
  {
    title: '24/7 Customer Support',
    description: 'Round-the-clock assistance.',
    details:
      'Our dedicated support team is here to help you anytime via email, or phone. We prioritize your satisfaction at every step.',
    icon: assets.support_img,
  },
];

const OurPolicy = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const togglePolicy = (index) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-gray-800">
        Our Service Policies
      </h2>
      <div className="grid gap-8 md:grid-cols-3">
        {policyData.map((policy, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 transition duration-300 hover:shadow-xl"
            >
              <button
                onClick={() => togglePolicy(index)}
                className="flex items-center justify-between w-full text-left focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <img src={policy.icon} alt={policy.title} className="w-10 h-10" />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{policy.title}</h3>
                    <p className="text-gray-500 text-sm">{policy.description}</p>
                  </div>
                </div>
                <span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                </span>
              </button>
              <div
                className={`mt-4 text-sm text-gray-600 transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p>{policy.details}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OurPolicy;
