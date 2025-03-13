import { $Enums } from '@prisma/client'
import express, { Request } from 'express'
import { discussionController, commentController, commentModuleController } from '@/controller'
import { presignedGetFileUrl } from '@/db'
export const DiscussionsRouter = express.Router()

// Create new, empty Discussion
DiscussionsRouter.post('/', async (req: Request, res) => {
    const { posX, posY } = req.body
    const userId = req.userId

    if (!posX || !posY)
        return res.status(400).send({ error: "Position for the new Discussion must be provided" })

    if (!userId)
        return res.status(500).send({ error: "Something went wrong" })

    return res.send(await discussionController.create({ posX, posY }, userId))
})

// Get all Discussions (without modules and comments)
// just for displaying discussions in the workspace
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

// Get one (the active) Discussion (with all comments and modules)
DiscussionsRouter.get('/:discussionId', async (req: Request, res) => {
    const discussionId = parseInt(req.params.discussionId)
    const userId = req.userId

    if (!discussionId)
        return res.status(400).send({ error: "Discussion ID and User ID must be provided" })

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