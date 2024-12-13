export async function retrieveArtists(queryTerm, limit = 50) {
  const baseUrl = 'https://itunes.apple.com/search?';

  const urlParams = {
    term: parseArtistName(queryTerm),
    entity: 'musicArtist',
    limit: limit,
  };

  const url = (baseUrl + new URLSearchParams(urlParams)).toString();

  const result = await fetch(url).then((res) => res.json());

  return result;
}

function parseArtistName(queryTerm) {
  let term = queryTerm.replaceAll(' ', '+');
  return term;
}
