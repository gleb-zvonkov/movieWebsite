/**
 * Configures an S3 client using the AWS SDK for accessing a Spaces endpoint.
 * Environment variables are loaded via `dotenv` for the endpoint, region, and credentials.
 */
import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const s3Client = new S3Client({
  endpoint: process.env.SPACES_ENDPOINT,
  region: process.env.SPACES_REGION,
  credentials: {
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
  },
});

export default s3Client;
