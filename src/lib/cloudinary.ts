import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary securely (Server-side only)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

/**
 * Uploads a Buffer securely to Cloudinary.
 * @param fileBuffer The Buffer representation of a file.
 * @param folder The target folder within Cloudinary.
 * @returns A Promise that resolves to the secure URL of the uploaded image.
 */
export const uploadImageToCloudinary = (
    fileBuffer: Buffer,
    folder: string = "web_portfolio"
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "auto",
            },
            (error, result) => {
                if (error) {
                    console.error("[CLOUDINARY_UPLOAD_ERROR]", error);
                    return reject(error);
                }
                if (result && result.secure_url) {
                    return resolve(result.secure_url);
                }
                reject(new Error("Unknown error during upload"));
            }
        );

        uploadStream.end(fileBuffer);
    });
};

/**
 * Uploads an array of File objects.
 * @param files The array of File objects extracted from FormData.
 * @returns A Promise that resolves to an array of secure URLs.
 */
export const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return uploadImageToCloudinary(buffer);
    });

    return Promise.all(uploadPromises);
};
