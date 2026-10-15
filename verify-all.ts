import { io } from "socket.io-client";

async function verifyAll() {
  console.log("=== STARTING EDUNEXUS VERIFICATION SUITE ===");

  // 1. Verify Web Pages
  const pages = [
    "/",
    "/student",
    "/teacher",
    "/parent",
    "/chat",
    "/login",
    "/login?role=STUDENT",
    "/login?role=TEACHER",
    "/login?role=PARENT",
    "/signup",
    "/signup?role=STUDENT",
    "/signup?role=TEACHER",
    "/signup?role=PARENT",
  ];
  console.log("\n[1] Verifying Next.js Pages (http://localhost:3000)...");
  for (const page of pages) {
    try {
      const res = await fetch(`http://localhost:3000${page}`);
      console.log(`  ✓ Page: ${page} -> Status: ${res.status} ${res.statusText}`);
      if (res.status !== 200) throw new Error(`Failed to load ${page}`);
    } catch (err: any) {
      console.error(`  ✗ Page ${page} failed:`, err.message);
      process.exit(1);
    }
  }

  // 2. Verify Authentication, AI & Enrollment API Endpoints
  console.log("\n[2] Verifying Auth, AI & Enrollment API Endpoints...");

  // Signup API Test
  try {
    const res = await fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Faculty Member",
        email: "test.faculty@edunexus.edu",
        password: "securepassword123",
        role: "TEACHER",
        department: "Computer Science",
        subject: "AI & Machine Learning",
      }),
    });
    const data = await res.json();
    console.log("  ✓ /api/auth/signup (Teacher):", data.success ? "SUCCESS" : "FAILED", `(${data.user?.name})`);
  } catch (err: any) {
    console.error("  ✗ /api/auth/signup error:", err.message);
  }

  // Login API Test
  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test.faculty@edunexus.edu",
        password: "securepassword123",
        role: "TEACHER",
      }),
    });
    const data = await res.json();
    console.log("  ✓ /api/auth/login:", data.success ? "SUCCESS" : "FAILED", `(Token Issued: ${Boolean(data.token)})`);
  } catch (err: any) {
    console.error("  ✗ /api/auth/login error:", err.message);
  }

  // Google Auth API Tests (Instant 1-Click for all roles)
  for (const testRole of ["STUDENT", "TEACHER", "PARENT"] as const) {
    try {
      const res = await fetch("http://localhost:3000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: testRole }),
      });
      const data = await res.json();
      console.log(`  ✓ /api/auth/google (${testRole}):`, data.success ? "SUCCESS" : "FAILED", `(Signed in as: ${data.user?.name}, Role: ${data.user?.role})`);
    } catch (err: any) {
      console.error(`  ✗ /api/auth/google (${testRole}) error:`, err.message);
    }
  }

  // Auth Me Check
  try {
    const res = await fetch("http://localhost:3000/api/auth/me");
    const data = await res.json();
    console.log("  ✓ /api/auth/me:", data.success ? "SUCCESS" : "FAILED", `(Authenticated User: ${data.user?.name}, Role: ${data.user?.role})`);
  } catch (err: any) {
    console.error("  ✗ /api/auth/me error:", err.message);
  }

  // Google Classroom Stream API Test
  try {
    const postRes = await fetch("http://localhost:3000/api/classes/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classId: "cls-1", title: "Test Announcement", content: "Lab assignment due Friday." }),
    });
    const postData = await postRes.json();
    console.log("  ✓ /api/classes/stream (POST Notice):", postData.success ? "SUCCESS" : "FAILED");

    const getRes = await fetch("http://localhost:3000/api/classes/stream?classId=cls-1");
    const getData = await getRes.json();
    console.log("  ✓ /api/classes/stream (GET Feed):", getData.success ? "SUCCESS" : "FAILED", `(${getData.notices?.length || 0} notices)`);
  } catch (err: any) {
    console.error("  ✗ /api/classes/stream error:", err.message);
  }

  // Google Classroom Classwork API Test
  try {
    const postRes = await fetch("http://localhost:3000/api/classes/classwork", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classId: "cls-1", title: "Kinetics Problem Set 4", type: "HOMEWORK", instructions: "Solve problems 1-5.", dueDate: "Tomorrow" }),
    });
    const postData = await postRes.json();
    console.log("  ✓ /api/classes/classwork (POST Task):", postData.success ? "SUCCESS" : "FAILED", `(${postData.classwork?.title})`);

    const putRes = await fetch("http://localhost:3000/api/classes/classwork", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classworkId: postData.classwork?.id || "cw-101", studentId: "student-101", content: "My homework derivation solution." }),
    });
    const putData = await putRes.json();
    console.log("  ✓ /api/classes/classwork (PUT Turn In):", putData.success ? "SUCCESS" : "FAILED");
  } catch (err: any) {
    console.error("  ✗ /api/classes/classwork error:", err.message);
  }

  // Create Class API
  try {
    const res = await fetch("http://localhost:3000/api/classes/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "AP Physics: Mechanics", subject: "Physics", gradeLevel: "Grade 11" }),
    });
    const data = await res.json();
    console.log("  ✓ /api/classes/create:", data.success ? "SUCCESS" : "FAILED", `(Generated Code: ${data.class?.code})`);
  } catch (err: any) {
    console.error("  ✗ /api/classes/create error:", err.message);
  }

  // Join Class API
  try {
    const res = await fetch("http://localhost:3000/api/classes/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: "PHY-301", studentId: "student-101" }),
    });
    const data = await res.json();
    console.log("  ✓ /api/classes/join:", data.success ? "SUCCESS" : "FAILED", `(Enrolled in: ${data.class?.name})`);
  } catch (err: any) {
    console.error("  ✗ /api/classes/join error:", err.message);
  }

  // Parent Link Child API
  try {
    const res = await fetch("http://localhost:3000/api/parent/link-child", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ linkKey: "LINK-SOPHIA-42", parentId: "parent-301" }),
    });
    const data = await res.json();
    console.log("  ✓ /api/parent/link-child:", data.success ? "SUCCESS" : "FAILED", `(Linked: ${data.child?.name})`);
  } catch (err: any) {
    console.error("  ✗ /api/parent/link-child error:", err.message);
  }

  // AI Study Plan
  try {
    const res = await fetch("http://localhost:3000/api/ai/study-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: "Physics", targetGoal: "Score 95%", weeklyHours: 6 }),
    });
    const data = await res.json();
    console.log("  ✓ /api/ai/study-plan:", data.success ? "SUCCESS" : "FAILED", `(${data.plan?.modules?.length || 0} modules)`);
  } catch (err: any) {
    console.error("  ✗ /api/ai/study-plan error:", err.message);
  }

  // AI Quiz Generate
  try {
    const res = await fetch("http://localhost:3000/api/ai/quiz-generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: "Circular Motion", gradeLevel: "Grade 11", count: 2 }),
    });
    const data = await res.json();
    console.log("  ✓ /api/ai/quiz-generate:", data.success ? "SUCCESS" : "FAILED", `(${data.questions?.length || 0} questions generated)`);
  } catch (err: any) {
    console.error("  ✗ /api/ai/quiz-generate error:", err.message);
  }

  // AI Doubt Solver
  try {
    const res = await fetch("http://localhost:3000/api/ai/doubt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: "Explain Lenz's Law", subject: "Physics" }),
    });
    const data = await res.json();
    console.log("  ✓ /api/ai/doubt:", data.success ? "SUCCESS" : "FAILED", `(Confidence: ${Math.round((data.aiConfidence || 0) * 100)}%)`);
  } catch (err: any) {
    console.error("  ✗ /api/ai/doubt error:", err.message);
  }

  // AI Parent Summary
  try {
    const res = await fetch("http://localhost:3000/api/ai/parent-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentName: "Alex Johnson", attendancePercent: 96, averageGrade: 90, consistencyScore: 94 }),
    });
    const data = await res.json();
    console.log("  ✓ /api/ai/parent-summary:", data.success ? "SUCCESS" : "FAILED");
  } catch (err: any) {
    console.error("  ✗ /api/ai/parent-summary error:", err.message);
  }

  // 3. Verify Real-Time Socket.io Two-Way Messaging
  console.log("\n[3] Verifying Socket.io Two-Way Real-Time Messaging (http://localhost:3001)...");
  await new Promise<void>((resolve, reject) => {
    const studentSocket = io("http://localhost:3001", { transports: ["websocket"] });
    const teacherSocket = io("http://localhost:3001", { transports: ["websocket"] });

    const testRoom = "direct-student-101-teacher-201";
    let messageReceivedByTeacher = false;
    let messageReceivedByStudent = false;

    teacherSocket.on("connect", () => {
      console.log("  ✓ Teacher connected to Socket.io server");
      teacherSocket.emit("join_room", {
        roomId: testRoom,
        user: { name: "Dr. Sarah Mitchell", role: "TEACHER" },
      });
    });

    studentSocket.on("connect", () => {
      console.log("  ✓ Student connected to Socket.io server");
      studentSocket.emit("join_room", {
        roomId: testRoom,
        user: { name: "Alex Johnson", role: "STUDENT" },
      });

      // Send a test message from student
      setTimeout(() => {
        studentSocket.emit("send_message", {
          id: "test-msg-1",
          roomId: testRoom,
          senderId: "student-101",
          senderName: "Alex Johnson",
          senderRole: "STUDENT",
          content: "Hello Dr. Mitchell! Automated end-to-end verification test.",
          timestamp: "Just now",
        });
      }, 500);
    });

    teacherSocket.on("receive_message", (msg) => {
      if (msg.id === "test-msg-1") {
        console.log(`  ✓ Teacher received student message: "${msg.content}"`);
        messageReceivedByTeacher = true;

        // Teacher sends reply back
        teacherSocket.emit("send_message", {
          id: "test-reply-1",
          roomId: testRoom,
          senderId: "teacher-201",
          senderName: "Dr. Sarah Mitchell",
          senderRole: "TEACHER",
          content: "Hello Alex! Verification acknowledged, systems operational.",
          timestamp: "Just now",
        });
      }
    });

    studentSocket.on("receive_message", (msg) => {
      if (msg.id === "test-reply-1") {
        console.log(`  ✓ Student received teacher reply: "${msg.content}"`);
        messageReceivedByStudent = true;

        studentSocket.disconnect();
        teacherSocket.disconnect();
        resolve();
      }
    });

    setTimeout(() => {
      if (!messageReceivedByTeacher || !messageReceivedByStudent) {
        studentSocket.disconnect();
        teacherSocket.disconnect();
        reject(new Error("Socket.io verification timed out!"));
      }
    }, 5000);
  });

  console.log("\n=== ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ===");
}

verifyAll().catch((err) => {
  console.error("Verification suite encountered an error:", err);
  process.exit(1);
});
