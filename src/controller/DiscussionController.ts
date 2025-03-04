import { Discussion, Comment } from "@prisma/client";
import { getPrisma } from "@/db";
import { Position } from "@/utils/types";
import { commentController } from "@/controller";

const prisma = getPrisma()

interface DiscussionController {
    create: (position: Position) => Promise<Discussion>;
    getAll: () => Promise<Discussion[]>;
    getOne: (discussionId: number) => Promise<Discussion | null>;
}

const create = async ({ posX, posY }: Position): Promise<Discussion> => {
    return prisma.discussion.create({ data: {
        posX,
        posY,
    } })
}

const getAll = async (): Promise<Discussion[]> => prisma.discussion.findMany({ include: { comments: true } })
const getOne = async (discussionId: number) => prisma.discussion.findFirst({ where: { id: discussionId } })

const discussionController : DiscussionController = {
    create,
    getAll,
    getOne
}

export { discussionController }

