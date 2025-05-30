import express, { Request } from 'express'
import { commentController, discussionController } from '@/controller'
export const CommentsRouter = express.Router()

// This Method is not used by the frontend right now, but i'll leave it here for future use
/**
 * @description Route getting one Comment with all its modules.
 * @param commentId The ID of the Comment to retrieve.
 * @returns A Promise that resolves to the created Discussion object without any comments.
 * @throws 400 if there was no commentId provided.
 */
CommentsRouter.get('/:commentId', async (req, res) => {
    const commentId = parseInt(req.params.commentId)

    if (!commentId)
        return res.status(400).send({ error: "Comment ID must be provided" })

    return res.send(await commentController.getOne(commentId))
})

/**
 * @description Route for updating a Comment. Right now this can only be used to publish a Comment. This also sets the readBy array of the Discussion to the userId of the publishing user, so that the discussion will be "unread" by other users.
 * @param commentId The ID of the Comment to retrieve.
 * @returns A Promise that resolves to the published comment including all its modules.
 * @throws 400 if there was no commentId or published status provided, 500 if there was no userId attached to the request object via the authorization middleware.
 */
CommentsRouter.patch('/:commentId', async (req: Request, res) => {
    const userId = req.userId
    const commentId = parseInt(req.params.commentId)
    const { published } = req.body

    if (!commentId || !published)
        return res.status(400).send({ error: "Comment ID and Published status must be provided" })

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

/**
 * @description Route for initializing a new Comment Draft.
 * @param discussionId The ID of the Discussion on which the new Draft should be connected.
 * @returns A Promise that resolves to the new Comment Draft object.
 * @throws 400 if there was no discussionId provided, 500 if there was no userId attached to the request object via the authorization middleware.
 */
CommentsRouter.post('/', async (req: Request, res) => {
    const discussionId: number = req.body.discussionId
    const userId = req.userId

    if (!discussionId)
        return res.status(400).send({ error: "Discussion ID must be provided" })

    if (!userId)
        return res.status(500).send({ error: "Something went wrong" })

    // Create a new Comment Draft, if none exists for that discussion and author
    // Else, return the existing draft
    return res.send(await commentController.create({
        authorId: userId,
        discussionId
    }))
})