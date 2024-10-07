import { Box, Typography } from "@mui/joy";
import Link from "next/link";

const Navbar = (active) => {
    const services = [
        {
            id: "playback",
            name: "Playback",
            route: "/api/login",
        },
        {
            id: "artist-info",
            name: "Artist Info",
            route: "/artist-info",
        },
        {
            id: "compare-artists",
            name: "Compare Artists",
            route: "/compare-artists",
        },
    ];

    return (
        <Box
            className="navigation bar"
            sx={{
                display: "flex",
                height: "50px",
                backgroundColor: "white",
                borderRadius: "30px",
                boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.25)",
                ml: 4,
                mr: 4,
            }}
        >
            {services.map((service) => {
                return (
                    <Box
                        key={service.id}
                        sx={{
                            flex: 1,
                            height: "100%",
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Link
                            href={service.route}
                            style={{ textDecoration: "none" }}
                        >
                            <Box
                                sx={{
                                    padding: 0.5,
                                    "&:hover": {
                                        cursor: "pointer",
                                    },
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontStyle: "normal",
                                        fontSize: "16px",
                                        ...(active.active === service.id
                                            ? {
                                                  fontWeight: "bold",
                                              }
                                            : {
                                                  fontWeight: "normal",
                                              }),
                                    }}
                                >
                                    {service.name}
                                </Typography>
                            </Box>
                        </Link>
                    </Box>
                );
            })}
        </Box>
    );
};

export default Navbar;
