import multer from "multer";

import ApiError from "../utils/ApiError";

const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const storage = multer.memoryStorage();

export const uploadResume = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },

  fileFilter(req, file, callback) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(
        new ApiError(400, "Only PDF and DOCX resumes are allowed."),
      );
    }

    callback(null, true);
  },
});
