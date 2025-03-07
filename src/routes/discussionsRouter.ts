import express, { Request } from 'express'
import { discussionController, commentController, commentModuleController } from '@/controller'
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
    const result = discussions.map(discussion => {
        return {
            ...discussion,
            readBy: discussion.readBy.includes(userId)
        }
    })

    return res.send(result)
})

// Get one Discussion
DiscussionsRouter.get('/:discussionId', async (req: Request, res) => {
    const discussionId = parseInt(req.params.discussionId)
    const userId = req.userId

    if (!discussionId)
        return res.status(400).send({ error: "Discussion ID and User ID must be provided" })

    if (!userId)
        return res.status(500).send({ error: "Something went wrong" })
    
    return res.send(await discussionController.getOne(discussionId, userId))
})