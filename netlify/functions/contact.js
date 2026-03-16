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

  const { name, email, message } = body || {};
  if (!name || !email || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        error: "Name, email, and message are required.",
      }),
    };
  }

  const trimmed = {
    name: String(name).trim(),
    email: String(email).trim(),
    message: String(message).trim(),
  };
  if (!trimmed.name || !trimmed.email || !trimmed.message) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        error: "Name, email, and message cannot be empty.",
      }),
    };
  }

  try {
    appendJson("contacts.json", trimmed);
  } catch (e) {
    console.warn("Could not save contact:", e.message);
  }

  console.log("Contact:", trimmed.email, trimmed.name);

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};
