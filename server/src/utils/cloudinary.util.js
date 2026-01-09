import { v2 as cloudinary } from 'cloudinary';
import env from '../constants/env.js'
; // Adjust path to your env file
import { cloudinaryOptions } from '../config/app.config.js';

// Configure Cloudinary with your frozen env variables
cloudinary.config(cloudinaryOptions);

/**
 * Uploads a file buffer (from Multer memoryStorage) to Cloudinary
 * @param {Buffer} fileBuffer 
 * @returns {Promise} - Resolves with { url, public_id }
 */
export const uploadToCloudinary = (fileBuffer,pName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder: `timeglass/products/${pName}`,
        resource_type: 'auto' 
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    // Write the buffer to the stream
    uploadStream.end(fileBuffer);
  });
};

/**
 * Deletes an image from Cloudinary using its public_id
 * @param {string} publicId 
 * @returns {Promise}
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    throw new Error("Failed to delete image from cloud storage");
  }
};
/**
 * Uploads a ticket attachment buffer to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer from Multer
 * @param {string} ticketId - The ID of the ticket for folder organization
 * @returns {Promise} - Resolves with { url, public_id }
 */
export const uploadTicketData = (fileBuffer, ticketId) => {
  return new Promise((resolve, reject) => {
    // Safety check for empty buffers
    if (!fileBuffer) {
      return reject(new Error("No file buffer provided"));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        // Logic: Store in a specific tickets folder, then a subfolder for the ID
        folder: `timeglass/tickets/${ticketId}`, 
        resource_type: 'auto' 
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Ticket Upload Error:", error);
          return reject(error);
        }
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    // Stream the buffer to Cloudinary
    uploadStream.end(fileBuffer);
  });
};