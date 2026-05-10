import multer from "multer";

// Use memory storage to keep files in memory
const storage = multer.memoryStorage();

export const cloudinary_upload = multer({ storage });
