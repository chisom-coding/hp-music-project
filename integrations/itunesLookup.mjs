import fetch from 'node-fetch';

export async function retrieveAlbums(queryId, limit = 50) {
  const baseUrl = 'https://itunes.apple.com/lookup?';

  const urlParams = {
    id: parseInt(queryId),
    entity: 'album',
    limit: limit,
  };

  const url = (baseUrl + new URLSearchParams(urlParams)).toString();

  const response = await fetch(url).then((res) => res.json());

  const uniqueAlbums = Array.from(
    new Map(
      response.results.map((album) => [album.collectionName, album])
    ).values()
  );

  const filteredAlbums = uniqueAlbums.filter(
    (album) =>
      !album.collectionName?.includes(' - Single') &&
      !album.collectionName?.includes(' - EP') &&
      !album.collectionName?.includes('Remixes')
  );

  return filteredAlbums;
}
