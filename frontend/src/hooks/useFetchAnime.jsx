import useSWR from "swr";

import { api } from "../Client";
import { normalizeAnimeList } from "../utils/animeNormalizer";
import { useAuth } from "./useAuth";

export function useFetchAnime({
    tags = [],
    searchTerm = "",
    typeFilter = "",
    statusFilter = "",
    page = 1,
    pageSize = 20,
    enabled = true,
} = {}) {
    const { isAuthenticated } = useAuth();

    const query = new URLSearchParams();
    tags.forEach((t) => query.append("tag", t));
    query.set("page", String(page));
    query.set("page_size", String(pageSize));

    const normalizedSearch = searchTerm.trim();
    const normalizedType = typeFilter.trim();
    const normalizedStatus = statusFilter.trim();

    if (normalizedSearch) {
        query.append("search", normalizedSearch);
    }

    if (normalizedType) {
        query.append("type", normalizedType);
    }

    if (normalizedStatus) {
        query.append("user_status", normalizedStatus);
    }

    const shouldFetch = isAuthenticated && enabled;
    const key = shouldFetch ? ["/api/anime/", query.toString()] : null;

    const { data, mutate, error } = useSWR(key, ([base, qs]) => api.get(`${base}?${qs}`));

    const animeListRaw = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
    const animeList = normalizeAnimeList(animeListRaw);

    return {
        animeList: animeList,
        isLoading: shouldFetch && !error && !data,
        pageCount: data?.count ?? animeList.length,
        nextPageUrl: data?.next ?? null,
        prevPageUrl: data?.previous ?? null,
        refreshAnime: mutate,
    };
}
