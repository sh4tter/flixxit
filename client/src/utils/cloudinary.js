// Cloudinary configuration and utilities
// Note: You'll need to add your Cloudinary credentials to environment variables

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name';
const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY || 'your-api-key';

// Cloudinary URL builder
export const buildCloudinaryUrl = (publicId, options = {}) => {
  const defaultOptions = {
    quality: 'auto',
    fetch_format: 'auto',
    ...options
  };
  
  const transformations = Object.entries(defaultOptions)
    .map(([key, value]) => `${key}_${value}`)
    .join(',');
  
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
};

// Video URL builder
export const buildCloudinaryVideoUrl = (publicId, options = {}) => {
  const defaultOptions = {
    quality: 'auto',
    fetch_format: 'auto',
    ...options
  };
  
  const transformations = Object.entries(defaultOptions)
    .map(([key, value]) => `${key}_${value}`)
    .join(',');
  
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/${transformations}/${publicId}`;
};

// Canvas-based placeholder image generator
export const createPlaceholderImage = (width = 300, height = 200, text = 'Movie') => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#2c2c2c';
  ctx.fillRect(0, 0, width, height);
  
  // Text
  ctx.fillStyle = '#ffffff';
  ctx.font = `${Math.max(12, height / 10)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const words = text.split(' ');
  const y = height / 2;
  
  if (words.length <= 2) {
    ctx.fillText(text, width / 2, y);
  } else {
    // Split long titles into multiple lines
    const line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
    const line2 = words.slice(Math.ceil(words.length / 2)).join(' ');
    ctx.fillText(line1, width / 2, y - height / 20);
    ctx.fillText(line2, width / 2, y + height / 20);
  }
  
  return canvas.toDataURL();
};

// Movie poster placeholder
export const getMoviePosterPlaceholder = (title = 'Movie') => {
  return createPlaceholderImage(225, 120, title);
};

// Featured image placeholder
export const getFeaturedImagePlaceholder = (title = 'Featured') => {
  return createPlaceholderImage(1920, 1080, title);
};

// Thumbnail placeholder
export const getThumbnailPlaceholder = (title = 'Thumbnail') => {
  return createPlaceholderImage(150, 100, title);
};

// Check if URL is from Cloudinary
export const isCloudinaryUrl = (url) => {
  return url && url.includes('cloudinary.com');
};

// Transform Cloudinary URL with specific dimensions
export const transformCloudinaryUrl = (url, width, height, crop = 'fill') => {
  if (!isCloudinaryUrl(url)) return url;
  
  const baseUrl = url.split('/upload/')[0] + '/upload/';
  const publicId = url.split('/upload/')[1];
  
  return `${baseUrl}c_${crop},w_${width},h_${height}/${publicId}`;
};
