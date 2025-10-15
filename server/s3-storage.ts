
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  endpoint: process.env.SUPABASE_S3_ENDPOINT || "https://jfogxuuzmwszypypkfcv.storage.supabase.co",
  region: "us-east-1", // Supabase uses us-east-1 by default
  credentials: {
    accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY || "5fe1c6c3d43895d9a2626fc4cade7624",
    secretAccessKey: process.env.SUPABASE_S3_SECRET_KEY || "7021fc438ffd299f08f2539966bc0c3e6b79330d3404212c7ec5044d3f577054",
  },
  forcePathStyle: true,
});

const BUCKET_NAME = process.env.SUPABASE_S3_BUCKET || "uploads";

export class S3Storage {
  /**
   * Upload a file to S3
   */
  async uploadFile(key: string, buffer: Buffer, contentType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(command);
    return `https://jfogxuuzmwszypypkfcv.storage.supabase.co/storage/v1/object/public/${BUCKET_NAME}/${key}`;
  }

  /**
   * Get a signed URL for private files
   */
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  }

  /**
   * Delete a file from S3
   */
  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  }

  /**
   * List all files in a folder
   */
  async listFiles(prefix: string = ""): Promise<string[]> {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix,
    });

    const response = await s3Client.send(command);
    return response.Contents?.map(item => item.Key || "") || [];
  }
}

export const s3Storage = new S3Storage();
