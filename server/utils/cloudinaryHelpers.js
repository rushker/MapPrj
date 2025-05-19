//utils/cloudinaryHelpers.js
export const extractPublicId = (url) => {
  try {
    const pathname = new URL(url).pathname;
    const withoutExt = pathname.replace(/\.[^/.]+$/, '');
    return withoutExt.startsWith('/') ? withoutExt.slice(1) : withoutExt;
  } catch (err) {
    console.warn('Failed to extract publicId from URL:', url, err.message);
    return null;
  }
};
