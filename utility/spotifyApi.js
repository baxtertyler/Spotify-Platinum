const client_id = "205683455b3e4edfb85840e79830d488";
const client_secret = "b03e06fa3b7147e38cb734e661899baa";
const redirect_uri = "http://localhost:3000/playback";

const getToken = async () => {
    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + btoa(client_id + ":" + client_secret),
        },
        body: "grant_type=client_credentials",
    });

    const data = await result.json();
    return data.access_token;
};

export const getTokenFromCode = async (code) => {
    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + btoa(client_id + ":" + client_secret),
        },
        body: new URLSearchParams({
            code: code,
            redirect_uri: redirect_uri,
            grant_type: "authorization_code",
        }),
    });

    const data = await result.json();
    return data.access_token;
};

const getHeaders = (token) => {
    return {
        Authorization: "Bearer " + token,
    };
};

export const getArtistByName = async (artist, token) => {
    const result = await fetch(
        `https://api.spotify.com/v1/search?q=${artist}&type=artist`,
        {
            headers: getHeaders(token),
        }
    );
    const data = await result.json();
    return data.artists.items[0];
};

const getAlbums = async (artistId, token) => {
    const result = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}/albums`,
        {
            headers: getHeaders(token),
        }
    );
    const data = await result.json();
    return data.items;
};

const getSongByName = async (song, token) => {
    const result = await fetch(
        `https://api.spotify.com/v1/search?q=${song}&type=track`,
        {
            headers: getHeaders(token),
        }
    );
    const data = await result.json();
    return data.tracks.items[0];
};

export const getTopTracksByArtistId = async (artistId, token) => {
    const result = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`,
        {
            headers: getHeaders(token),
        }
    );
    const data = await result.json();
    return data.tracks;
};

export const getTopTracksByArtistName = async (artist_name) => {
    const token = await getToken();
    const artist = await getArtistByName(artist_name, token);
    const topTracks = await getTopTracksByArtistId(artist.id, token);
    return topTracks.map((track) => track.name);
};

export const getArtistPopularityByName = async (artist_name) => {
    const token = await getToken();
    const artist = await getArtistByName(artist_name, token);
    return { name: artist.name, popularity: artist.popularity };
};

export const getArtistImagesByName = async (artist_name) => {
    const token = await getToken();
    const artist = await getArtistByName(artist_name, token);
    return artist.images;
};

export const getArtist = async (name) => {
    const token = await getToken();
    const artist = await getArtistByName(name, token);
    return artist;
};

export const getSong = async (name) => {
    const token = await getToken();
    const artist = await getSongByName(name, token);
    return artist;
};

export const getLatestAlbum = async (artist_id) => {
    const token = await getToken();
    const albums = await getAlbums(artist_id, token);
    let latestAlbum = albums[0];
    for (const album of albums) {
        if (album.release_date > latestAlbum.release_date) {
            latestAlbum = album;
        }
    }
    return latestAlbum;
};

const getCurrentPlayingSongOnPlayer = async (token) => {
    const result = await fetch(
        `https://api.spotify.com/v1/me/player/currently-playing?market=US`,
        {
            headers: {
                Authorization: "Bearer " + token,
            },
        }
    );

    if (result.status === 204) {
        return null;
    }
    const data = await result.json();
    return data.item;
};

export const getCurrentSong = async (token) => {
    const data = await getCurrentPlayingSongOnPlayer(token);
    return data;
};

const getCurrentDeviceOnPlayer = async (token) => {
    const result = await fetch(
        "https://api.spotify.com/v1/me/player/devices?market=US",
        {
            headers: {
                Authorization: "Bearer " + token,
            },
        }
    );
    const data = await result.json();
    return data.devices;
};

export const getCurrentDevice = async (token) => {
    const data = await getCurrentDeviceOnPlayer(token);
    return data;
};

export const getPlaybackState = async (token) => {
    const result = await fetch(`https://api.spotify.com/v1/me/player`, {
        headers: {
            Authorization: "Bearer " + token,
        },
    });

    if (result.status === 204) {
        return null;
    }

    const data = await result.json();
    return data;
};

export const pausePlayback = async (token, device_id) => {
    await fetch(
        `https://api.spotify.com/v1/me/player/pause?device_id=${device_id}`,
        {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + token,
            },
        }
    );
};

export const playPlayback = async (token, device_id) => {
    await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,
        {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + token,
            },
        }
    );
};

export const nextSong = async (token, device_id) => {
    await fetch(
        `https://api.spotify.com/v1/me/player/next?device_id=${device_id}`,
        {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
            },
        }
    );
};

export const previousSong = async (token, device_id) => {
    await fetch(
        `https://api.spotify.com/v1/me/player/previous?device_id=${device_id}`,
        {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
            },
        }
    );
};

export const getPlaylists = async (token, category_id) => {
    const result = await fetch(
        `https://api.spotify.com/v1/browse/categories/${category_id}/playlists`,
        {
            headers: {
                Authorization: "Bearer " + token,
            },
        }
    );
    const data = await result.json();
    return data.playlists.items;
};

export const getPlaylist = async (token, playlist_id) => {
    const result = await fetch(
        `https://api.spotify.com/v1/playlists/${playlist_id}`,
        {
            headers: {
                Authorization: "Bearer " + token,
            },
        }
    );
    const data = await result.json();
    return data.tracks.items;
};

export const getLikedSongs = async (token) => {
    const result = await fetch(
        "https://api.spotify.com/v1/me/tracks?limit=50",
        {
            headers: {
                Authorization: "Bearer " + token,
            },
        }
    );
    const data = await result.json();
    return data.items;
};

export const getRecentlyPlayedSongs = async (token) => {
    const result = await fetch(
        "https://api.spotify.com/v1/me/player/recently-played?limit=50&after=0",
        {
            headers: {
                Authorization: "Bearer " + token,
            },
        }
    );
    const data = await result.json();
    return data.items;
};

export const getUserPlaylists = async (token) => {
    const result = await fetch(
        "https://api.spotify.com/v1/me/playlists?limit=50",
        {
            headers: {
                Authorization: "Bearer " + token,
            },
        }
    );
    const data = await result.json();
    return data.items;
};

export const addToQueue = async (token, uri) => {
    await fetch(`https://api.spotify.com/v1/me/player/queue?uri=${uri}`, {
        method: "POST",
        headers: {
            Authorization: "Bearer " + token,
        },
    });
};
