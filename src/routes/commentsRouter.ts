import express, { Request } from 'express'
import { commentController, discussionController } from '@/controller'
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
CommentsRouter.patch('/:commentId', async (req: Request, res) => {
    const userId = req.userId
    const commentId = parseInt(req.params.commentId)
    const { published } = req.body

    if (!commentId || !published)
        return res.status(400).send({ error: "Discussion ID, Comment ID and Published status must be provided" })

    if (!userId)
        return res.status(500).send({ error: "Something went wrong" })

    const updatedComment = await commentController.update({
        commentId,
        published,
        publishedAt: new Date()
    })

    const purgedReadBy = await discussionController.purgeReadBy(updatedComment.discussionId, userId)

    if (!purgedReadBy)
        return res.status(500).send({ error: "Something went wrong" })

    return res.send(updatedComment)
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