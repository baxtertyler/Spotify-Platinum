import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import Navbar from "../components/Navbar.jsx";
import { Box, Typography, Button } from "@mui/joy";
import Image from "next/image";
import Recommendations from "../components/Recommendations.jsx";

import {
    getTokenFromCode,
    pausePlayback,
    playPlayback,
    getPlaybackState,
    nextSong,
    previousSong,
} from "../utility/spotifyApi.js";
import Link from "next/link";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";

const Playback = () => {
    const [code, setCode] = useState(null);
    const [token, setToken] = useState(null);
    const [playbackState, setPlaybackState] = useState(null);
    const [count, setCount] = useState(0);

    const updatePlaybackState = async () => {
        if (token) {
            const state = await getPlaybackState(token);
            if (state) {
                setPlaybackState(state);
            }
        }
    };

    const handlePlaybackStatus = async () => {
        if (playbackState) {
            if (playbackState.is_playing) {
                await pausePlayback(token, playbackState.device.id);
            } else {
                await playPlayback(token, playbackState.device.id);
            }
            await updatePlaybackState();
        }
    };

    const playNextSong = async () => {
        await nextSong(token, playbackState.device.id);
        await updatePlaybackState();
    };

    const playPreviousSong = async () => {
        await previousSong(token, playbackState.device.id);
        await updatePlaybackState();
    };

    useEffect(() => {
        if (playbackState && playbackState.is_playing && playbackState.item) {
            const interval = setInterval(async () => {
                await updatePlaybackState();
            }, 1000);
            return () => clearInterval(interval);
        }
        setCount(count + 1);
    }, [count]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const codeParam = params.get("code");
        setCode(codeParam);

        if (codeParam) {
            const fetchPlaybackInfo = async () => {
                getTokenFromCode(codeParam).then((token) => {
                    setToken(token);
                    getPlaybackState(token).then((state) => {
                        if (state) {
                            setPlaybackState(state);
                        }
                    });
                });
            };
            fetchPlaybackInfo();
        }
    }, []);

    return (
        <Box>
            <Header />
            <Navbar active="playback" />
            <Box
                className="container"
                sx={{
                    display: "flex",
                    flexDirection: {
                        xs: "column",
                        sm: "column",
                        md: "row",
                    },
                    margin: 4,
                    backgroundColor: "white",
                    borderRadius: "30px",
                    boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.25)",
                    padding: 3,
                    gap: 2,
                    alignItems: "center",
                    width: "auto",
                    justifyContent: "center",
                }}
            >
                {playbackState && playbackState.item && (
                    <img
                        src={playbackState.item.album.images[0].url}
                        alt={playbackState.item.artists[0].name}
                        style={{
                            width: "150px",
                            maxHeight: "150px",
                            border: "5px solid black",
                            borderRadius: "20",
                        }}
                    />
                )}
                {playbackState && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "auto",
                            minWidth: "75%",
                            padding: 2,
                            paddingLeft: 2,
                            marginTop: 2,
                            gap: 0,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "90%",
                                minHeight: 50,
                                paddingLeft: "5px",
                                gap: 1,
                            }}
                        >
                            <Box
                                sx={{
                                    height: "40px",
                                    border: "1px solid black",
                                    borderRadius: "50%",
                                    width: "40px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    cursor: "pointer",
                                }}
                                onClick={() => {
                                    playPreviousSong();
                                }}
                            >
                                <SkipPreviousIcon sx={{ scale: 1.5 }} />
                            </Box>
                            <Box
                                sx={{
                                    height: "40px",
                                    border: "1px solid black",
                                    borderRadius: "50%",
                                    width: "40px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    cursor: "pointer",
                                }}
                                onClick={() => {
                                    handlePlaybackStatus();
                                }}
                            >
                                {playbackState.is_playing ? (
                                    <PauseIcon sx={{ scale: 1.5 }} />
                                ) : (
                                    <PlayArrowIcon sx={{ scale: 1.5 }} />
                                )}
                            </Box>
                            {playbackState && playbackState.item && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginLeft: 2,
                                        marginRight: 2,
                                        gap: 1,
                                    }}
                                >
                                    <Typography
                                        level={
                                            playbackState.item.name.length > 10
                                                ? "h2"
                                                : "h1"
                                        }
                                    >
                                        {playbackState.item.name}
                                    </Typography>
                                    <Typography
                                        level={
                                            playbackState.item.name.length > 10
                                                ? "h3"
                                                : "h2"
                                        }
                                        sx={{}}
                                    >
                                        {" by " +
                                            playbackState.item.artists[0].name}
                                    </Typography>
                                </Box>
                            )}

                            <Box
                                sx={{
                                    height: "40px",
                                    border: "1px solid black",
                                    borderRadius: "50%",
                                    width: "40px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    cursor: "pointer",
                                }}
                                onClick={() => {
                                    playNextSong();
                                }}
                            >
                                <SkipNextIcon sx={{ scale: 1.5 }} />
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                position: "relative",
                                width: "100%",
                                height: "auto",
                            }}
                        >
                            {playbackState && playbackState.item && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        width: "100%",
                                        height: "auto",
                                        alignItems: "center",
                                        gap: 2,
                                    }}
                                >
                                    <h1>
                                        {Math.floor(
                                            playbackState.progress_ms / 1000
                                        )}
                                    </h1>
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            width: "0px",
                                            height: "20px",
                                            border: "5px solid black",
                                            top: "10",
                                            left: `${
                                                (playbackState.progress_ms /
                                                    playbackState.item
                                                        .duration_ms) *
                                                100 *
                                                (8 / 10)
                                            }%`,
                                            transform: "translateX(450%)",
                                        }}
                                    ></Box>
                                    <Box
                                        sx={{
                                            height: "0px",
                                            width: "80%",
                                            border: "5px solid black",
                                        }}
                                    />
                                    <h1>
                                        {Math.floor(
                                            playbackState.item.duration_ms /
                                                1000
                                        )}
                                    </h1>
                                </Box>
                            )}
                        </Box>
                    </Box>
                )}
            </Box>
            {token && (
                <Box
                    className="container"
                    sx={{
                        display: "flex",
                        flexDirection: {
                            xs: "column",
                            sm: "column",
                            md: "row",
                        },
                        margin: 4,
                        backgroundColor: "white",
                        borderRadius: "30px",
                        boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.25)",
                        padding: 3,
                        gap: 2,
                        alignItems: "center",
                        width: "auto",
                        justifyContent: "center",
                    }}
                >
                    <Recommendations token={token} />
                </Box>
            )}
        </Box>
    );
};

export default Playback;
