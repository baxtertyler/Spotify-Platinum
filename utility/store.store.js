import { create } from "zustand";

export const useStore = create((set) => ({
    compareArtists_artists: [],
    compareArtists_artists_add: (artist) =>
        set((state) => ({
            compareArtists_artists: [...state.compareArtists_artists, artist],
        })),
    compareArtists_artists_remove: (artist_id) =>
        set((state) => ({
            compareArtists_artists: state.compareArtists_artists.filter(
                (a) => a.id !== artist_id
            ),
        })),
    compareArtists_selected: [],
    compareArtists_selected_add: (artist) =>
        set((state) => ({
            compareArtists_selected: [...state.compareArtists_selected, artist],
        })),
    compareArtists_selected_remove: (artist_id) =>
        set((state) => ({
            compareArtists_selected: state.compareArtists_selected.filter(
                (a) => a !== artist_id
            ),
        })),
    compareArtists_queryType: "Popularity",
    compareArtists_queryType_set: (queryType) =>
        set(() => ({
            compareArtists_queryType: queryType,
        })),
    accessToken: "",
    setAccessToken: (token) =>
        set(() => ({
            accessToken: token,
        })),
}));
