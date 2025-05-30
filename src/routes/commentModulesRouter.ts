import { $Enums } from '@prisma/client'
import { presignedGetFileUrl } from '@/db'
import express, { Request } from 'express'
import { commentModuleController } from '@/controller'
export const CommentModulesRouter = express.Router()

/**
 * @description Route for creating a new Comment Module for a comment draft.
 * @param type The type of the module to be created (e.g., TEXT, REFSONG, AUDIOMESSAGE or COMPOSITION).
 * @param commentId The ID of the comment to which the module should be added.
 * @param content The content of the module (e.g. text for Text, RefSong and AudioMessage (S3 fileName) modules, AudioTracks for Composition modules).
 * @returns A Promise that resolves to the newly created Comment Module object with the associated comment.
 * @throws 400 if there was no commentId and the right content for the module provided. 500 if something went wrong during the creation process.
 */
CommentModulesRouter.post('/', async (req: Request, res) => {
    const { type, commentId } = req.body

    if (!commentId || !type)
        return res.status(400).send({ error: "Comment ID and Type must be provided" })

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
            audioTrack.audioFile.fileName = await presignedGetFileUrl(audioTrack.audioFile.fileName)
        }

        return res.send(compositionModule)
    }

    return res.send(await commentModuleController.create({
        commentId,
        type,
        content: req.body.content
    }))
})

/**
 * @description Route for deleting a specific Comment Module by its ID.
 * @param commentModuleId The ID of the Comment Module which should be deleted.
 * @returns A Promise that resolves to the ID of the deleted Module.
 * @throws 400 if commentModuleId was not provided.
 */
CommentModulesRouter.delete('/', async (req: Request, res) => {
    const { commentModuleId } = req.body

    if (!commentModuleId)
        return res.status(400).send({ error: "Comment Module ID must be provided for deletion" })

    res.send(await commentModuleController.delete(commentModuleId))
})