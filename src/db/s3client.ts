import crypto from 'crypto'
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// expires in 2 days (60 seconds * 60 minutes * 24 hours * 2 days)
const expiryTime = 60 * 60 * 24 * 2

const {
    AWS_S3_BUCKET_NAME,
    AWS_S3_BUCKET_REGION,
    AWS_S3_ACCESS_KEY,
    AWS_S3_SECRET_KEY
} = process.env

if (!AWS_S3_BUCKET_NAME || !AWS_S3_BUCKET_REGION || !AWS_S3_ACCESS_KEY || !AWS_S3_SECRET_KEY)
    throw new Error("Missing AWS S3 environment variables")

const s3 = new S3Client({
    credentials: {
        accessKeyId: AWS_S3_ACCESS_KEY,
        secretAccessKey: AWS_S3_SECRET_KEY
    },
    region: AWS_S3_BUCKET_REGION
})

const generateRandomFileName = (): string => {
    return crypto.randomBytes(32).toString('hex')
}

export const presignedGetFileUrl = async (fileName: string) => {
    const command = new GetObjectCommand({
        Bucket: AWS_S3_BUCKET_NAME,
        Key: fileName,
    })

    return getSignedUrl(s3, command, { expiresIn: expiryTime })
}

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