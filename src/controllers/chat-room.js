import ChatRoomModel, {CHAT_ROOM_TYPES} from '../models/chat-room.js'
import ChatMessageModel from '../models/chat-message.js'
import ChatService from '../services/chat.js'
import UserModel from '../models/user.js'
import Ajv from "ajv"

const ajv = new Ajv()

class ChatRoomController {
    async initiate(req, res) {
        try {
            let body = req.body
            const schema = {
                type: "object",
                properties: {
                    userIds: {
                        elements: {
                            type: "string"
                        }
                    },
                    type: {enum: CHAT_ROOM_TYPES}
                },
                required: ["userIds", "type"],
                additionalProperties: true,
            }

            const validate = ajv.compile(schema)
            const valid = validate(body)
            if (!valid) {
                return res.status(400).json(validate.errors)
            }

            const {userIds, type} = req.body
            const {userId: chatInitiator} = req
            const allUserIds = [...userIds, chatInitiator]
            const chatRoom = await ChatRoomModel.initiateChat(allUserIds, type, chatInitiator)
            return res.status(200).json({success: true, chatRoom})
        } catch (error) {
            return res.status(500).json({success: false, error: error})
        }
    }

    async postMessage(req, res) {
        try {
            let body = req.body
            const schema = {
                type: "object",
                properties: {
                    messageText: {type: "string"}
                },
                required: ["messageText"],
                additionalProperties: true,
            }

            const validate = ajv.compile(schema)
            const valid = validate(body)
            if (!valid) {
                return res.status(400).json(validate.errors)
            }

            const messagePayload = {
                messageText: req.body.messageText,
            }
            const currentLoggedUser = req.userId
            const post = await ChatMessageModel.createPostInChatRoom(roomId, messagePayload, currentLoggedUser)
            io.sockets.in(roomId).emit('newMessage', {message: post})
            return res.status(200).json({success: true, post})
        } catch (error) {
            return res.status(500).json({success: false, error: error})
        }
    }

    async getRecentConversation(req, res) {
        try {
            const currentLoggedUser = req.userId
            const options = {
                page: parseInt(req.query.page) || 0,
                limit: parseInt(req.query.limit) || 10,
            }
            const rooms = await ChatRoomModel.getChatRoomsByUserId(currentLoggedUser)
            const roomIds = rooms.map(room => room._id)
            const recentConversation = await ChatMessageModel.getRecentConversation(
                roomIds, options, currentLoggedUser
            )
            return res.status(200).json({success: true, conversation: recentConversation})
        } catch (error) {
            return res.status(500).json({success: false, error: error})
        }
    }

    async getConversationByRoomId(req, res) {
        try {
            const {roomId} = req.params
            const room = await ChatRoomModel.getChatRoomByRoomId(roomId)
            if (!room) {
                return res.status(400).json({
                    success: false,
                    message: 'No room exists for this id',
                })
            }
            const users = await UserModel.getUserByIds(room.userIds)
            const options = {
                page: parseInt(req.query.page) || 0,
                limit: parseInt(req.query.limit) || 10,
            }
            const conversation = await ChatMessageModel.getConversationByRoomId(roomId, options)
            return res.status(200).json({
                success: true,
                conversation,
                users,
            })
        } catch (error) {
            return res.status(500).json({success: false, error})
        }
    }

    async markConversationReadByRoomId(req, res) {
        try {
            const {roomId} = req.params
            const room = await ChatRoomModel.getChatRoomByRoomId(roomId)
            if (!room) {
                return res.status(400).json({
                    success: false,
                    message: 'No room exists for this id',
                })
            }

            const currentLoggedUser = req.userId
            const result = await ChatMessageModel.markMessageRead(roomId, currentLoggedUser)
            return res.status(200).json({success: true, data: result})
        } catch (error) {
            console.log(error)
            return res.status(500).json({success: false, error})
        }
    }

    async deleteRoomById(req, res) {
        try {
            const {roomId} = req.params
            const room = await ChatRoomModel.remove({_id: roomId})
            const messages = await ChatMessageModel.remove({chatRoomId: roomId})
            return res.status(200).json({
                success: true,
                message: "Operation performed succesfully",
                deletedRoomsCount: room.deletedCount,
                deletedMessagesCount: messages.deletedCount,
            })
        } catch (error) {
            return res.status(500).json({success: false, error: error})
        }
    }

    async deleteMessageById(req, res) {
        try {
            const {messageId} = req.params
            const message = await ChatMessageModel.remove({_id: messageId})
            return res.status(200).json({
                success: true,
                deletedMessagesCount: message.deletedCount,
            })
        } catch (error) {
            return res.status(500).json({success: false, error: error})
        }
    }
}

export default new ChatRoomController()