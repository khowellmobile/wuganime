import { createContext, useEffect, useState, useCallback } from "react";
import { useFetchAnime } from "../hooks/useFetchAnime";

const AnimeCtx = createContext({
    ctxAnimeList: null,
    getAnime: () => {},
});

export function AnimeCtxProvider(props) {
    const { animeList, isLoading, mutate } = useFetchAnime();

    const getAnime = useCallback(
        (id) => {
            return animeList.find((anime) => anime.id == id);
        },
        [animeList],
    );

    const context = {
        ctxAnimeList: animeList,
        getAnime,
        isLoading,
        refreshAnime: mutate,
    };

    return <AnimeCtx.Provider value={context}>{props.children}</AnimeCtx.Provider>;
}

export default AnimeCtx;
