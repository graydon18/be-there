const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// In-memory schedule: 7 days, each with 6 slots
let schedule = {
  Monday: Array(4).fill(null),
  Tuesday: Array(4).fill(null),
  Wednesday: Array(4).fill(null),
  Thursday: Array(4).fill(null),
  Friday: Array(4).fill(null),
  Saturday: Array(4).fill(null),
  Sunday: Array(4).fill(null),
};

let users = [];

// GET /schedule
app.get("/schedule", (req, res) => {
  res.json(schedule);
});

app.post("/login", (req, res) => {
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

// POST /signup
app.post("/signup", (req, res) => {
  const { day, slot, name, username } = req.body;

  if (!day || slot === undefined || !name || !username) {
    return res.json({ success: false, error: "Invalid input." });
  }

  if (!schedule[day] || slot < 0 || slot >= schedule[day].length) {
    return res.json({ success: false, error: "Invalid day or slot." });
  }

  if (schedule[day][slot]) {
    return res.json({ success: false, error: "Slot already taken." });
  }

  schedule[day][slot] = { name: name, username: username };
  return res.json({ success: true, schedule });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});