import useSWR from "swr";

import { api } from "../Client";
import { normalizeAnimeList } from "../utils/animeNormalizer";
import { useAuth } from "./useAuth";

export function useUserAnime() {
    const { isAuthenticated } = useAuth();

    const { data, mutate } = useSWR(isAuthenticated ? ["/api/user-anime/"] : null, ([url]) => api.get(url));

    const userAnime = normalizeAnimeList(data);

    const getUserAnimesByStatus = (status) => {
        return normalizeAnimeList(userAnime.filter((item) => item.user_status === status));
    };

    const getUserAnimeSortedByStatus = () => {
        const order = ["WATCHING", "UP_NEXT", "TO_WATCH", "WATCHED", "DNF"];

        return [...userAnime].sort((a, b) => {
            return order.indexOf(a.user_status) - order.indexOf(b.user_status);
        });
    };

    return { userAnime, mutate, getUserAnimesByStatus, getUserAnimeSortedByStatus };
}
