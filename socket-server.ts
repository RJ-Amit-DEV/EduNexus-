import { createServer } from "http";
import { Server } from "socket.io";

const PORT = Number(process.env.SOCKET_PORT) || 3001;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderRole: "STUDENT" | "TEACHER" | "PARENT" | "AI";
  content: string;
  timestamp: string;
  isDoubt?: boolean;
}

// In-memory message store per room for instant retrieval
const roomMessages: Record<string, ChatMessage[]> = {
  "direct-student-teacher": [
    {
      id: "st-1",
      roomId: "direct-student-teacher",
      senderId: "student-101",
      senderName: "Alex Johnson",
      senderRole: "STUDENT",
      content: "Hello Dr. Mitchell! I had a quick question regarding question 4 on the thermodynamics worksheet.",
      timestamp: "09:40 AM",
    },
    {
      id: "st-2",
      roomId: "direct-student-teacher",
      senderId: "teacher-201",
      senderName: "Dr. Sarah Mitchell",
      senderRole: "TEACHER",
      content: "Hi Alex! Make sure to take isothermal expansion into account when calculating net work done.",
      timestamp: "09:45 AM",
    },
  ],
  "direct-parent-teacher": [
    {
      id: "pt-1",
      roomId: "direct-parent-teacher",
      senderId: "parent-301",
      senderName: "David Johnson",
      senderRole: "PARENT",
      content: "Good morning Dr. Mitchell, thank you for the feedback on Alex's lab report. How is his consistency looking this week?",
      timestamp: "08:30 AM",
    },
    {
      id: "pt-2",
      roomId: "direct-parent-teacher",
      senderId: "teacher-201",
      senderName: "Dr. Sarah Mitchell",
      senderRole: "TEACHER",
      content: "Good morning Mr. Johnson! Alex has been very diligent and is maintaining a 14-day study streak. No concerns at all!",
      timestamp: "08:42 AM",
    },
  ],
  "class-cls-1": [
    {
      id: "m-1",
      roomId: "class-cls-1",
      senderId: "teacher-201",
      senderName: "Dr. Sarah Mitchell",
      senderRole: "TEACHER",
      content: "Welcome everyone to AP Physics! Remember lab reports are due tomorrow.",
      timestamp: "10:15 AM",
    },
    {
      id: "m-2",
      roomId: "class-cls-1",
      senderId: "student-101",
      senderName: "Alex Johnson",
      senderRole: "STUDENT",
      content: "Dr. Mitchell, should we include error propagation graphs in Section 3?",
      timestamp: "10:18 AM",
    },
    {
      id: "m-3",
      roomId: "class-cls-1",
      senderId: "teacher-201",
      senderName: "Dr. Sarah Mitchell",
      senderRole: "TEACHER",
      content: "Yes, exactly! Both relative and absolute uncertainties are required.",
      timestamp: "10:20 AM",
    },
  ],
  "doubts-live": [
    {
      id: "d-1",
      roomId: "doubts-live",
      senderId: "student-101",
      senderName: "Alex Johnson",
      senderRole: "STUDENT",
      content: "Can someone clarify why centripetal force does not do work?",
      timestamp: "11:02 AM",
      isDoubt: true,
    },
    {
      id: "d-2",
      roomId: "doubts-live",
      senderId: "ai-bot",
      senderName: "EduNexus AI Tutor",
      senderRole: "AI",
      content: "Because displacement is perpendicular to the force at every infinitesimal point (W = F · d · cos(90°) = 0).",
      timestamp: "11:02 AM",
    },
  ],
};

io.on("connection", (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  // Client joins a channel/room
  socket.on("join_room", ({ roomId, user }) => {
    socket.join(roomId);
    console.log(`[Socket.io] ${user?.name || socket.id} joined room: ${roomId}`);

    // Send existing room message history
    const history = roomMessages[roomId] || [];
    socket.emit("room_history", { roomId, messages: history });
  });

  // Client sends a message
  socket.on("send_message", (msg: ChatMessage) => {
    if (!roomMessages[msg.roomId]) {
      roomMessages[msg.roomId] = [];
    }
    roomMessages[msg.roomId].push(msg);

    // Keep history manageable
    if (roomMessages[msg.roomId].length > 50) {
      roomMessages[msg.roomId].shift();
    }

    // Broadcast to all clients in the room
    io.to(msg.roomId).emit("receive_message", msg);
  });

  // Typing indicators
  socket.on("typing", ({ roomId, userName }) => {
    socket.to(roomId).emit("user_typing", { userName });
  });

  socket.on("stop_typing", ({ roomId }) => {
    socket.to(roomId).emit("user_stop_typing");
  });

  socket.on("disconnect", () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`⚡ EduNexus Socket.io Real-Time Server running on http://localhost:${PORT}`);
});
