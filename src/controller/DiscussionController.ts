import { Discussion, Comment } from "@prisma/client";
import { getPrisma } from "@/db";
import { Position } from "@/utils/types";

const prisma = getPrisma()

// interface DiscussionController {
//     create: (position: Position) => Promise<Discussion>;
//     getAll: () => Promise<Discussion[]>;
//     getOne: (discussionId: number, userId: number) => Promise<Discussion | null>;
// }
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

// Get all Discussions without any Comments or Modules
// We don't need the commentIds here
const getAll = async (): Promise<Omit <Discussion, 'commentIds'>[]> => prisma.discussion.findMany({
    omit: {
        commentIds: true
    }
})

// Get one specific Discussion with all its Comments and modules
// But only include all published comments and the users draft comment, if one exists
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

