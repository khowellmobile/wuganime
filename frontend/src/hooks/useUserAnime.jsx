import useSWR from "swr";
import { useCallback } from "react";

import { api } from "../Client";
import { normalizeAnimeList } from "../utils/animeNormalizer";
import { useAuth } from "./useAuth";

export function useUserAnime() {
    const { isAuthenticated } = useAuth();

    const { data, mutate, error } = useSWR(isAuthenticated ? ["/api/user-anime/"] : null, ([url]) => api.get(url));

    const userAnime = normalizeAnimeList(data);

    const getAnime = useCallback(
        (id) => {
            return userAnime.find((item) => item.id === id) || null;
        },
        [userAnime],
    );

    const getIdsByStatus = (status) => {
        return userAnime.filter((item) => item.user_status === status).map((item) => item.id);
    };

    const setStatus = async (animeId, status, extraData = {}) => {
        try {
            await api.post("/api/user-anime/set-status/", {
                anime: animeId,
                status: status,
                ...extraData,
            });

            // Re-fetch the anime list so the UI updates globally
            await mutate();
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    return { getAnime, userAnime, mutate, setStatus };
}
