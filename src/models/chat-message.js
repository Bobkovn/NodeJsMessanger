import mongoose from "mongoose"

export const ATTACHMENT_TYPES = {
    IMAGE: "image",
    VIDEO: "video",
    COORDINATES: "coordinates",
}

const chatMessageSchema = new mongoose.Schema(
    {
        chatRoomId: String,
        text: {
            type: String,
        },
        postedByUserId: String,
        readByUserIds: [String],
        attachments: [{
            type: String,
            data: String
        }]
    },
    {
        timestamps: true,
        collection: "chatmessages",
    }
)

chatMessageSchema.statics.createPostInChatRoom = async function (chatRoomId, message, postedByUser) {
    try {
        const post = await this.create({
            chatRoomId,
            message,
            postedByUser,
            readByRecipients: {readByUserId: postedByUser}
        })
        const aggregate = await this.aggregate([
            {$match: {_id: post._id}},
            {
                $lookup: {
                    from: 'users',
                    localField: 'postedByUser',
                    foreignField: '_id',
                    as: 'postedByUser',
                }
            },
            {$unwind: '$postedByUser'},
            {
                $lookup: {
                    from: 'chatrooms',
                    localField: 'chatRoomId',
                    foreignField: '_id',
                    as: 'chatRoomInfo',
                }
            },
            {$unwind: '$chatRoomInfo'},
            {$unwind: '$chatRoomInfo.userIds'},
            {
                $lookup: {
                    from: 'users',
                    localField: 'chatRoomInfo.userIds',
                    foreignField: '_id',
                    as: 'chatRoomInfo.userProfile',
                }
            },
            {$unwind: '$chatRoomInfo.userProfile'},
            {
                $group: {
                    _id: '$chatRoomInfo._id',
                    postId: {$last: '$_id'},
                    chatRoomId: {$last: '$chatRoomInfo._id'},
                    message: {$last: '$message'},
                    type: {$last: '$type'},
                    postedByUser: {$last: '$postedByUser'},
                    readByRecipients: {$last: '$readByRecipients'},
                    chatRoomInfo: {$addToSet: '$chatRoomInfo.userProfile'},
                    createdAt: {$last: '$createdAt'},
                    updatedAt: {$last: '$updatedAt'},
                }
            }
        ])
        return aggregate[0]
    } catch (error) {
        throw error
    }
}

chatMessageSchema.statics.getConversationByRoomId = async function (chatRoomId, options = {}) {
    try {
        return this.aggregate([
            {$match: {chatRoomId}},
            {$sort: {createdAt: -1}},
            {
                $lookup: {
                    from: 'users',
                    localField: 'postedByUser',
                    foreignField: '_id',
                    as: 'postedByUser',
                }
            },
            {$unwind: "$postedByUser"},
            {$skip: options.page * options.limit},
            {$limit: options.limit},
            {$sort: {createdAt: 1}},
        ])
    } catch (error) {
        throw error
    }
}

chatMessageSchema.statics.markMessageRead = async function (chatRoomId, userId) {
    try {
        return this.updateMany(
            {
                chatRoomId,
                'readByRecipients.readByUserId': {$ne: userId}
            },
            {
                $addToSet: {
                    readByRecipients: {readByUserId: userId}
                }
            },
            {
                multi: true
            }
        )
    } catch (error) {
        throw error
    }
}

export default mongoose.model("ChatMessage", chatMessageSchema)