import express from 'express'
import chatRoom from '../controllers/chat-room.js'

const router = express.Router();

router
    .get('/', chatRoom.getRecentConversation)
    .get('/:roomId', chatRoom.getConversationByRoomId)
    .post('/initiate', chatRoom.initiate)
    .post('/:roomId/message', chatRoom.postMessage)
    .put('/:roomId/mark-read', chatRoom.markConversationReadByRoomId)
    .delete('/room/:roomId', chatRoom.deleteRoomById)
    .delete('/message/:messageId', chatRoom.deleteMessageById)

export default router