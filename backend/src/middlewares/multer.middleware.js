// src/middlewares/multer.js
import multer from "multer";

// Use memory storage so file stays in memory, not saved on disk
const storage = multer.memoryStorage();

const upload = multer({ storage });

export { upload };
