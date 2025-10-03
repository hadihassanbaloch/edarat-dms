import React, { useState } from 'react';
import { User } from 'lucide-react';

interface AvatarImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  size?: number;
  role?: 'admin' | 'manager' | 'employee';
}

const getRoleGradient = (role?: string) => {
  switch (role) {
    case 'admin':
      return 'from-red-500 to-red-600';
    case 'manager':
      return 'from-blue-500 to-blue-600';
    case 'employee':
      return 'from-green-500 to-green-600';
    default:
      return 'from-eteal-500 to-eteal-600';
  }
};

export default function AvatarImage({ 
  src, 
  alt, 
  className = "w-8 h-8 rounded-full object-cover",
  fallbackClassName = "w-8 h-8 rounded-full flex items-center justify-center",
  size = 64,
  role
}: AvatarImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Optimize image URL for better performance
  const optimizedSrc = src ? 
    src.replace(/w=\d+/, `w=${size}`).replace(/h=\d+/, `h=${size}`).replace(/dpr=\d+/, 'dpr=1')
    : undefined;

  if (!src || imageError) {
    return (
      <div className={`${fallbackClassName} bg-gradient-to-br ${getRoleGradient(role)}`}>
        <User className="w-4 h-4 text-white" />
      </div>
    );
  }

  return (
    <div className="relative">
      {imageLoading && (
        <div className={`${fallbackClassName} bg-gradient-to-br ${getRoleGradient(role)} animate-pulse`}>
          <User className="w-4 h-4 text-white opacity-50" />
        </div>
      )}
      <img
        src={optimizedSrc}
        alt={alt}
        className={`${className} ${imageLoading ? 'opacity-0 absolute inset-0' : 'opacity-100'} transition-opacity duration-200`}
        loading="lazy"
        onError={handleImageError}
        onLoad={handleImageLoad}
        decoding="async"
      />
    </div>
  );
}