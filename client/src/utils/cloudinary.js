// src/utils/cloudinary.js

/**
 * Lấy public_id từ URL Cloudinary
 * Ví dụ: https://res.cloudinary.com/demo/image/upload/v1234567890/myfolder/myimage.jpg
 * → return: myfolder/myimage
 */
export const getCloudinaryPublicId = (url) => {
  try {
    const parts = url.split('/');
    const filename = parts.pop().split('.')[0];
    const folder = parts.slice(parts.indexOf('upload') + 1).join('/');
    return `${folder}/${filename}`;
  } catch {
    return null;
  }
};
