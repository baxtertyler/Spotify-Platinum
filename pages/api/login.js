import { stringify } from "querystring";

export default function handler(req, res) {
    const client_id = "205683455b3e4edfb85840e79830d488";
    const redirect_uri = "http://localhost:3000/playback";
    const state = generateRandomString(16); // Generate a random state for security
    const scope =
        "user-read-playback-state user-modify-playback-state user-library-read user-top-read playlist-read-private user-read-recently-played";

    res.redirect(
        "https://accounts.spotify.com/authorize?" +
            stringify({
                response_type: "code",
                client_id: client_id,
                scope: scope,
                redirect_uri: redirect_uri,
                state: state,
            })
    );
}

function generateRandomString(length) {
    let text = "";
    const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
