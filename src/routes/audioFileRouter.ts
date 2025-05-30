import express from 'express'
import { audioFileController } from '@/controller'
import { presignedGetFileUrl } from '@/db'
export const AudioFileRouter = express.Router()

/**
 * @description Route for requesting a presigned URL to upload an audio file to S3.
 * @returns A Promise that resolves to a presigned URL for uploading an audio file in ogg format with opus codec.
 */
AudioFileRouter.get('/uploadrequest', async (req, res) => {
    res.send(await audioFileController.getUploadUrl())
})

/**
 * @description Route for creating a new AudioFile entry in the database.
 * @param fileName The file name of the audio which was uploaded to S3.
 * @returns A Promise that resolves to a newly created AudioFile object with the fileName as a presigned Get-URL for getting the file from S3.
 * @throws 400 if the file name was not provided.
 */
AudioFileRouter.post('/', async (req, res) => {
    const { fileName } = req.body

    if (!fileName)
        return res.status(400).send({ error: "File Name must be provided" })

    const audioFile = await audioFileController.create(fileName)
    // Transform the fileName to a presigned Get-URL for the Frontend to easily retrieve the file from S3
    audioFile.fileName = await presignedGetFileUrl(audioFile.fileName)
    return res.send(audioFile)
})