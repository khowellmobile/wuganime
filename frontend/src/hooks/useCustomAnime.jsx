import useSWR from "swr";

import { api } from "../Client";
import { normalizeAnimeList } from "../utils/animeNormalizer";
import { useAuth } from "./useAuth";

export function useCustomAnime() {
    const { isAuthenticated } = useAuth();

    const { data, mutate } = useSWR(isAuthenticated ? ["/api/custom-anime/"] : null, ([url]) => api.get(url));

    const customAnime = normalizeAnimeList(data);

    return {
        customAnime,
        mutate,
    };
}
