import React from 'react';

/**
 * AppImage component to render images by category and name.
 * Usage:
 * <AppImage category="svg" name="logo" alt="Logo" width={40} height={40} />
 * <AppImage category="png" name="user" alt="User" />
 * <AppImage src="/custom/path/image.jpg" alt="Custom" />
 */
const AppImage = ({
  category,
  name,
  src,
  alt = '',
  customImageClass = '',
  ...rest
}) => {
  // If src is provided directly, use it
  let imageSrc = src;

  // If category and name are provided, build the path
  if (!imageSrc && category && name) {
    // You can adjust the folder structure as needed
    imageSrc = `/images/${category}/${name}.${category}`;
  }

  // Fallback to a default image if not found
  const handleError = (e) => {
    e.target.onerror = null;
    e.target.src = '/images/default_user_image.jpg';
  };

  return (
    <img
    className={`mr-1 ${customImageClass}`}
      src={imageSrc}
      alt={alt}
      onError={handleError}
      {...rest}
    />
  );
};

export default AppImage;



// <AppImage category="svg" name="logo" alt="Logo" width={40} height={40} />
// <AppImage category="png" name="user" alt="User" />
// <AppImage src="/images/custom/path/photo.jpg" alt="Custom" />