import { Comment, CommentModule, $Enums } from "@prisma/client";
import { getPrisma } from "@/db";

const prisma = getPrisma()

type CreateCommentModuleArgs = {
    commentId: number
    type: $Enums.ModuleType
    content: string
}

interface CommentModuleController {
    create: (input: CreateCommentModuleArgs) => Promise<any>;
    // getAll: (discussionId: number) => Promise<Comment[]>;
    // getOne: (commentId: number) => Promise<Comment | null>;
}

// Create an empty Comment as a Draft
const create = async ({ commentId, type, content }: CreateCommentModuleArgs): Promise<any> => {
    return prisma.commentModule.create({ data: {
        commentId,
        type,
        text: {
            create: {   // Create the actual Module according to its incoming type
                content
            }
        },
    }, include: { comment: true, text: true } })
}

// Get all Comments for a discussion
// const getAll = async (discussionId: number): Promise<Comment[]> => prisma.comment.findMany({ where: { discussionId }, include: { modules: true, author: true } })

// Get one Comment for a discussion
// const getOne = async (commentId: number): Promise<Comment | null> => prisma.comment.findFirst({
//     where: {
//         AND: [
//             { id: commentId },
//         ]
//     },
//     include: {
//         modules: true,
//         author: true
//     }
// })

const commentModuleController : CommentModuleController = {
    create,
    // getAll,
    // getOne
}

export { commentModuleController }

