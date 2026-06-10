import useSWR from "swr";

import { api } from "../Client";
import { normalizeAnimeList } from "../utils/animeNormalizer";
import { useAuth } from "./useAuth";

export function useFetchAnime({ tags = [], page = 1, pageSize = 20 } = {}) {
    const { isAuthenticated } = useAuth();

    const query = new URLSearchParams();
    tags.forEach((t) => query.append("tag", t));
    query.set("page", String(page));
    query.set("page_size", String(pageSize));

    const key = ["/api/anime/", query.toString()];

    const { data, mutate, error } = useSWR(isAuthenticated ? key : null, ([base, qs]) => api.get(`${base}?${qs}`));

    const animeListRaw = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
    const animeList = normalizeAnimeList(animeListRaw);

    return {
        animeList: animeList,
        isLoading: !error && !data,
        pageCount: data?.count ?? animeList.length,
        nextPageUrl: data?.next ?? null,
        prevPageUrl: data?.previous ?? null,
        refreshAnime: mutate,
    };
}
