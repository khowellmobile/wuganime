import useSWR from "swr";

import { ApiError, api } from "../Client";
import { useAuth } from "./useAuth";

export function useFetchAnime() {
    const { isAuthenticated } = useAuth();

    const { data, mutate, error } = useSWR(isAuthenticated ? ["/api/anime/"] : null, ([url]) => api.get(url));

    return {
        animeList: data || [],
        isLoading: !error && !data,
        refreshAnime: mutate,
    };
}
