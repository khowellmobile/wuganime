import { useEffect, useRef, useState } from "react";

import { useUserAnime } from "./useUserAnime";

const EPISODE_UPDATE_DEBOUNCE_MS = 400;

export function useAnimeModalState(anime) {
    const { updateUserAnime } = useUserAnime();
    const episodeDebounceRef = useRef(null);

    const [activeStatus, setActiveStatus] = useState(anime?.user_status ?? "UNCATEGORIZED");
    const [episodesWatched, setEpisodesWatched] = useState(anime?.episodes_watched ?? 0);
    const [hasImageError, setHasImageError] = useState(false);

    const changeLabel = async (option) => {
        if (activeStatus !== option.value) {
            const res = await updateUserAnime(anime.id, { status: option.value });
            if (res.success) {
                setActiveStatus(res?.anime_status);
            }
        }
    };

    const changeEpisodesWatched = async (number) => {
        const maxEpisodes = anime?.episodes ?? Number.POSITIVE_INFINITY;
        const nextEpisodesWatched = Math.max(0, Math.min(number, maxEpisodes));

        setEpisodesWatched(nextEpisodesWatched);

        if (episodeDebounceRef.current) {
            clearTimeout(episodeDebounceRef.current);
        }

        episodeDebounceRef.current = setTimeout(async () => {
            const payload = { episodes_watched: nextEpisodesWatched };

            if (activeStatus === "UNCATEGORIZED") {
                payload.status = "WATCHING";
            }

            const res = await updateUserAnime(anime.id, payload);

            if (!res.success) {
                setEpisodesWatched(anime?.episodes_watched ?? 0);
                return;
            }

            if (res?.anime_status && activeStatus !== res.anime_status) {
                setActiveStatus(res.anime_status);
            }
        }, EPISODE_UPDATE_DEBOUNCE_MS);
    };

    useEffect(() => {
        setActiveStatus(anime?.user_status ?? "UNCATEGORIZED");
        setEpisodesWatched(anime?.episodes_watched ?? 0);
        setHasImageError(false);
    }, [anime]);

    useEffect(() => {
        return () => {
            if (episodeDebounceRef.current) {
                clearTimeout(episodeDebounceRef.current);
            }
        };
    }, []);

    return {
        activeStatus,
        episodesWatched,
        hasImageError,
        setHasImageError,
        changeLabel,
        changeEpisodesWatched,
    };
}
