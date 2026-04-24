import { useContext } from "react";
import AnimeCtx from "../contexts/AnimeCtx";

export function useAnime() {
    const context = useContext(AnimeCtx);

    if (!context) {
        throw new Error("useAnime must be used within an AnimeCtxProvider");
    }

    // Return the function directly from context
    return context.getAnime;
}
