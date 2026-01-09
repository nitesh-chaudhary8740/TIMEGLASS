import { Server } from "socket.io";

let io;

// server/socket.js
export const initSocket = (server, corsOptions) => {
    io = new Server(server, { cors: corsOptions });

    io.on("connection", (socket) => {
        socket.on("join_ticket", (ticketId) => {
            const roomId = String(ticketId?.$oid || ticketId);
            
            if (roomId && roomId !== "undefined") {
                // If the socket is already in this room, don't do anything
                if (socket.rooms.has(roomId)) return;

                // Leave previous ticket rooms (but stay in their own private socket.id room)
                for (const room of socket.rooms) {
                    if (room !== socket.id) socket.leave(room);
                }

                socket.join(roomId);
                console.log(`✅ [Room Join] ${socket.id} -> ${roomId}`);
            }
        });
    });
    return io;
};

export const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized!");
    return io;
};