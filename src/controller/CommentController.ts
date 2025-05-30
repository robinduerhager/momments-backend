import { Comment } from "@prisma/client";
import { getPrisma } from "@/db";

const prisma = getPrisma()

type CreateCommentArgs = {
    authorId: number
    discussionId: number
}

/**
 * @description Creates a new draft comment for a discussion. If the author already has a draft comment in the discussion, it returns that existing draft instead of creating a new one.
 * @param authorId The ID of the author creating the draft comment.
 * @param discussionId The ID of the discussion for which the draft comment is being created.
 * @returns A Promise that resolves to the created or existing draft comment, including its modules and author information.
 */
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
                    text: true,
                    refsong: true,
                    audio: {
                        include: {
                            audioFile: true
                        }
                    }
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
                    text: true,
                    refsong: true,
                    audio: {
                        include: {
                            audioFile: true
                        }
                    }
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

/**
 * @description Retrieves a single comment by its ID, including its associated modules and author information.
 * @param commentId The ID of the comment to retrieve.
 * @returns A Promise that resolves to the comment if found, or null if no comment with the given ID exists.
 */
const getOne = async (commentId: number): Promise<Comment | null> => prisma.comment.findFirst({
    where: {
        AND: [
            { id: commentId },
        ]
    },
    include: {
        modules: {
            include: {
                text: true,
                refsong: true,
                audio: {
                    include: {
                        audioFile: true
                    }
                }
            }
        },
        author: {
            omit: {
                secret: true
            }
        }
    }
})

/**
 * @description Updates a comment's published status and publishedAt date. Right now, this is can only be used to publish a draft comment.
 * @param commentId The ID of the comment to publish.
 * @param published The new published status of the comment.
 * @param publishedAt The date when the comment was published.
 * @returns A Promise that resolves to the updated comment, including its modules and author information.
 */
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
                    text: true,
                    refsong: true,
                    audio: {
                        include: {
                            audioFile: true
                        }
                    }
                }
            }
        }
    })
}

export default {
    create: createDraft,
    getOne,
    update
}