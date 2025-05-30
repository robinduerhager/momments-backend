import { $Enums } from "@prisma/client";
import { getPrisma } from "@/db";

const prisma = getPrisma()

type CreateCommentModuleArgs = {
    commentId: number
    type: $Enums.ModuleType
    content: string | CompositionArgs[]
}

type CompositionArgs = {
    fileId: number
    startPosition: number,
    startCue: number,
    endCue: number
}

/**
 * @description Creates a new comment module associated with a specific comment. The type of the module is determined by the `type` parameter, which can be TEXT, REFSONG, AUDIOMESSAGE, or COMPOSITION. Depending on the type, the `content` parameter will be a string for TEXT, REFSONG, and AUDIOMESSAGE types, or an array of CompositionArgs (e.g. AudioTracks) for COMPOSITION type.
 * @param commentId The ID of the comment to which the module will be added.
 * @param type The type of the module to be created (e.g., TEXT, REFSONG, AUDIOMESSAGE, COMPOSITION).
 * @param content The content of the module, which can be a string for TEXT, REFSONG, and AUDIOMESSAGE types, or an array of CompositionArgs (which basically are AudioTracks) for COMPOSITION type.
 * @returns A Promise that resolves to the created comment module, which includes the comment and the specific module type data.
 * @throws {Error} If an invalid module type is provided.
 */
const create = async ({ commentId, type, content }: CreateCommentModuleArgs): Promise<any> => {
    // Promise<any> as a return type is bad practice, but somehow TypeScript infers the wrong type here
    if (type === $Enums.ModuleType.TEXT) {
        return storeTextModule(commentId, content as string)
    } else if (type === $Enums.ModuleType.REFSONG) {
        return storeRefSongModule(commentId, content as string)
    } else if (type === $Enums.ModuleType.AUDIOMESSAGE) {
        return storeAudioMessageModule(commentId, content as string)
    } else if (type === $Enums.ModuleType.COMPOSITION) {
        return storeCompositionModule(commentId, content as CompositionArgs[])
    } else {
        throw new Error("Invalid Module Type")
    }
}

/**
 * @description Deletes a comment module by its ID and returns the ID of the deleted module.
 * @param commentModuleId The ID of the comment module to be deleted.
 * @returns A Promise that resolves to an object containing the ID of the deleted comment module.
 */
const deleteModule = async (commentModuleId: number) => {
    // just return the id of the deleted module, so we can display a removal of the module in the frontend as well
    return prisma.commentModule.delete({ where: { id: commentModuleId }, select: { id: true } })
}

/**
 * @description Stores a text module associated with a specific comment.
 * @param commentId The ID of the comment to which the text module will be added.
 * @param content The text content which should be stored.
 * @returns A Promise that resolves to an object containing the comment itself and the newly created text module.
 */
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

/**
 * @description Stores a reference song module associated with a specific comment.
 * @param commentId The ID of the comment to which the reference song module will be added.
 * @param content The reference song content which should be stored, e.g. a spotify song link as text.
 * @returns A Promise that resolves to an object containing the comment itself and the newly created reference song module.
 */
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

/**
 * @description Stores an audio message module associated with a specific comment.
 * @param commentId The ID of the comment to which the audio message module will be added.
 * @param audioFileName The name of the audio file that should be stored, e.g. the 64-character random string from the S3 file upload.
 * @returns A Promise that resolves to an object containing the comment itself and the newly created audio message module with the audioFile fileName for fetching it from S3.
 */
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

/**
 * @description Stores a composition module associated with a specific comment. The composition module can contain multiple audio tracks.
 * @param commentId The ID of the comment to which the composition module will be added.
 * @param tracks An array of CompositionArgs (e.g. AudioTracks).
 * @returns A Promise that resolves to an object containing the comment itself and the newly created composition module with its audio tracks.
 */
const storeCompositionModule = (commentId: number, tracks: CompositionArgs[]) => {
    // Transform tracks into a form that prisma needs
    const storableTracks = tracks.map(track => (
        {
            audioFileId: track.fileId,
            startPosition: track.startPosition,
            startCue: track.startCue,
            endCue: track.endCue
        }
    ))

    // Create a new Composition Module and create the audioTracks
    // Directly connect audioTracks to the corresponding audioFiles IDs
    return prisma.commentModule.create({
        data: {
            commentId,
            type: $Enums.ModuleType.COMPOSITION,
            composition: {
                create: {
                    audioTracks: {
                        createMany: {
                            data: storableTracks
                        }
                    }
                }
            }
        },
        include: {
            comment: true,
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
    })
}

export default {
    create,
    delete: deleteModule
}

