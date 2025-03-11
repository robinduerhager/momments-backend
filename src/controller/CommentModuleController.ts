import { Comment, CommentModule, $Enums } from "@prisma/client";
import { getPrisma } from "@/db";

const prisma = getPrisma()

type CreateCommentModuleArgs = {
    commentId: number
    type: $Enums.ModuleType
    content: string
}

// interface CommentModuleController {
// create: (input: CreateCommentModuleArgs) => Promise<any>;
// delete: (commentModuleId: number) => Promise<any>;
// getAll: (discussionId: number) => Promise<Comment[]>;
// getOne: (commentId: number) => Promise<Comment | null>;
// }

// Create an empty Comment as a Draft
const create = async ({ commentId, type, content }: CreateCommentModuleArgs): Promise<any> => {
    if (type === $Enums.ModuleType.TEXT) {
        return storeTextModule(commentId, content)
    } else if (type === $Enums.ModuleType.REFSONG) {
        return storeRefSongModule(commentId, content)
    } else if (type === $Enums.ModuleType.AUDIOMESSAGE) {
        return storeAudioMessageModule(commentId, content)
    } else {
        throw new Error("Invalid Module Type")
    }
}

// delete is a reserved keyword
const deleteModule = async (commentModuleId: number) => {
    // just return the id of the deleted module, so we can display a removal of the module in the frontend as well
    return prisma.commentModule.delete({ where: { id: commentModuleId }, select: { id: true } })
}

const storeTextModule = (commentId: number, content: string) => {
    return prisma.commentModule.create({
        data: {
            commentId,
            type: $Enums.ModuleType.TEXT,
            text: {
                create: {   // Create the actual Module according to its incoming type
                    content
                }
            },
        }, include: { comment: true, text: true }
    })
}

const storeRefSongModule = (commentId: number, content: string) => {
    return prisma.commentModule.create({
        data: {
            commentId,
            type: $Enums.ModuleType.REFSONG,
            refsong: {
                create: {   // Create the actual Module according to its incoming type
                    content
                }
            },
        }, include: { comment: true, refsong: true }
    })
}

const storeAudioMessageModule = (commentId: number, audioFileName: string) => {
    return prisma.commentModule.create({
        data: {
            commentId,
            type: $Enums.ModuleType.AUDIOMESSAGE,
            audio: {
                create: {
                    audioFile: {
                        create: {
                            fileName: audioFileName
                        }
                    }
                }
            },
        }, include: { comment: true, audio: { include: { audioFile: { select: { fileName: true } } } } }
    })
}

export default {
    create,
    delete: deleteModule
    // getAll,
    // getOne
}

