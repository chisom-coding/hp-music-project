import { getArtists, getAlbums } from '../../services/itunesService.mjs';
import * as itunesSearch from '../../integrations/itunesSearch.mjs';
import * as itunesLookup from '../../integrations/itunesLookup.mjs';

jest.mock('../../integrations/itunesSearch.mjs', () => ({
  retrieveArtists: jest.fn((artistName) => ({
    resultCount: 1,
    results: [
      {
        id: 1,
        name: 'john',
      },
    ],
  })),
}));

jest.mock('../../integrations/itunesLookup.mjs', () => ({
  retrieveAlbums: jest.fn((artistId) => [
    {
      albumId: 1,
      albumName: 'johnAlbum',
    },
    {
      albumId: 2,
      albumName: 'maryAlbum',
    },
  ]),
}));

const mockRequest = {
  body: {
    artistName: 'fake_artist',
  },
};

const mockResponse = {
  status: jest.fn(() => mockResponse),
  send: jest.fn(),
};

describe('get artists', () => {
  it('should return status of 200 and list of results', async () => {
    await getArtists(mockRequest, mockResponse);
    expect(itunesSearch.retrieveArtists).toHaveBeenCalledWith(
      mockRequest.body.artistName
    );
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith({
      resultCount: 1,
      results: [
        {
          id: 1,
          name: 'john',
        },
      ],
    });
  });

  it('should return status of 400 when the artist does not exist', async () => {
    jest.spyOn(itunesSearch, 'retrieveArtists').mockResolvedValueOnce({
      resultCount: 0,
      results: [],
    });

    await getArtists(mockRequest, mockResponse);
    expect(itunesSearch.retrieveArtists).toHaveBeenCalledWith(
      mockRequest.body.artistName
    );
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith({
      error: 'Could find the artist: ' + mockRequest.body.artistName,
    });
  });
});

describe('get albums', () => {
  it('should return status of 200 and list of albums', async () => {
    const mockRequest = {
      body: {
        artistId: 1,
      },
    };
    await getAlbums(mockRequest, mockResponse);
    expect(itunesLookup.retrieveAlbums).toHaveBeenCalledWith(
      mockRequest.body.artistId
    );
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith([
      {
        albumId: 1,
        albumName: 'johnAlbum',
      },
      {
        albumId: 2,
        albumName: 'maryAlbum',
      },
    ]);
  });

  it('should return status of 400 when the artist does not exist', async () => {
    const mockRequest = {
      body: {
        artistId: 1,
      },
    };

    jest.spyOn(itunesLookup, 'retrieveAlbums').mockResolvedValueOnce([]);

    await getAlbums(mockRequest, mockResponse);
    expect(itunesLookup.retrieveAlbums).toHaveBeenCalledWith(
      mockRequest.body.artistId
    );
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith({
      error: 'Could find any albums',
    });
  });
});
