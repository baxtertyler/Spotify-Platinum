import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";

import { Box, Typography } from "@mui/joy";

export default function Home() {
    return (
        <Box
            sx={{
                height: "90vh",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Link
                href="/api/login"
                style={{
                    textDecoration: "none",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        width: "100px",
                        height: "50px",
                        backgroundColor: "blue",
                        borderRadius: "10px",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "white",
                    }}
                >
                    LOGIN
                </Box>
            </Link>
        </Box>
    );
}
