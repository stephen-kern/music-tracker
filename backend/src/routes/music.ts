import express, { Request, Response } from "express";
import axios from "axios";
import querystring from "querystring";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Redirect user to Spotify Auth
router.get("/spotify/login", (req: Request, res: Response) => {
  const scope = "user-read-private user-read-email";
  const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify(
    {
      response_type: "code",
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    }
  )}`;

  res.redirect(authUrl);
});

// Handle Spotify Callback
router.get("/spotify/callback", async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;

    if (!code) {
      res.status(400).json({ error: "Missing authorization code" });
      return;      
    }

    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.json(tokenResponse.data);
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error getting tokens:",
        error.response?.data || error.message
      );
      res.status(error.response?.status || 500).json({ error: error.message });
    } else {
      console.error("Error getting tokens:", error.response?.data || error);
      res.status(500).json({ error: "Failed to get access token" });
    }
  }
});

export default router;
