const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// In-memory schedule: 7 days, each with 4 slots
let schedule = {
  Monday: { 
    slots: Array(4).fill(null),
    backupDrivers: [],
    backupPackers: []
  },
  Tuesday: { 
    slots: Array(4).fill(null),
    backupDrivers: [],
    backupPackers: []
  },
  Wednesday: { 
    slots: Array(4).fill(null),
    backupDrivers: [],
    backupPackers: []
  },
  Thursday: { 
    slots: Array(4).fill(null),
    backupDrivers: [],
    backupPackers: []
  },
  Friday: { 
    slots: Array(4).fill(null),
    backupDrivers: [],
    backupPackers: []
  },
  Saturday: { 
    slots: Array(4).fill(null),
    backupDrivers: [],
    backupPackers: []
  },
  Sunday: { 
    slots: Array(4).fill(null),
    backupDrivers: [],
    backupPackers: []
  },
};

let users = [];

// GET /schedule
app.get("/schedule", (req, res) => {
  res.json(schedule);
});

app.post("/register", (req, res) => {
  const { name, username } = req.body;

  if (!name || !username) {
    return res.json({ success: false, error: "Name and username are required." });
  }

  const exists = users.find(u => u.username === username);
  if (exists) {
    return res.json({ success: false, error: "Username already taken." });
  }

  users.push({ username, name });
  return res.json({ success: true, name, username });
});

app.post("/login", (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.json({ success: false, error: "Username is required." });
  }

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.json({ success: false, error: "Username not found." });
  }

  return res.json({ success: true, name: user.name, username: user.username });
});

// POST /signup
app.post("/signup", (req, res) => {
  const { day, slot, name, username } = req.body;

  if (!day || slot === undefined || !name || !username) {
    return res.json({ success: false, error: "Invalid input." });
  }

  if (!schedule[day] || slot < 0 || slot >= schedule[day].slots.length) {
    return res.json({ success: false, error: "Invalid day or slot." });
  }

  if (schedule[day].slots[slot]) {
    return res.json({ success: false, error: "Slot already taken." });
  }

  schedule[day].slots[slot] = { name: name, username: username };
  return res.json({ success: true, schedule });
});

app.post("/signup-backup", (req, res) => {
  const { day, type, name, username } = req.body;
  
  if (!day || !type || !username || !name || !schedule[day]) {
      return res.json({ success: false, error: "Invalid input." });
  }
  
  const daySchedule = schedule[day];
  
  const isAlreadyPrimary = daySchedule.slots.some(slot => slot?.username === username);
  
  const isAlreadyInQueue = type === "driver"
      ? daySchedule.backupDrivers.some(u => u.username === username)
      : daySchedule.backupPackers.some(u => u.username === username);
  
  if (isAlreadyPrimary) {
      return res.json({ success: false, error: `Youre already a primary volunteer for this ${day}.` });
  }
  
  if (isAlreadyInQueue) {
      return res.json({ success: false, error: `You're already signed up as a backup ${type}.` });
  }
  
  const user = { name, username };
  if (type === "driver") {
      daySchedule.backupDrivers.push(user);
  } else {
      daySchedule.backupPackers.push(user);
  }
  
  return res.json({ success: true, schedule });
});

// DELETE /slot
app.delete("/slot", (req, res) => {
  const { day, slot, username } = req.body;

  if (!day || slot === undefined || !username) {
    return res.json({ success: false, error: "Invalid input." });
  }

  const daySchedule = schedule[day];
  const slotData = daySchedule?.slots?.[slot];

  if (!slotData) {
    return res.json({ success: false, error: "Slot is already empty." });
  }

  if (slotData.username !== username) {
    return res.json({ success: false, error: "You can only delete your own slot." });
  }

  // Clear the slot
  daySchedule.slots[slot] = null;

  // Promote a backup if available
  if (slot === 0 && daySchedule.backupDrivers.length > 0) {
    const nextDriver = daySchedule.backupDrivers.shift();
    daySchedule.slots[0] = nextDriver;

    // Remove from backupPackers if exists
    daySchedule.backupPackers = daySchedule.backupPackers.filter(p => p.username !== nextDriver.username);
  }

  if (slot >= 1 && slot <= 3 && daySchedule.backupPackers.length > 0) {
    const nextPacker = daySchedule.backupPackers.shift();
    daySchedule.slots[slot] = nextPacker;

    // Remove from backupDrivers if exists
    daySchedule.backupDrivers = daySchedule.backupDrivers.filter(d => d.username !== nextPacker.username);
  }

  return res.json({ success: true, schedule });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
