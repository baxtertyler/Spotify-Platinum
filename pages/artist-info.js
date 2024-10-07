import Header from "../components/Header.jsx";
import Navbar from "../components/Navbar.jsx";

import React from "react";

import { Box, Input, Button, Typography } from "@mui/joy";

import { getArtist, getLatestAlbum } from "../utility/spotifyApi";

import { colorMap } from "../assets/colors.js";

const ArtistInfo = () => {
    const [search, setSearch] = React.useState("");
    const [item, setItem] = React.useState(undefined);

    const handleSubmit = async () => {
        const artist = await getArtist(search);
        const latestAlbum = await getLatestAlbum(artist.id);
        setItem({ artist: artist, album: latestAlbum });
    };

    return (
        <Box>
            <Header />
            <Navbar active="artist-info" />
            <Box
                className="container"
                sx={{
                    margin: 4,
                    backgroundColor: "white",
                    borderRadius: "30px",
                    boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.25)",
                    padding: 3,
                }}
            >
                <Box
                    className="input box and button"
                    sx={{ display: "flex", gap: 4 }}
                >
                    <Input
                        placeholder="Enter an artist name..."
                        sx={{ flex: 5 }}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button
                        onClick={handleSubmit}
                        sx={{ flex: 1 }}
                        color={"success"}
                    >
                        Submit
                    </Button>
                </Box>
                {item && (
                    <Box className="artist info" sx={{ marginTop: 4 }}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: {
                                    md: "row",
                                    sm: "column",
                                    xs: "column",
                                },
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 5,
                            }}
                        >
                            <img
                                src={item.artist.images[0].url}
                                alt={item.artist.name}
                                style={{
                                    width: "200px",
                                    maxHeight: "200px",
                                    borderRadius: "20",
                                    border: "5px solid black",
                                }}
                            />
                            <Box
                                sx={{
                                    textAlign: "center",
                                }}
                            >
                                <Typography
                                    level="h1"
                                    sx={{
                                        fontSize: `${
                                            item.artist.name.length >= 12
                                                ? 90
                                                : 150
                                        }px`,
                                        lineHeight: "0.9",
                                    }}
                                >
                                    {item.artist.name}
                                </Typography>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                                marginTop: 3,
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: {
                                        xs: "350px",
                                        sm: "400px",
                                        md: "500px",
                                    },
                                }}
                            >
                                <Typography level="h1">Popularity:</Typography>

                                <Box
                                    sx={{
                                        paddingX: 1,
                                        backgroundColor:
                                            colorMap[
                                                Math.floor(
                                                    item.artist.popularity / 5
                                                )
                                            ],
                                        border: "4px solid black",
                                        boxShadow: `0px 0px 5px 0px black`,
                                    }}
                                >
                                    <Typography level="h1">
                                        {item.artist.popularity}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: {
                                        xs: "350px",
                                        sm: "400px",
                                        md: "500px",
                                    },
                                    marginTop: 1,
                                }}
                            >
                                <Typography level="h1">Followers:</Typography>
                                <Typography level="h1">
                                    {item.artist.followers.total}
                                </Typography>
                            </Box>
                        </Box>
                        <Box>
                            <img
                                src={item.album.images[0].url}
                                alt={item.artist.name}
                                style={{
                                    width: "200px",
                                    maxHeight: "200px",
                                    border: "5px solid black",
                                    borderRadius: "20",
                                }}
                            />
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default ArtistInfo;
