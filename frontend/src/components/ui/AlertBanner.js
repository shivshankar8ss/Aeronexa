import React from 'react';
import { ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const variants = {
  warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', icon: ExclamationTriangleIcon, iconColor: 'text-yellow-500' },
  danger:  { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-800',    icon: ExclamationTriangleIcon, iconColor: 'text-red-500'    },
  success: { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-800',  icon: CheckCircleIcon,         iconColor: 'text-green-500'  },
  info:    { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-800',   icon: InformationCircleIcon,   iconColor: 'text-blue-500'   },
};

export default function AlertBanner({ variant = 'info', title, description }) {
  const v = variants[variant];
  const Icon = v.icon;
  return (
    <div className={`flex gap-3 p-4 rounded-xl border ${v.bg} ${v.border} animate-fade-in`}>
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${v.iconColor}`} />
      <div>
        <p className={`text-sm font-semibold ${v.text}`}>{title}</p>
        {description && <p className={`text-xs mt-0.5 ${v.text} opacity-80`}>{description}</p>}
      </div>
    </div>
  );
}
