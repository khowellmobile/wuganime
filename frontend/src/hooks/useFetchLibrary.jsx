import useSWR from "swr";

import { api } from "../Client";
import { normalizeAnimeList } from "../utils/animeNormalizer";
import { useAuth } from "./useAuth";

export function useFetchLibrary({
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
    tags
        .map((t) => String(t).trim())
        .filter(Boolean)
        .forEach((t) => query.append("tags", t));
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
    const key = shouldFetch ? ["/api/library/", query.toString()] : null;

    const { data, mutate, error } = useSWR(key, ([base, qs]) => api.get(`${base}?${qs}`));

    const libraryListRaw = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
    const libraryList = normalizeAnimeList(libraryListRaw);

    return {
        libraryList,
        isLoading: shouldFetch && !error && !data,
        pageCount: data?.count ?? libraryList.length,
        nextPageUrl: data?.next ?? null,
        prevPageUrl: data?.previous ?? null,
        refreshLibrary: mutate,
    };
}

export default useFetchLibrary;
