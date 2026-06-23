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

    const getUserAnimesByStatus = (status) => {
        return normalizeAnimeList(userAnime.filter((item) => item.user_status === status));
    };

    const getUserAnimeSortedByStatus = () => {
        const order = ["WATCHING", "UP_NEXT", "TO_WATCH", "WATCHED", "DNF"];

        return [...userAnime].sort((a, b) => {
            return order.indexOf(a.user_status) - order.indexOf(b.user_status);
        });
    };

    const setStatus = async (animeId, status, extraData = {}) => {
        let response;
        try {
            response = await api.post("/api/user-anime/set-status/", {
                anime: animeId,
                status,
                ...extraData,
            });
        } catch (err) {
            console.error("Failed to update status", err);
            return { success: false, message: "Status Change Failed" };
        }

        try {
            await mutate();
        } catch (err) {
            console.warn("Status saved but list refresh failed", err);
        }

        return { success: true, message: "Status Change Successful", status: response.status };
    };

    return { getAnime, userAnime, mutate, setStatus, getUserAnimesByStatus, getUserAnimeSortedByStatus };
}
