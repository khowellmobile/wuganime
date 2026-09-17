import { useSWRConfig } from "swr";
import { normalizeAnimeList } from "../utils/animeNormalizer";

export function useAnimeLookup() {
    const { cache } = useSWRConfig();

    const getUserAnime = (id) => {
        const data = cache.get(JSON.stringify(["/api/user-anime/"]))?.data;
        return normalizeAnimeList(data).find((item) => item.id === id) ?? null;
    };

    const getCustomAnime = (id) => {
        const data = cache.get(JSON.stringify(["/api/custom-anime/"]))?.data;
        return normalizeAnimeList(data).find((item) => item.id === id) ?? null;
    };

    return { getUserAnime, getCustomAnime };
}
