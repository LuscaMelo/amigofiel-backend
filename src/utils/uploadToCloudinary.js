import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (buffer, folder = "amigo-fiel") => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );

        stream.end(buffer);
    });
};
