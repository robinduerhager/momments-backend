import { Discussion, Comment } from "@prisma/client";
import { getPrisma } from "@/db";
import { Position } from "@/utils/types";

const prisma = getPrisma()

interface DiscussionController {
    create: (position: Position) => Promise<Discussion>;
    getAll: () => Promise<Discussion[]>;
    getOne: (discussionId: number, userId: number) => Promise<Discussion | null>;
}

const create = async ({ posX, posY }: Position): Promise<Discussion> => {
    return prisma.discussion.create({
        data: {
            posX,
            posY,
        }
    })
}

// Get all Discussions without any Comments or Modules
const getAll = async (): Promise<Discussion[]> => prisma.discussion.findMany()

// Get one specific Discussion with all its Comments and modules
// But only include all published comments and the users draft comment, if one exists
const getOne = async (discussionId: number, userId: number) => {
    return prisma.discussion.findFirst({
        where: {
            id: discussionId
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
                            text: true
                        }
                    }
                }
            }
        }
    }
    )
}

const discussionController: DiscussionController = {
    create,
    getAll,
    getOne
}

export { discussionController }

