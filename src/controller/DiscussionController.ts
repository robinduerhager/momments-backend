import { Discussion } from "@prisma/client";
import { getPrisma } from "@/db";
import { Position } from "@/utils/types";

const prisma = getPrisma()

/**
 * 
 * @description Creates a new discussion at the specified position on the canvas and adds the user to its readBy array.
 * @param position The position of the discussion on the canvas, containing posX and posY coordinates
 * @param userId The user ID of the user creating the discussion
 * @returns A Promise that resolves to the created discussion object without any comments.
 */
const create = async ({ posX, posY }: Position, userId: number): Promise<Omit<Discussion, 'commentIds'>> => {
    return prisma.discussion.create({
        data: {
            posX,
            posY,
            readBy: [userId]
        },
        omit: {
            commentIds: true
        }
    })
}

/**
 * @description Fetches all discussions from the database without their associated comments. If comments are needed, use the `getOne` method instead.
 * @returns A Promise that resolves to an array of discussions without their comments.
 */
const getAll = async (): Promise<Omit <Discussion, 'commentIds'>[]> => prisma.discussion.findMany({
    omit: {
        commentIds: true
    }
})

// Get one specific Discussion with all its Comments and modules
// But only include all published comments and the users draft comment, if one exists
/**
 * @description Fetches a single discussion by its ID, updates the readBy array to include the provided `userId`, and returns the discussion with all of its comments and modules.
 * @param discussionId ID of the discussion to fetch from the database.
 * @param userId ID of the user who is reading the discussion. This ID will be added to the readBy array of the fetched discussion.
 * @returns A Promise that resolves to the discussion object with its comments, commentModules, excluding the readBy array. The discussion list will be sorted in ascending order by the published date of the comments with unpublished drafts appearing last.
 */
const getOne = async (discussionId: number, userId: number) => {
    // First add the userId to the readBy array of the fetched discussion
    const updatedDiscussion = await prisma.discussion.update({
        where: {
            id: discussionId
        },
        data: {
            readBy: {
                push: userId
            }
        }
    })

    if (!updatedDiscussion)
        throw new Error("Discussion not found")

    // We don't need the readBy array, since we only care about the comments and modules of this discussion
    // We are fetching the 'active' discussion, that gets displayed in the popover
    return prisma.discussion.findFirst({
        where: {
            id: discussionId
        },
        omit: {
            readBy: true
        },
        include: {
            comments: {
                where: {
                    OR: [
                        { published: true },
                        { published: false, authorId: userId }
                    ]
                },
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
                            },
                            composition: {
                                include: {
                                    audioTracks: {
                                        include: {
                                            audioFile: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                orderBy: [
                    { published: 'desc' },  // Sort comments, so that the unpublished draft is last in the list
                    { publishedAt: 'asc' }  // Also Sort by publishedAt Date, so the newest published comment is last in the list of the published comments
                ]
            }
        }
    }
    )
}

/**
 * 
 * @description Purges the readBy array of a discussion by setting it to an empty array or to a new array containing only the provided userId.
 * @param discussionId ID of the discussion to purge the readBy array for
 * @param userId The user ID which should be kept in the readBy array. If not provided, the readBy array will be set to an empty array.
 * @returns A Promise that resolves to the modified discussion indicating whether the readBy array was successfully purged or not.
 */
const purgeReadBy = async (discussionId: number, userId?: number) => {
    const newReadBy = userId ? [userId] : []
    const isPurged =  await prisma.discussion.update({
        where: {
            id: discussionId
        },
        data: {
            readBy: {
                set: newReadBy
            }
        }
    })

    if (isPurged)
        return true
    else
        return false
}

export default {
    create,
    getAll,
    getOne,
    purgeReadBy
}

