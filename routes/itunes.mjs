import { Router } from 'express';
import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';
import { getArtists, getAlbums } from '../services/itunesService.mjs';

const router = Router();
router.use(express.json());
router.use(cors());

router.post('/artists', getArtists);

router.post('/albums', getAlbums);

export default router;
