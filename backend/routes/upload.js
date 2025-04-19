/**
 * POST /api/upload - Handles file uploads to DigitalOcean Spaces.
 *
 * Uses `multer` for memory storage and `@aws-sdk/client-s3` to upload the file to DigitalOcean Spaces.
 * Returns the URL of the uploaded file or a 500 error if the upload fails.
 */

import express from "express";
import multer from "multer";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../lib/s3Client.js";
import dotenv from "dotenv";
dotenv.config();  // Load environment variables from .env file

const router = express.Router();
const upload = multer(); // Initialize multer for in-memory file storage

// POST route for file upload
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const file = req.file; // Access the uploaded file from the request

    if (!file) {
      // If no file is uploaded, return a 400 error
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Generate a unique key for the file based on timestamp and original filename
    const key = `uploads/${Date.now()}-${file.originalname}`;

    // Prepare the S3 upload command with necessary file metadata
    const command = new PutObjectCommand({
      Bucket: process.env.SPACES_BUCKET,  // The S3 bucket name from environment variable
      Key: key,  // The unique file key
      Body: file.buffer,  // File content as a buffer
      ContentType: file.mimetype,  // Mime type of the uploaded file
      ACL: "public-read",  // Makes the file publicly accessible
    });

    // Send the command to upload the file to DigitalOcean Spaces
    await s3Client.send(command);

    // Construct the URL of the uploaded file
    const url = `https://${process.env.SPACES_BUCKET}.${process.env.SPACES_REGION}.digitaloceanspaces.com/${key}`;

    // Respond with the file URL
    res.json({ url });
  } catch (err) {
    // Handle any errors that occur during the upload process
    console.error("Upload failed:", err);
    res.status(500).json({ error: "Failed to upload file" });  // Return a 500 error on failure
  }
});

export const uploadRouter = router;  // Export the router for use in the main app
