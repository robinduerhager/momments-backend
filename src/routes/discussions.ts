import express from 'express'
import { discussionController } from '@/controller'
export const discussionsRouter = express.Router()

// Create new Discussion
discussionsRouter.post('/', async (req, res) => {
    const { posX, posY } = req.body

    if (!posX || !posY)
        return res.status(400).send({ error: "Position for the new Discussion must be provided" })

    return res.send(await discussionController.create({ posX, posY }))
})

// Get all Discussions
// Request not needed here (Authentication handled in middleware)
discussionsRouter.get('/', async (_, res) => {
    return res.send(await discussionController.getAll())
})