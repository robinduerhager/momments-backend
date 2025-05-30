import crypto from 'crypto'
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// URLs expire in 2 days (60 seconds * 60 minutes * 24 hours * 2 days)
const expiryTime = 60 * 60 * 24 * 2

const {
    AWS_S3_BUCKET_NAME,
    AWS_S3_BUCKET_REGION,
    AWS_S3_ACCESS_KEY,
    AWS_S3_SECRET_KEY
} = process.env

if (!AWS_S3_BUCKET_NAME || !AWS_S3_BUCKET_REGION || !AWS_S3_ACCESS_KEY || !AWS_S3_SECRET_KEY)
    throw new Error("Missing AWS S3 environment variables")

// Create an S3 client instance with the provided credentials
const s3 = new S3Client({
    credentials: {
        accessKeyId: AWS_S3_ACCESS_KEY,
        secretAccessKey: AWS_S3_SECRET_KEY
    },
    region: AWS_S3_BUCKET_REGION
})

/**
 * @description Generates a random file name using crypto module. The file name is a 64-character hexadecimal string. This is used to ensure unique file names for uploads.
 * @returns A string representing a randomly generated 64-character file name.
 */
const generateRandomFileName = (): string => {
    return crypto.randomBytes(32).toString('hex')
}

/**
 * 
 * @description This function generates a presigned URL for getting a file from S3. The expiry time for the URL is set to 2 days.
 * @param fileName - The name of the file to be retrieved from S3.
 * @returns A promise that resolves to a presigned URL for the specified file, valid for 2 days.
 */
export const presignedGetFileUrl = async (fileName: string) => {
    const command = new GetObjectCommand({
        Bucket: AWS_S3_BUCKET_NAME,
        Key: fileName,
    })

    return getSignedUrl(s3, command, { expiresIn: expiryTime })
}

/**
 * @description Generates a presigned URL for uploading a file with a randomly generated 64-character file name to a S3 bucket.
 * @param contentType The content type of the file to be uploaded to S3. Can be any valid MIME type, e.g. in this context 'audio/ogg; codecs=opus'.
 * @returns A promise that resolves to an object containing a presigned URL for uploading a file with a randomly generated file name.
 */
export const presignedPutFileUrl = async (contentType: string) => {
    const randomFileName = generateRandomFileName()
    const command = new PutObjectCommand({
        Bucket: AWS_S3_BUCKET_NAME,
        Key: randomFileName,
        ContentType: contentType
    })

    return {
        url: await getSignedUrl(s3, command, { expiresIn: expiryTime }),
        fileName: randomFileName
    }
}