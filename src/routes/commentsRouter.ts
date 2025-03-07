import express, { Request } from 'express'
import { commentController } from '@/controller'
export const CommentsRouter = express.Router()

// Get a Comment of a Discussion with all its modules
CommentsRouter.get('/:commentId', async (req, res) => {
    const commentId = parseInt(req.params.commentId)

    if (!commentId)
        return res.status(400).send({ error: "Discussion ID and Comment ID must be provided" })

    return res.send(await commentController.getOne(commentId))
})

// Update a Comment
// Used for publishing a draft
CommentsRouter.patch('/:commentId', async (req, res) => {
    const commentId = parseInt(req.params.commentId)
    const { published } = req.body

    if (!commentId || !published)
        return res.status(400).send({ error: "Discussion ID, Comment ID and Published status must be provided" })

    return res.send(await commentController.update({
        commentId,
        published,
        publishedAt: new Date()
    }))
})

// Initialize new, empty Comment for a Discussion
CommentsRouter.post('/', async (req: Request, res) => {
    const discussionId: number = req.body.discussionId
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