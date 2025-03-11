import express from 'express'
import { audioFileController } from '@/controller'
export const AudioFileRouter = express.Router()

AudioFileRouter.get('/uploadrequest', async (req, res) => {
    res.send(await audioFileController.getUploadUrl())
})