
export const connection = (client) => {

    client.on("disconnect", () => {

    });

    client.on("identity", (userId) => {

    });

    client.on("subscribe", (room, otherUserId = "") => {

        client.join(room);
    });

    client.on("unsubscribe", (room) => {
        client.leave(room);
    });
}