import { presignedPutFileUrl } from '@/db'
import { getPrisma } from "@/db";

const prisma = getPrisma()

/**
 * @description Generates a presigned URL for uploading an audio file in ogg format with opus codec.
 * @returns A Promise that resolves to a presigned URL for uploading an audio file in ogg format with opus codec.
 */
const getUploadUrl = async () => {
    return presignedPutFileUrl('audio/ogg; codecs=opus') // We only use audio files in ogg and opus codec format
}

/**
 * @description Creates a new audio file entry in the database with the provided file name.
 * @param fileName The name of the audio file to be stored in the database, which should be the 64-character random string that was generated during the S3 upload.
 * @returns A Promise that resolves to the created audio file object in the database.
 */
const create = async (fileName: string) => {
    return prisma.audioFile.create({
        data: {
            fileName
        }
    })
}

export default {
    getUploadUrl,
    create
}