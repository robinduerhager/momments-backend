import { $Enums } from '@prisma/client'
import express, { Request } from 'express'
import { discussionController } from '@/controller'
import { presignedGetFileUrl } from '@/db'
export const DiscussionsRouter = express.Router()

/**
 * @description Route creating new, empty Discussion
 * @param posX - X position of the new Discussion in the workspace
 * @param posY - Y position of the new Discussion in the workspace
 * @returns A Promise that resolves to the created Discussion object without any comments.
 * @throws 400 if arguments are not provided, 500 if userId was not set in the request object via authorization middleware.
 */
DiscussionsRouter.post('/', async (req: Request, res) => {
    const { posX, posY } = req.body
    const userId = req.userId

    if (!posX || !posY)
        return res.status(400).send({ error: "Position for the new Discussion must be provided" })

    if (!userId)
        return res.status(500).send({ error: "Something went wrong" })

    return res.send(await discussionController.create({ posX, posY }, userId))
})

/**
 * @description Route getting all Discussions without modules and comments (e.g. for displaying them in the workspace)
 * @returns A Promise that resolves to the created Discussion object without any comments.
 * @throws 500 if userId was not set in the request object via authorization middleware.
 */
DiscussionsRouter.get('/', async (req: Request, res) => {
    const userId = req.userId

    if (!userId)
        return res.status(500).send({ error: "Something went wrong" })

    const discussions = await discussionController.getAll()

    // Convert readBy from an array of ids to a boolean value
    // IF the userId is included in the readBy array, set readBy to true
    const result = discussions.map(discussion => {
        return {
            ...discussion,
            readBy: discussion.readBy.includes(userId)
        }
    })

    return res.send(result)
})

/**
 * @description Route for getting one Discussion with all its comments and modules.
 * @param discussionId - The ID of the Discussion to retrieve.
 * @returns A Promise that resolves to the specified Discussion object without all comments and modules.
 * @throws 400 if discussionId was not provided, 500 if userId was not set in the request object via authorization middleware.
 */
DiscussionsRouter.get('/:discussionId', async (req: Request, res) => {
    const discussionId = parseInt(req.params.discussionId)
    const userId = req.userId

    if (!discussionId)
        return res.status(400).send({ error: "Discussion ID must be provided" })

    if (!userId)
        return res.status(500).send({ error: "Something went wrong" })

    const activeDiscussion = await discussionController.getOne(discussionId, userId)

    // Transform the audioFileName to a presigned get URL for the frontend
    if (activeDiscussion) {
        for (const comment of activeDiscussion.comments) {
            for (const module of comment.modules) {
                if (module.type === $Enums.ModuleType.AUDIOMESSAGE) {
                    if (!module.audio?.audioFile)
                        continue

                    // convert audioFileName to a presigned get URL for the frontend, for the Composition module
                    module.audio!.audioFile.fileName = await presignedGetFileUrl(module.audio!.audioFile.fileName)
                } else if (module.type === $Enums.ModuleType.COMPOSITION) {
                    if (!module.composition?.audioTracks)
                        continue

                    if (module.composition.audioTracks.length <= 0)
                        continue

                    for (const audioTrack of module.composition.audioTracks) {
                        if (audioTrack.audioFile)
                            audioTrack.audioFile.fileName = await presignedGetFileUrl(audioTrack.audioFile.fileName)
                    }
                } else {
                    continue
                }
            }
        }
    }

    return res.send(activeDiscussion)
})