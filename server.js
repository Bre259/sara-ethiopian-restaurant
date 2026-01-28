/**
 * Sara Ethiopian Restaurant — Backend
 * Serves the frontend and handles contact + reservation API.
 */

const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");

// Ensure data directory exists (for local storage of submissions)
try {
  fs.mkdirSync(DATA_DIR, { recursive: true });
} catch (_) {}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ----- Helpers -----
function appendJson(file, entry) {
  const filePath = path.join(DATA_DIR, file);
  let list = [];
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    list = JSON.parse(raw);
  } catch (_) {}
  list.push({ ...entry, at: new Date().toISOString() });
  fs.writeFileSync(filePath, JSON.stringify(list, null, 2), "utf8");
}

// ----- API: Contact -----
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "Name, email, and message are required." });
  }
  const trimmed = { name: String(name).trim(), email: String(email).trim(), message: String(message).trim() };
  if (!trimmed.name || !trimmed.email || !trimmed.message) {
    return res.status(400).json({ success: false, error: "Name, email, and message cannot be empty." });
  }
  try {
    appendJson("contacts.json", trimmed);
  } catch (e) {
    console.warn("Could not save contact:", e.message);
  }
  console.log("Contact:", trimmed.email, trimmed.name);
  res.json({ success: true });
});

// ----- API: Reservations -----
app.post("/api/reservations", (req, res) => {
  const { name, email, phone, date, time, guests, note } = req.body || {};
  if (!name || !email || !phone || !date || !time || !guests) {
    return res
      .status(400)
      .json({ success: false, error: "Name, email, phone, date, time, and guests are required." });
  }
  const trimmed = {
    name: String(name).trim(),
    email: String(email).trim(),
    phone: String(phone).trim(),
    date: String(date).trim(),
    time: String(time).trim(),
    guests: String(guests).trim(),
    note: (note && String(note).trim()) || "",
  };
  if (!trimmed.name || !trimmed.email || !trimmed.phone || !trimmed.date || !trimmed.time || !trimmed.guests) {
    return res.status(400).json({ success: false, error: "Required fields cannot be empty." });
  }
  try {
    appendJson("reservations.json", trimmed);
  } catch (e) {
    console.warn("Could not save reservation:", e.message);
  }
  console.log("Reservation:", trimmed.email, trimmed.date, trimmed.time, trimmed.guests);
  res.json({ success: true });
});

// ----- Health (for platforms like Render/Railway) -----
app.get("/api/health", (_, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log("Sara — server running at http://localhost:" + PORT);
});
