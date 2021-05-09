import express from 'express'
import chatRoom from '../controllers/chat-room.js'
import {auth} from '../middlewares/jwt.js'

const router = express.Router()

router
    .post('/:roomId/message', auth, chatRoom.postMessage)
    .get('/', auth, chatRoom.getRecentConversation)
    .get('/:roomId', auth, chatRoom.getConversationByRoomId)
    .post('/initiate', auth, chatRoom.initiate)
    .put('/:roomId/mark-read', auth, chatRoom.markConversationReadByRoomId)
    .delete('/room/:roomId', auth, chatRoom.deleteRoomById)
    .delete('/message/:messageId', auth, chatRoom.deleteMessageById)

export default router