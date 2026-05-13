import { api } from "../Client";
import { useAnime } from "./useAnime";

export function useUserAnime() {
    const { refreshAnime } = useAnime();

    const setStatus = async (animeId, status, extraData = {}) => {
        console.log(animeId, status, extraData);

        try {
            await api.post("/api/user-anime/set-status/", {
                anime: animeId,
                status: status,
                ...extraData
            });
            
            // Re-fetch the anime list so the UI updates globally
            await refreshAnime(); 
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    return { setStatus };
}