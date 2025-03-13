import express from 'express'
import { audioFileController } from '@/controller'
import { presignedGetFileUrl } from '@/db'
export const AudioFileRouter = express.Router()

// Request an upload URL for S3
AudioFileRouter.get('/uploadrequest', async (req, res) => {
    res.send(await audioFileController.getUploadUrl())
})

// Create a new AudioFile in the database and add the fileName from S3 to it
// Important for the composition Editor
// returns { id: number, fileName: S3URL }
AudioFileRouter.post('/', async (req, res) => {
    const { fileName } = req.body

    if (!fileName)
        return res.status(400).send({ error: "File Name must be provided" })

    const audioFile = await audioFileController.create(fileName)
    audioFile.fileName = await presignedGetFileUrl(audioFile.fileName)
    return res.send(audioFile)
})