import { createContext, useCallback } from "react";

import { useFetchLibrary } from "../hooks/useFetchLibrary";

const defaultLibraryContext = {
    ctxLibraryList: null,
    getLibraryAnime: () => undefined,
    isLoading: false,
    refreshLibrary: async () => undefined,
};

const LibraryCtx = createContext(defaultLibraryContext);

export function LibraryCtxProvider({ children }) {
    const { libraryList, isLoading, refreshLibrary } = useFetchLibrary();

    const getLibraryAnime = useCallback(
        (id) => {
            if (id === null || id === undefined || !Array.isArray(libraryList)) {
                return undefined;
            }

            return libraryList.find((anime) => Number(anime.id) === Number(id));
        },
        [libraryList],
    );

    const context = {
        ctxLibraryList: libraryList,
        getLibraryAnime,
        isLoading,
        refreshLibrary,
    };

    return <LibraryCtx.Provider value={context}>{children}</LibraryCtx.Provider>;
}

export default LibraryCtx;
