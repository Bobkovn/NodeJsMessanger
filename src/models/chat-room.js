import mongoose from "mongoose";
import {v4 as uuidv4} from "uuid";

export const CHAT_ROOM_TYPES = {
    USER_TO_USER: "user_to_user",
    GROUP: "group",
    CHANNEL: "channel",
};

const chatRoomSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            default: () => uuidv4(),
        },
        type: String,
    },
    {
        timestamps: true,
        collection: "chatrooms",
    }
);

chatRoomSchema.statics.initiateChat = async function (
    userIds, type, chatInitiator
) {
    try {
        const availableRoom = await this.findOne({
            userIds: {
                $size: userIds.length,
                $all: [...userIds],
            },
            type,
        });
        if (availableRoom) {
            return {
                isNew: false,
                message: 'retrieving an old chat room',
                chatRoomId: availableRoom._doc._id,
                type: availableRoom._doc.type,
            };
        }

        const newRoom = await this.create({ userIds, type, chatInitiator });
        return {
            isNew: true,
            message: 'creating a new chatroom',
            chatRoomId: newRoom._doc._id,
            type: newRoom._doc.type,
        };
    } catch (error) {
        console.log('error on start chat method', error);
        throw error;
    }
}

chatRoomSchema.statics.getChatRoomByRoomId = async function (roomId) {
    try {
        return await this.findOne({_id: roomId});
    } catch (error) {
        throw error;
    }
}

export default mongoose.model("ChatRoom", chatRoomSchema);