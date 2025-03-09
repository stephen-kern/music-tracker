import { Router } from 'express';
import { getArtistInfo } from '../controllers/musicController';


const router = Router();

// Route to get artist info
router.get('/artist/:name', getArtistInfo);

export default router;