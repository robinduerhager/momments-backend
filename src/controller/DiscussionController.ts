import { Discussion } from "@prisma/client";
import { getPrisma } from "@/db";
import { Position } from "@/utils/types";

const prisma = getPrisma()

interface DiscussionController {
    create: (position: Position) => Promise<Discussion>;
    // getOne: () => Promise<Discussion>;
    getAll: () => Promise<Discussion[]>;
}

const createDiscussion = async ({ posX, posY }: Position): Promise<Discussion> => {
    return prisma.discussion.create({ data: {
        posX,
        posY,
    } })
}

const getAllDiscussions = async (): Promise<Discussion[]> => {
    return prisma.discussion.findMany()
}

const discussionController : DiscussionController = {
    create: createDiscussion,
    getAll: getAllDiscussions
}

export { discussionController }

