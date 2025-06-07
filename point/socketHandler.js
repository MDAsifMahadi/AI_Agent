export const socketHandler = (socket, io) => {
    console.log(socket.id);
    socket.on("msg", (data) => {
        console.log(data);
    });

    socket.emit("reply", "Hello")
}