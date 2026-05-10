import { v2 as cloudinary } from "cloudinary";
import { fileURLToPath } from "url";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import cloudinaryConfig from "./config.mjs";
import { PassThrough } from "stream"; // Correct import for stream

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.config(cloudinaryConfig);

// Define the file size limit (10MB)
const MAX_CHUNK_SIZE = 10 * 1024 * 1024; // 10MB

// Function to split the file buffer into chunks
const splitFileIntoChunks = (fileBuffer) => {
    const fileSize = fileBuffer.length;
    const chunks = [];

    let start = 0;
    while (start < fileSize) {
        const end = Math.min(start + MAX_CHUNK_SIZE, fileSize);
        chunks.push(fileBuffer.slice(start, end)); // Slice buffer into chunks
        start = end;
    }

    return chunks; // Return array of chunks
};

// Function to upload a chunk to Cloudinary
const uploadChunk = (chunk, index) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            resource_type: 'raw',
            public_id: `${uuidv4()}_${index}`,
            format: "pdf"
        }, (error, result) => {
            if (error) {
                console.error(`Error uploading chunk ${index}:`, error);
                reject(error);
            } else {
                resolve(result.secure_url); // Resolve with the secure URL
            }
        });

        // Create a PassThrough stream for the chunk and pipe it to Cloudinary
        const bufferStream = new PassThrough();
        bufferStream.end(chunk); // End the stream with the chunk
        bufferStream.pipe(uploadStream); // Pipe the buffer stream to Cloudinary
    });
};

export default async (req, res) => {
    try {
        // Split the incoming file buffer into chunks
        const chunks = splitFileIntoChunks(req.file.buffer);
        const uploadPromises = chunks.map((chunk, index) => uploadChunk(chunk, index));

        const uploadResults = await Promise.all(uploadPromises);

        res.status(200).json({ status: true, message: uploadResults });
    } catch (error) {
        console.error('Server error: PDF upload failed:', error);
        res.status(500).json({ status: false, message: "Error uploading PDF" });
    }
};
