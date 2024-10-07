import { Box, Typography } from "@mui/joy";
import React from "react";
import { colors } from "../assets/colors";

import SpotifyLogo from "../assets/images/logo.png";
import Image from "next/image";

const Header = () => {
    return (
        <Box
            className="title and logo"
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
            }}
        >
            <Image alt="Remy Sharp" src={SpotifyLogo} width={150} />
            <Typography
                level="h1"
                sx={{ fontSize: "80px", lineHeight: 1, marginBottom: 2 }}
            >
                Spotify{" "}
                <Typography
                    sx={{
                        color: colors.platinum,
                        fontStyle: "italic",
                        fontSize: "75px",
                        textShadow: "0px 0px 3px rgba(0,0,0,0.75)",
                    }}
                >
                    Platinum
                </Typography>
            </Typography>
        </Box>
    );
};

export default Header;
