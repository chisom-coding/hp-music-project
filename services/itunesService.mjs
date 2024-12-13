import { retrieveArtists } from '../integrations/itunesSearch.mjs';
import { retrieveAlbums } from '../integrations/itunesLookup.mjs';

export async function getArtists(req, res) {
  let data = await retrieveArtists(req.body.artistName);
  if (data.resultCount != 0) {
    return res.status(200).send(data);
  } else {
    return res
      .status(400)
      .send({ error: 'Could find the artist: ' + req.body.artistName });
  }
}

export async function getAlbums(req, res) {
  let data = await retrieveAlbums(req.body.artistId);
  if (data.length != 0) {
    return res.status(200).send(data);
  } else {
    return res.status(400).send({ error: 'Could find any albums' });
  }
}
