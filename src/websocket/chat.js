import {authWebSocket} from '../middlewares/jwt.js'

class WebSocketChats {

    connection(socket) {

        socket.on("disconnect", (data, cb) => {

        })

        socket.on("subscribeToChat", async (data, cb) => {
            await authWebSocket(data, (error, user) => {
                if (error) {
                    cb(error)
                } else {
                    socket.join(data.chatRoomId)
                }
            })
        })

        socket.on("unsubscribeFromChat", async (data, cb) => {
            await authWebSocket(data, (error, user) => {
                if (error) {
                    cb(error)
                } else {
                    socket.leave(data.chatRoomId)
                }
            })
        })

        socket.on("typing", async (data, cb) => {
            await authWebSocket(data, (error, user) => {
                if (error) {
                    cb(error)
                } else {
                    if (user.chatRoomIds.includes(data.chatRoomId)) {
                        socket.to(data.chatRoomId).broadcast.emit("typing", user.name)
                    }
                }
            })
        })

    }
}

export default new WebSocketChats()