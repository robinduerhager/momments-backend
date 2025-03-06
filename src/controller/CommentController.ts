import { Comment } from "@prisma/client";
import { getPrisma } from "@/db";

const prisma = getPrisma()

type CreateCommentArgs = {
    authorId: number
    discussionId: number
}

// interface CommentController {
//     create: (input: CreateCommentArgs) => Promise<Comment>;
//     getAll: (discussionId: number) => Promise<Comment[]>;
//     getOne: (commentId: number) => Promise<Comment | null>;
// }

// Create an empty Comment as a Draft
const createDraft = async ({ authorId, discussionId }: CreateCommentArgs): Promise<Comment> => {
    // Check if the author already has a draft in this discussion
    const draft = await prisma.comment.findFirst({
        where: {
            AND: [
                { authorId },
                { discussionId },
                { published: false }
            ]
        },
        include: {
            modules: {
                include: {
                    text: true
                }
            },
            author: {
                omit: {
                    secret: true
                }
            }
        }
    })

    // if so, return the existing draft
    if (draft)
        return draft

    // Else create a new draft
    return prisma.comment.create({
        data: {
            authorId,
            discussionId,
            published: false
        },
        include: {
            modules: {
                include: {
                    text: true
                }
            },
            author: {
                omit: {
                    secret: true
                }
            }
        }
    })
}

// Not used in code currently, comments get fetched as well, when a "detailed discussion" is fetched
// Get all Comments for a discussion
// const getAll = async (discussionId: number): Promise<Comment[]> => {
//     return prisma.comment.findMany({
//         where: {
//             discussionId
//         },
//         include: {
//             modules: { include: { text: true } },
//             author: {
//                 omit: {
//                     secret: true
//                 }
//             }
//         },
//         orderBy: [
//             { published: 'asc' }
//         ]
//     })
// }

// Get one Comment for a discussion
const getOne = async (commentId: number): Promise<Comment | null> => prisma.comment.findFirst({
    where: {
        AND: [
            { id: commentId },
        ]
    },
    include: {
        modules: {
            include: {
                text: true
            }
        },
        author: {
            omit: {
                secret: true
            }
        }
    }
})

const update = async ({ commentId, published, publishedAt }: { commentId: number, published: boolean, publishedAt: Date }): Promise<Comment> => {
    return prisma.comment.update({
        where: { id: commentId },
        data: { published, publishedAt },
        include: {
            author: {
                omit: {
                    secret: true
                }
            },
            modules: {
                include: {
                    text: true
                }
            }
        }
    })
}

const commentController = {
    create: createDraft,
    // getAll,
    getOne,
    update
}

export { commentController }

