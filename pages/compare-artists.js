import Header from "../components/Header.jsx";
import Navbar from "../components/Navbar.jsx";

import React from "react";

import {
    Box,
    Input,
    Button,
    Typography,
    Checkbox,
    Table,
    Select,
    Option,
} from "@mui/joy";
import { BarChart } from "@mui/x-charts";

import ClearIcon from "@mui/icons-material/Clear";

import { getArtist } from "../utility/spotifyApi";
import { useStore } from "../utility/store.store";

const CompareArtist = () => {
    const [search, setSearch] = React.useState("");

    const handleCheckboxChange = (artistId) => {
        if (compareArtists_selected.includes(artistId)) {
            compareArtists_selected_remove(artistId);
        } else {
            compareArtists_selected_add(artistId);
        }
    };

    const [
        compareArtists_artists,
        compareArtists_artists_add,
        compareArtists_artists_remove,
        compareArtists_selected,
        compareArtists_selected_add,
        compareArtists_selected_remove,
        compareArtists_queryType,
        compareArtists_queryType_set,
    ] = useStore((state) => [
        state.compareArtists_artists,
        state.compareArtists_artists_add,
        state.compareArtists_artists_remove,
        state.compareArtists_selected,
        state.compareArtists_selected_add,
        state.compareArtists_selected_remove,
        state.compareArtists_queryType,
        state.compareArtists_queryType_set,
    ]);

    const tableOptions = ["Popularity", "Followers"];

    const handleSubmit = async () => {
        if (search !== "") {
            const artist = await getArtist(search);
            if (!compareArtists_artists.some((a) => a.id === artist.id)) {
                compareArtists_selected_add(artist.id);
                compareArtists_artists_add(artist);
            }
        }
    };

    return (
        <Box>
            <Header />
            <Navbar active="compare-artists" />
            <Box
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
                }}
            >
                <Box
                    className="input box and button and table"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 1,
                        }}
                    >
                        <Input
                            placeholder="Enter an artist name..."
                            sx={{ flex: 5 }}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button
                            onClick={handleSubmit}
                            sx={{
                                flex: 1,
                            }}
                            color={"success"}
                        >
                            Submit
                        </Button>
                    </Box>
                    <Select
                        placeholder="Choose how to compare"
                        sx={{ marginTop: 2 }}
                        onChange={(event, newValue) => {
                            newValue
                                ? compareArtists_queryType_set(newValue)
                                : console.log("No value selected");
                        }}
                        defaultValue={compareArtists_queryType}
                    >
                        {tableOptions.map((option) => (
                            <Option key={option} value={option}>
                                <Box>{option}</Box>
                            </Option>
                        ))}
                    </Select>
                    {compareArtists_artists.length > 0 && (
                        <Table
                            aria-label="basic table"
                            sx={{
                                border: "1px solid lightgray",
                                borderRadius: "15px",
                                marginTop: 2,
                            }}
                        >
                            <tbody>
                                {compareArtists_artists.map((artist, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "space-between",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            flexDirection:
                                                                "row",
                                                            alignItems:
                                                                "center",
                                                        }}
                                                    >
                                                        <Checkbox
                                                            checked={compareArtists_selected.includes(
                                                                artist.id
                                                            )}
                                                            onChange={() =>
                                                                handleCheckboxChange(
                                                                    artist.id
                                                                )
                                                            }
                                                            sx={(theme) => ({
                                                                margin: 1,
                                                                marginRight: 2,
                                                            })}
                                                            color={"success"}
                                                        />
                                                        <Typography level="body-lg">
                                                            {artist.name}
                                                        </Typography>
                                                    </Box>
                                                    <Box
                                                        sx={{
                                                            borderRadius: "5px",
                                                            marginRight: 1,
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            ":hover": {
                                                                backgroundColor:
                                                                    "lightgray",
                                                            },
                                                        }}
                                                        onClick={() =>
                                                            compareArtists_artists_remove(
                                                                artist.id
                                                            )
                                                        }
                                                    >
                                                        <ClearIcon
                                                            sx={{
                                                                color: "gray",
                                                            }}
                                                        />
                                                    </Box>
                                                </Box>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    )}
                </Box>

                <Box
                    className="visual element"
                    sx={{
                        flex: 3,
                        display: "flex",
                        justifyContent: "center",
                        maxheight: "200px",
                        overflow: "auto",
                    }}
                >
                    {compareArtists_artists.length > 0 && (
                        <BarChart
                            xAxis={[
                                {
                                    dataKey: "name",
                                    label: "Artist Name",
                                    scaleType: "band",
                                },
                            ]}
                            series={[
                                {
                                    dataKey: "data",
                                    label: compareArtists_queryType,
                                    color: "green",
                                },
                            ]}
                            dataset={compareArtists_artists
                                .filter(
                                    (artist) =>
                                        artist &&
                                        compareArtists_selected.includes(
                                            artist.id
                                        )
                                )
                                .map((artist) => {
                                    key: artist.id;
                                    let data;
                                    if (
                                        compareArtists_queryType ===
                                        "Popularity"
                                    ) {
                                        data = artist.popularity;
                                    } else if (
                                        compareArtists_queryType === "Followers"
                                    ) {
                                        data = artist.followers["total"];
                                    } else {
                                        data = 0;
                                    }
                                    return {
                                        key: artist.id,
                                        name: artist.name,
                                        data: data,
                                    };
                                })}
                            width={600}
                            height={400}
                        />
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default CompareArtist;
