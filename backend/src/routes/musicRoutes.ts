import express from "express";
import { Request, Response } from "express";


const router = express.Router();

// Route to get artist info
router.get('/test', (req: Request, res: Response) =>{
    res.json({ message: "Music routes are working!" });
});

export default router;