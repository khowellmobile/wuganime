import useSWR from "swr";

import { api } from "../Client";
import { normalizeAnimeList } from "../utils/animeNormalizer";
import { useAuth } from "./useAuth";
import { useCallback } from "react";

export function useCustomAnime() {
    const { isAuthenticated } = useAuth();

    const { data, mutate, error } = useSWR(isAuthenticated ? ["/api/custom-anime/"] : null, ([url]) => api.get(url));

    const customAnime = normalizeAnimeList(data);

    const getCustomAnime = useCallback(
        (id) => {
            return customAnime.find((item) => item.id === id) || null;
        },
        [customAnime],
    );

    const addCustomAnime = async (animeValues) => {
        let response;

        try {
            response = await api.post("/api/custom-anime/", {
                ...animeValues,
            });
        } catch (err) {
            console.error("Failed to add CustomAnime", err);
            return { success: false, message: "CustomAnime Add Failed" };
        }

        try {
            await mutate();
        } catch (err) {
            console.warn("CustomAnime added but list refresh failed", err);
        }

        return { success: true, message: "CustomAnime Add Successful", anime: response };
    };

    return {
        customAnime,
        getCustomAnime,
        addCustomAnime,
        mutate,
    };
}
