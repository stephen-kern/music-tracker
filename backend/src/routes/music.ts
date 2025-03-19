import express, { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Redirect user to Spotify Auth
router.get("/spotify/login", (req: Request, res: Response) => {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID ?? "",
    scope: process.env.SPOTIFY_SCOPE ?? "",
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI ?? "",
  });

  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  res.redirect(authUrl);
});

// store the tokens in an object
const userTokens: {
  [key: string]: { accessToken: string; refreshToken: string };
} = {};
router.get("/spotify/callback", async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    if (!code) {
      res.status(400).json({ error: "Missing authorization code" });
      return;
    }

    const params = new URLSearchParams({
      grant_type: "authorization_code",
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI ?? "",
        client_id: process.env.SPOTIFY_CLIENT_ID ?? "",
        client_secret: process.env.SPOTIFY_CLIENT_SECRET ?? "",
    })

    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token } = tokenResponse.data;

    // Store token temporarily (will update with db storage later)
    userTokens[req.ip || "default"] = {
      accessToken: access_token,
      refreshToken: refresh_token,
    };

    res.json({
      message: "Successfully authenticated",
      access_token,
      refresh_token,
    });
  } catch (error: any) {
    console.error("Error getting tokens:", error.response?.data || error);
    res.status(500).json({ error: "Failed to get access tokens" });
  }
});

router.get("/spotify/profile", async (req: Request, res: Response) => {
  try {
    const userToken = userTokens[req.ip || "default"];
    if (!userToken) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${userToken.accessToken}`,
      },
    });
    res.json(response.data);
  } catch (error: any) {
    console.error(
      "Error fetching user profile:",
      error.response?.data || error
    );
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

export default router;
