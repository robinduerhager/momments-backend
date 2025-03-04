import { Comment } from "@prisma/client";
import { getPrisma } from "@/db";

const prisma = getPrisma()

type CreateCommentArgs = {
    authorId: number
    discussionId: number
}

interface CommentController {
    create: (input: CreateCommentArgs) => Promise<Comment>;
    getAll: (discussionId: number) => Promise<Comment[]>;
    getOne: (commentId: number) => Promise<Comment | null>;
}

// Create an empty Comment as a Draft
const create = async ({ authorId, discussionId }: CreateCommentArgs): Promise<Comment> => {
    return prisma.comment.create({ data: {
        authorId,
        discussionId,
        published: false
    }, include: { modules: true, author: true } })
}

// Get all Comments for a discussion
const getAll = async (discussionId: number): Promise<Comment[]> => prisma.comment.findMany({ where: { discussionId }, include: { modules: { include: { text: true } }, author: true }, orderBy: { published: 'asc' } })

// Get one Comment for a discussion
const getOne = async (commentId: number): Promise<Comment | null> => prisma.comment.findFirst({
    where: {
        AND: [
            { id: commentId },
        ]
    },
    include: {
        modules: true,
        author: true
    }
})

const commentController : CommentController = {
    create,
    getAll,
    getOne
}

export { commentController }

