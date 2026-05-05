import useSWR from "swr";

import { ApiError, api } from "../Client";
import { useAuth } from "./useAuth";

export function useFetchAnime(accessToken) {
    const { isAuthenticated } = useAuth();

    const { data, mutate, error } = useSWR(isAuthenticated ? ["/api/anime/"] : null, ([url]) => api.get(url));

    console.log(data);

    return {
        animeList: data || [],
        isLoading: !error && !data,
        mutate,
    };
}
