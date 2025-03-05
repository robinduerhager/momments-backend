import express, { Request } from 'express'
import { discussionController, commentController, commentModuleController } from '@/controller'
export const ApiRouter = express.Router()

// Create new, empty Discussion
ApiRouter.post('/', async (req, res) => {
    const { posX, posY } = req.body

    if (!posX || !posY)
        return res.status(400).send({ error: "Position for the new Discussion must be provided" })

    return res.send(await discussionController.create({ posX, posY }))
})

// Get all Discussions (without modules and comments)
// just for displaying discussions in the workspace
ApiRouter.get('/', async (_, res) => {
    return res.send(await discussionController.getAll())
})

ApiRouter.get('/:discussionId', async (req: Request, res) => {
    const discussionId = parseInt(req.params.discussionId)
    const userId = req.userId

    if (!discussionId || !userId)
        return res.status(400).send({ error: "Discussion ID and User ID must be provided" })
    
    return res.send(await discussionController.getOne(discussionId, userId))
})

// not used in the frontend right now
// Get all Comments for a Discussion with all modules
// ApiRouter.get('/:discussionId/comments', async (req, res) => {
//     const discussionId = parseInt(req.params.discussionId)

//     if (!discussionId)
//         return res.status(400).send({ error: "Discussion ID must be provided" })

//     return res.send(await commentController.getAll(discussionId))
// })

// Get a Comment of a Discussion with all its modules
ApiRouter.get('/:discussionId/comments/:commentId', async (req, res) => {
    const discussionId = parseInt(req.params.discussionId)
    const commentId = parseInt(req.params.discussionId)

    if (!discussionId || !commentId)
        return res.status(400).send({ error: "Discussion ID and Comment ID must be provided" })

    return res.send(await commentController.getOne(commentId))
})

// Initialize new, empty Comment for a Discussion
ApiRouter.post('/:discussionId/comments', async (req: Request, res) => {
    const discussionId = parseInt(req.params.discussionId)
    const authorId = req.userId

    if (!discussionId || !authorId)
        return res.status(400).send({ error: "Discussion ID and Author ID must be provided" })

    // Create a new Comment Draft, if none exists for that discussion and author
    // Else, return the existing draft
    return res.send(await commentController.create({
        authorId,
        discussionId
    }))
})

// Create new Module for a Comment of a Discussion
ApiRouter.post('/:discussionId/comments/:commentId/modules', async (req, res) => {
    const discussionId = parseInt(req.params.discussionId)
    const commentId = parseInt(req.params.commentId)
    const { type, content } = req.body

    if (!discussionId || !commentId || !type || !content)
        return res.status(400).send({ error: "Discussion ID, Comment ID, Type and Text must be provided" })

    return res.send(await commentModuleController.create({
        commentId,
        type,
        content
    }))
})