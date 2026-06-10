const UNCATEGORIZED_STATUS = "UNCATEGORIZED";

export function normalizeAnime(rawAnime) {
    if (!rawAnime || typeof rawAnime !== "object") {
        return null;
    }

    const animeDetails = rawAnime.anime_details;
    const isUserAnimeRecord = animeDetails && typeof animeDetails === "object";
    const sourceAnime = isUserAnimeRecord ? animeDetails : rawAnime;
    const animeId = sourceAnime.id ?? rawAnime.anime;

    if (animeId == null) {
        return null;
    }

    return {
        ...sourceAnime,
        id: animeId,
        user_status: sourceAnime.user_status ?? rawAnime.status ?? UNCATEGORIZED_STATUS,
    };
}

export function normalizeAnimeList(list) {
    if (!Array.isArray(list)) {
        return [];
    }

    return list.map(normalizeAnime).filter(Boolean);
}
