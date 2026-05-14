import useSWR from "swr";
import { useEffect, useState, useCallback } from "react";

import { api } from "../Client";
import { useAnime } from "./useAnime";
import { useAuth } from "./useAuth";

export function useUserAnime() {
    const { refreshAnime } = useAnime();
    const { isAuthenticated } = useAuth();

    const { data, mutate, error } = useSWR(isAuthenticated ? ["/api/user-anime/"] : null, ([url]) => api.get(url));

    const userAnime = data || [];

    useEffect(() => {
        console.log(userAnime);
    }, [userAnime]);

    const getAnime = useCallback(
        (id) => {
            const userAnimeItem = userAnime.find((item) => item.anime === id);
            return { ...userAnimeItem?.anime_details, user_status: userAnimeItem?.status } || null;
        },
        [userAnime],
    );

    const getIdsByStatus = (status) => {
        return userAnime.filter((item) => item.status === status).map((item) => item.anime);
    };

    const setStatus = async (animeId, status, extraData = {}) => {
        try {
            await api.post("/api/user-anime/set-status/", {
                anime: animeId,
                status: status,
                ...extraData,
            });

            // Re-fetch the anime list so the UI updates globally
            await refreshAnime();
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    return { getAnime, userAnime, mutate, setStatus };
}
