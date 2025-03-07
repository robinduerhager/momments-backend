import express, { Request } from 'express'
import { commentModuleController } from '@/controller'
export const CommentModulesRouter = express.Router()

// Create a module for a comment
CommentModulesRouter.post('/', async (req: Request, res) => {
    const { type, content, commentId } = req.body

    // TODO: This might break with Audio modules
    if (!commentId || !type || !content)
        return res.status(400).send({ error: "Discussion ID, Comment ID, Type and Content must be provided" })

    return res.send(await commentModuleController.create({
        commentId,
        type,
        content
    }))
})

CommentModulesRouter.delete('/', async (req: Request, res) => {
    const { commentModuleId } = req.body

    if (!commentModuleId)
        return res.status(400).send({ error: "Comment Module ID must be provided for deletion" })

    res.send(await commentModuleController.delete(commentModuleId))
})