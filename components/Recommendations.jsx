import { useEffect, useState } from "react";
import {
    getPlaylists,
    getPlaylist,
    addToQueue,
    getLikedSongs,
    getRecentlyPlayedSongs,
    getUserPlaylists,
    getTopTracksByArtistId,
} from "../utility/spotifyApi";

import { Box, Divider } from "@mui/joy";

const Recommendations = ({ token }) => {
    const [playlists, setPlaylists] = useState([]);
    const [songs, setSongs] = useState([]);
    const [artistSongs, setArtistSongs] = useState(
        Array(5).fill(Array(10).fill(0))
    );

    const queue = async (token, uri) => {
        await addToQueue(token, uri);
    };

    const updateSubArray = (subArrayIndex, newSubArray) => {
        setArtistSongs((prevState) => {
            const newArrayOfArrays = [...prevState];

            newArrayOfArrays[subArrayIndex] = newSubArray;

            return newArrayOfArrays;
        });
    };

    useEffect(() => {
        const fetchAllSongs = async () => {
            try {
                const playlistsData = await getUserPlaylists(token);
                const playlistPromises = playlistsData.map((playlist) =>
                    getPlaylist(token, playlist.id)
                );
                const recentlyPlayedPromise = getRecentlyPlayedSongs(token);
                const likedSongsPromise = getLikedSongs(token);

                const allSongsData = await Promise.all([
                    ...playlistPromises,
                    recentlyPlayedPromise,
                    likedSongsPromise,
                ]);

                const allSongs = allSongsData.flat();

                setSongs(allSongs);

                performContentBasedFiltering(allSongs);
            } catch (error) {
                console.error("Error fetching songs:", error);
            }
        };

        fetchAllSongs();
    }, [token]);

    const performContentBasedFiltering = async (s) => {
        const artistOccurrences = {};

        s.forEach((song) => {
            const artistName = song.track.artists[0].id;
            if (artistOccurrences[artistName]) {
                artistOccurrences[artistName]++;
            } else {
                artistOccurrences[artistName] = 1;
            }
        });

        const artistOccurrencesArray = Object.entries(artistOccurrences);

        artistOccurrencesArray.sort((a, b) => b[1] - a[1]);

        const top5Artists = artistOccurrencesArray.slice(0, 5);

        let i = 0;
        top5Artists.forEach(async (artist) => {
            const topTracks = await getTopTracksByArtistId(artist[0], token);
            updateSubArray(i, topTracks);
            i++;
        });
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
            }}
        >
            <div>
                {/* {songs &&
                    songs.map((song) => (
                        <div
                            key={song.id}
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: "10px",
                            }}
                        >
                            <div style={{ display: "flex", gap: "10px" }}>
                                <p>{song.track.name}</p>
                                <p>{song.track.genre}</p>
                                <button
                                    onClick={() => queue(token, song.track.uri)}
                                >
                                    {" "}
                                    Add to Queue{" "}
                                </button>
                            </div>
                        </div>
                    ))} */}
                {artistSongs.map((s, index) => (
                    <div>
                        {s.map((song) => (
                            <Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                    }}
                                >
                                    <Box sx={{ flex: 1 }}>{song.name}</Box>
                                    {song.artists && (
                                        <Box
                                            sx={{
                                                flex: 1,
                                            }}
                                        >
                                            {song.artists[0].name}
                                        </Box>
                                    )}
                                    <Box sx={{ flex: 1 }}>
                                        <button
                                            onClick={() =>
                                                queue(token, song.uri)
                                            }
                                        >
                                            {" "}
                                            Add to Queue{" "}
                                        </button>
                                    </Box>
                                </Box>
                                <Divider sx={{ m: 1 }} />
                            </Box>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Recommendations;
