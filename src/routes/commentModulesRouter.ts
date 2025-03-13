import { $Enums } from '@prisma/client'
import { presignedGetFileUrl } from '@/db'
import express, { Request } from 'express'
import { commentModuleController } from '@/controller'
export const CommentModulesRouter = express.Router()

// Create a module for a comment
// Text and RefSong need: type, commentId, content
// AudioMessage needs: type, commentId, audioFileName
CommentModulesRouter.post('/', async (req: Request, res) => {
    const { type, commentId } = req.body

    if (!commentId || !type)
        return res.status(400).send({ error: "Discussion ID, Comment ID and Type must be provided" })

    // AudioMessage needs a different creation approach
    if (type === $Enums.ModuleType.AUDIOMESSAGE) {
        if (!req.body.audioFileName)
            return res.status(400).send({ error: "Audio File Name must be provided that matches an S3 stored object for creating Audio Message Modules" })

        const audioMessageModule = await commentModuleController.create({
            commentId,
            type,
            content: req.body.audioFileName
        })
    
        if (!audioMessageModule)
            return res.status(500).send({ error: "Something went wrong" })
    
        // instead of returning the simple file name, we return a presigned get URL of the file
        audioMessageModule.audio.audioFile.fileName = await presignedGetFileUrl(audioMessageModule.audio.audioFile.fileName)
        return res.send(audioMessageModule)
    }

    if (type === $Enums.ModuleType.COMPOSITION) {
        if (!req.body.content)
            return res.status(400).send({ error: "Composition content must be provided for creating Composition Modules" })

        const compositionModule = await commentModuleController.create({
            commentId,
            type,
            content: req.body.content
        })

        // return the presigned S3 get URL for each audio file in the composition
        for (const audioTrack of compositionModule.composition.audioTracks) {
            audioTrack.audioFile = await presignedGetFileUrl(audioTrack.audioFile.fileName)
        }

        return res.send(compositionModule)
    }

    return res.send(await commentModuleController.create({
        commentId,
        type,
        content: req.body.content
    }))
})

CommentModulesRouter.delete('/', async (req: Request, res) => {
    const { commentModuleId } = req.body

    if (!commentModuleId)
        return res.status(400).send({ error: "Comment Module ID must be provided for deletion" })

    res.send(await commentModuleController.delete(commentModuleId))
})