import streamifier from "streamifier";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary Config
(async function () {
  cloudinary.config({
    cloud_name: "dy0m9udjz",
    api_key: "655763378773479",
    api_secret: "7CheewENHiovwVJtdW4ZJLBNoW8",
  });
})();
// End Cloudinary

let streamUpload = (buffer: string) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const uploadToCloudinary = async (buffer: string): Promise<string> => {
  let result = await streamUpload(buffer);
  return result["url"];
};
