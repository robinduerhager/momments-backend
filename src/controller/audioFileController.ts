import { presignedPutFileUrl } from '@/db'
import { Comment } from "@prisma/client";
import { getPrisma } from "@/db";

const prisma = getPrisma()

const getUploadUrl = async () => {
    return presignedPutFileUrl('audio/ogg; codecs=opus') // We only use audio files in ogg and opus codec format
}

export default {
    getUploadUrl
}