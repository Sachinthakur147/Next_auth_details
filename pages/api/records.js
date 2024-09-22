import db from "../../utils/db";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const secretKey = process.env.SECRET_KEY || "your_secret_key";

// Authentication Middleware
async function authenticate(req, res, next) {
  const { token } = cookie.parse(req.headers.cookie || "");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, "your_secret_key");
    req.user = decoded; // Attach user info to request
    console.log(req.user);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Authorization Middleware
function authorize(roles = []) {
  return (req, res, next) => {
    console.log(req.user);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Hello Sachin" });
    }
    next();
  };
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    authenticate(req, res, async () => {
      const records = await db.query("SELECT * FROM records");
      return res.status(200).json(records);
    });
  } else if (req.method === "POST") {
    authenticate(req, res, async () => {
      authorize(["Admin"])(req, res, async () => {
        const { first_name, last_name, location, user_id } = req.body;
        await db.query(
          "INSERT INTO records (first_name, last_name, location, user_id) VALUES (?, ?, ?, ?)",
          [first_name, last_name, location, user_id]
        );
        return res.status(201).json({ message: "Record created" });
      });
    });
  } else if (req.method === "PUT") {
    authenticate(req, res, async () => {
      authorize(["Admin"])(req, res, async () => {
        const { id, first_name, last_name, location } = req.body;
        await db.query(
          "UPDATE records SET first_name = ?, last_name = ?, location = ? WHERE id = ?",
          [first_name, last_name, location, id]
        );
        return res.status(200).json({ message: "Record updated" });
      });
    });
  } else if (req.method === "DELETE") {
    authenticate(req, res, async () => {
      authorize(["Admin"])(req, res, async () => {
        const { id } = req.body;
        await db.query("DELETE FROM records WHERE id = ?", [id]);
        return res.status(200).json({ message: "Record deleted" });
      });
    });
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
