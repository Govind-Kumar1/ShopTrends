import multer from "multer";

const storage = multer.memoryStorage(); // 👈 Save files in memory buffer only

const upload = multer({ storage });

export default upload;
