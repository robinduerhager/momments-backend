import express, { Request } from 'express'
import { discussionController, commentController, commentModuleController } from '@/controller'
export const DiscussionsRouter = express.Router()

// Create new, empty Discussion
DiscussionsRouter.post('/', async (req, res) => {
    const { posX, posY } = req.body

    if (!posX || !posY)
        return res.status(400).send({ error: "Position for the new Discussion must be provided" })

    return res.send(await discussionController.create({ posX, posY }))
})

// Get all Discussions (without modules and comments)
// just for displaying discussions in the workspace
DiscussionsRouter.get('/', async (_, res) => {
    return res.send(await discussionController.getAll())
})

DiscussionsRouter.get('/:discussionId', async (req: Request, res) => {
    const discussionId = parseInt(req.params.discussionId)
    const userId = req.userId

    if (!discussionId || !userId)
        return res.status(400).send({ error: "Discussion ID and User ID must be provided" })
    
    return res.send(await discussionController.getOne(discussionId, userId))
})