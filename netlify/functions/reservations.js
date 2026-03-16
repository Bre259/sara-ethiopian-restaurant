const fs = require("fs");
const path = require("path");

function appendJson(file, entry) {
  const filePath = path.join(__dirname, "..", "..", "data", file);
  let list = [];
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    list = JSON.parse(raw);
  } catch (_) {}
  list.push({ ...entry, at: new Date().toISOString() });
  fs.writeFileSync(filePath, JSON.stringify(list, null, 2), "utf8");
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, error: "Method not allowed" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: "Invalid JSON" }),
    };
  }

  const { name, email, phone, date, time, guests, note } = body || {};
  if (!name || !email || !phone || !date || !time || !guests) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        error: "Name, email, phone, date, time, and guests are required.",
      }),
    };
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
  if (
    !trimmed.name ||
    !trimmed.email ||
    !trimmed.phone ||
    !trimmed.date ||
    !trimmed.time ||
    !trimmed.guests
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        error: "Required fields cannot be empty.",
      }),
    };
  }

  try {
    appendJson("reservations.json", trimmed);
  } catch (e) {
    console.warn("Could not save reservation:", e.message);
  }

  console.log(
    "Reservation:",
    trimmed.email,
    trimmed.date,
    trimmed.time,
    trimmed.guests,
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};
