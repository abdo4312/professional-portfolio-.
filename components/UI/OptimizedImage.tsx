import React, { useState, useEffect } from 'react';
import { cn } from '../../services/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
}

const getOptimizedUrl = (url: string, width?: number, height?: number, quality = 80): string => {
  if (!url) return '';
  
  // Check if it's a Supabase Storage URL
  if (url.includes('.supabase.co/storage/v1/object/public')) {
    const hasParams = url.includes('?');
    const separator = hasParams ? '&' : '?';
    
    const params = [];
    if (width) params.push(`width=${width}`);
    if (height) params.push(`height=${height}`);
    params.push(`quality=${quality}`);
    params.push('resize=cover'); // Ensure it covers the dimensions if both provided
    
    return `${url}${separator}${params.join('&')}`;
  }
  
  return url;
};

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  imageClassName,
  fallbackSrc = 'https://placehold.co/600x400?text=No+Image', 
  width,
  height,
  quality,
  priority = false,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(() => getOptimizedUrl(src, width, height, quality));

  useEffect(() => {
    setImgSrc(getOptimizedUrl(src, width, height, quality));
    setIsLoading(true);
    setError(false);
  }, [src, width, height, quality]);

  const handleError = () => {
    setError(true);
    setIsLoading(false);
    if (imgSrc !== fallbackSrc) {
        setImgSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={cn("relative overflow-hidden bg-slate-200 dark:bg-slate-800", className)}>
      {/* Blur Placeholder (CSS-based pulse effect while loading) */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-slate-700 animate-pulse z-10">
            {/* Optional: Icon or Logo here */}
        </div>
      )}

      <img
        src={imgSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "w-full h-full object-cover transition-all duration-700 ease-in-out",
          isLoading ? "scale-110 blur-lg opacity-0" : "scale-100 blur-0 opacity-100",
          imageClassName
        )}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
