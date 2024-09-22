import db from "../../utils/db";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const secretKey = process.env.SECRET_KEY || "your_secret_key";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    try {
      const result = await db.query("SELECT * FROM users WHERE username = ?", [
        username,
      ]);

      if (result.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = result[0];
      console.log(user, "user");

      if (password) {
        const token = jwt.sign(
          { id: user[0].id, role: user[0].role },
          secretKey,
          { expiresIn: "1h" }
        );

        console.log(secretKey);
        res.setHeader(
          "Set-Cookie",
          cookie.serialize("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600,
            path: "/",
          })
        );

        console.log(user, "id");
        return res
          .status(200)
          .json({ message: "Login successful", role: user[0].role, token });
      } else {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
