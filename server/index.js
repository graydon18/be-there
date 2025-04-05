const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// In-memory schedule: 7 days, each with 6 slots
let schedule = {
  Monday: Array(6).fill(""),
  Tuesday: Array(6).fill(""),
  Wednesday: Array(6).fill(""),
  Thursday: Array(6).fill(""),
  Friday: Array(6).fill(""),
  Saturday: Array(6).fill(""),
  Sunday: Array(6).fill(""),
};

// GET /schedule
app.get("/schedule", (req, res) => {
  res.json(schedule);
});

// POST /signup
app.post("/signup", (req, res) => {
  const { day, slot, name } = req.body;

  if (!day || slot === undefined || !name) {
    return res.json({ success: false, error: "Invalid input." });
  }

  if (!schedule[day] || slot < 0 || slot >= schedule[day].length) {
    return res.json({ success: false, error: "Invalid day or slot." });
  }

  if (schedule[day][slot]) {
    return res.json({ success: false, error: "Slot already taken." });
  }

  schedule[day][slot] = name;
  return res.json({ success: true, schedule });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});