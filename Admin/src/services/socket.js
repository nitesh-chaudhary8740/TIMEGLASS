import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    // CRITICAL: If the socket object exists AT ALL, do not call io() again.
    // This prevents the "Insufficient Resources" storm.
    if (this.socket) return this.socket;

    console.log("Initializing Socket Instance...");
    
    this.socket = io("http://localhost:8081", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 5000, 
      autoConnect: true
    });

    this.socket.on("connect", () => {
      console.log("✅ Connected:", this.socket.id);
    });

    this.socket.on("connect_error", (err) => {
      console.error("❌ Connection Error:", err.message);
    });

    return this.socket;
  }

  joinTicket(ticketId) {
    const cleanId = String(ticketId?.$oid || ticketId);
    if (!cleanId || cleanId === "undefined") return;

    if (this.socket?.connected) {
      this.socket.emit("join_ticket", cleanId);
    } else {
      // Use once to prevent multiple join emissions on one connection
      this.socket?.off("connect_join"); // cleanup
      this.socket?.once("connect", () => {
        this.socket.emit("join_ticket", cleanId);
      });
    }
  }
}

const socketInstance = new SocketService();
export default socketInstance;