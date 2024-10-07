const getSpotifyData = async (url, token) => {
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.json();
};

export default async function handler(req, res) {
    const token = req.headers.authorization?.split(" ")[1]; // fix

    const tracksData = await getSpotifyData(
        "https://api.spotify.com/v1/me/tracks",
        token
    );

    const topArtistsData = await getSpotifyData(
        "https://api.spotify.com/v1/me/top/artists",
        token
    );

    // Fetch top songs (this is from spotfiy!!)
    const topSongsData = await getSpotifyData(
        "https://api.spotify.com/v1/playlists/37i9dQZEVXbNG2KDcFcKOF/tracks",
        token
    );

    if (!tracksData || !topArtistsData || !topSongsData) {
        return res.status(500).json({ error: "Failed to fetch Spotify data" });
    }

    const result = processMLAlgorithm(tracksData, topArtistsData, topSongsData);

    return res.status(200).json(result);
}

const calculateScore = (song, userPreferences, weights) => {
    const { popularity, artists, genres } = song;
    const { userGenres, recentlyPlayed } = userPreferences;

    const genreMatch = genres.some((genre) => userGenres.includes(genre))
        ? 1
        : 0;
    const recencyScore = recentlyPlayed.includes(song.id) ? 0 : 1; // !! penality of recently played

    const score =
        popularity * weights.popularity +
        artists[0].popularity * weights.artistPopularity +
        genreMatch * weights.genreMatch +
        recencyScore * weights.recency;

    return score;
};

const processMLAlgorithm = (tracksData, topArtistsData, topSongsData) => {
    const userPreferences = {
        userGenres: topArtistsData.items.flatMap((artist) => artist.genres),
        recentlyPlayed: tracksData.items.map((track) => track.track.id),
    };

    const weights = {
        popularity: 0.4,
        artistPopularity: 0.3,
        genreMatch: 0.2,
        recency: 0.1,
    };

    const allSongs = [
        ...tracksData.items.map((item) => item.track),
        ...topSongsData.items.map((item) => item.track),
    ];

    const scoredSongs = allSongs.map((song) => ({
        ...song,
        score: calculateScore(song, userPreferences, weights),
    }));

    const top10Songs = scoredSongs
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

    return top10Songs;
};
