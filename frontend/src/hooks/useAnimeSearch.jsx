import { useEffect, useState, useMemo } from "react";
import { useFetchAnime } from "./useFetchAnime";

export function useAnimeSearch() {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedTerm, setDebouncedTerm] = useState("");
    const [filters, setFilters] = useState({
        status: { label: "None", value: "" },
        tags: { label: "None", value: "" },
    });

    const shouldSearch = useMemo(() => debouncedTerm.trim().length > 0, [debouncedTerm]);

    const {
        animeList: animelist,
        isLoading,
        refreshAnime,
    } = useFetchAnime({
        searchTerm: debouncedTerm,
        statusFilter: filters?.status?.value,
        tags: filters?.tags?.value ? [filters.tags.value] : [],
        enabled: shouldSearch,
    });

    const trimmedSearch = searchTerm.trim();
    const trimmedDebounced = debouncedTerm.trim();

    const isDebouncing = trimmedSearch !== trimmedDebounced;
    const hasInput = trimmedSearch.length > 0;
    const hasSettledQuery = trimmedDebounced.length > 0;

    const showLoading = hasInput && (isDebouncing || isLoading);

    const statusOptions = [
        { label: "Watching", value: "WATCHING" },
        { label: "Up Next", value: "UP_NEXT" },
        { label: "To Watch", value: "TO_WATCH" },
        { label: "Watched", value: "WATCHED" },
        { label: "Did Not Finish", value: "DNF" },
        { label: "None", value: "" },
    ];
    const tagOptions = [
        { label: "Action", value: "Action" },
        { label: "Drama", value: "Drama" },
        { label: "None", value: "" },
    ];

    const onSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const onFilterSelect = (filterKey) => (option) => {
        setFilters((prev) => ({
            ...prev,
            [filterKey]: option,
        }));
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 500);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    return {
        animelist,
        isLoading,
        showLoading,
        hasSettledQuery,
        searchTerm,
        onSearchChange,
        statusLabel: filters?.status,
        tagLabel: filters?.tags,
        onFilterSelect,
        statusOptions,
        tagOptions,
        refreshAnime,
    };
}
