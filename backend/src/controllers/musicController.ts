import { Request, Response } from 'express';

// Placeholder for getting artist info
export const getArtistInfo = (req: Request, res: Response) => {
    const artistName = req.params.name;

    // This is just a placeholder, I will call Spotify API here
    res.json({
        artist: artistName,
        info: 'This will be info from the Spotify API.'
    });
};