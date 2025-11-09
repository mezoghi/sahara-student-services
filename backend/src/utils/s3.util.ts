import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl as getS3SignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export const getSignedUrl = async (key: string): Promise<string> => {
  try {
    // In development without S3, return local URL
    if (process.env.NODE_ENV === 'development' && !process.env.AWS_ACCESS_KEY_ID) {
      return `/uploads/${key}`;
    }

    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME || 'sahara-student-files',
      Key: key,
    });

    const url = await getS3SignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return '';
  }
};
