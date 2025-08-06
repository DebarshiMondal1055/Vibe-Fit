// src/utils/uploadInCloudinary.js
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload file buffer to Cloudinary using stream
const uploadInCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder: "uploads" }, // optional folder
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// Optional: delete from Cloudinary by asset URL
const deleteInCloudinary = async (assetUrl, resourceType = "image") => {
  try {
    const urlParts = assetUrl.split("/");
    const fileNameWithExt = urlParts[urlParts.length - 1].split(".");
    const publicId = fileNameWithExt[0];

    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });

    return response;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return null;
  }
};


export {uploadInCloudinary,deleteInCloudinary}