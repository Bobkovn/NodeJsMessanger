import {authWebSocket} from '../middlewares/jwt.js'

class WebSocketChats {

    connection(socket) {

        socket.on("disconnect", (data, cb) => {

        })

        socket.on("subscribeToChat", (data, cb) => {
            authWebSocket(data, (error, user) => {
                if (error) {
                    cb(error)
                } else {
                    socket.join(data.chatRoomId)
                }
            })
        })

        socket.on("unsubscribeFromChat", (data, cb) => {
            authWebSocket(data, (error, user) => {
                if (error) {
                    cb(error)
                } else {
                    socket.leave(data.chatRoomId)
                }
            })
        })

        socket.on("typing", (data, cb) => {
            authWebSocket(data, (error, user) => {
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

    subscribeOtherUser(room, otherUserId) {
        const userSockets = this.users.filter(
            (user) => user.userId === otherUserId
        )
        userSockets.map((userInfo) => {
            const socketConn = global.io.sockets.connected(userInfo.socketId);
            if (socketConn) {
                // socketConn.join(room)
            }
        })
    }
}

export default new WebSocketChats()