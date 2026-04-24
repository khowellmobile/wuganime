import { createContext, useEffect, useState, useCallback } from "react";

const AnimeCtx = createContext({
    ctxAnimeList: null,
    getAnime: () => {},
});

export function AnimeCtxProvider(props) {
    const [ctxAnimeList, setCtxAnimeList] = useState([]);

    useEffect(() => {
        setCtxAnimeList([
            { id: 1, title: "Babel", stars: "★★★★★", tags: ["css", "idea", "goal"] },
            {
                id: 2,
                title: "The Seven Husbands of Evelyn Hugo",
                stars: "★★★★",
                tags: ["monochrome", "research"],
            },
            { id: 3, title: "Dark Matter", stars: "★★★★★", tags: ["ai", "problem", "idea"] },
            { id: 4, title: "The Silent Patient", stars: "★★★", tags: ["question", "research"] },
            { id: 5, title: "Circe", stars: "★★★★", tags: ["goal", "important"] },
            { id: 6, title: "The Midnight Library", stars: "★★★", tags: ["idea", "fix"] },
            { id: 7, title: "Red Rising", stars: "★★★★", tags: ["goal", "problem"] },
            { id: 8, title: "The Way of Kings", stars: "★★★★★", tags: ["important", "database"] },
            { id: 9, title: "Neuromancer", stars: "★★★★", tags: ["ai", "javascript", "vscode"] },
            { id: 10, title: "Foundation", stars: "★★★", tags: ["research", "python"] },
            { id: 11, title: "Dune", stars: "★★★★★", tags: ["important", "idea", "goal"] },
            { id: 12, title: "The Name of the Wind", stars: "★★★★★", tags: ["research", "example"] },
            { id: 13, title: "Piranesi", stars: "★★★★", tags: ["question", "monochrome"] },
            { id: 14, title: "Of Mice and Men", stars: "★★★", tags: ["monochrome", "problem"] },
            { id: 15, title: "Blood Over Brighthaven", stars: "★★", tags: ["correction", "research"] },
            { id: 16, title: "Project Hail Mary", stars: "★★★★", tags: ["solution", "ai", "goal"] },
            { id: 17, title: "1984", stars: "★★★★★", tags: ["important", "problem"] },
            { id: 18, title: "The Hobbit", stars: "★★★★★", tags: ["goal", "example"] },
            {
                id: 19,
                title: "Tomorrow, and Tomorrow, and Tomorrow",
                stars: "★★★★",
                tags: ["react", "javascript", "idea"],
            },
            { id: 20, title: "The Great Gatsby", stars: "★★★", tags: ["monochrome", "important"] },
            { id: 21, title: "Flowers for Algernon", stars: "★★★★★", tags: ["research", "improvement"] },
            { id: 22, title: "Of Mice and Men", stars: "★★★", tags: ["monochrome", "problem"] },
            { id: 23, title: "Blood Over Brighthaven", stars: "★★", tags: ["correction", "research"] },
            { id: 24, title: "Project Hail Mary", stars: "★★★★", tags: ["solution", "ai", "goal"] },
            { id: 25, title: "1984", stars: "★★★★★", tags: ["important", "problem"] },
            { id: 26, title: "The Hobbit", stars: "★★★★★", tags: ["goal", "example"] },
            {
                id: 27,
                title: "Tomorrow, and Tomorrow, and Tomorrow",
                stars: "★★★★",
                tags: ["react", "javascript", "idea"],
            },
            { id: 28, title: "The Great Gatsby", stars: "★★★", tags: ["monochrome", "important"] },
            { id: 29, title: "Flowers for Algernon", stars: "★★★★★", tags: ["research", "improvement"] },
        ]);
    }, []);

    const getAnime = useCallback(
        (id) => {
            return ctxAnimeList.find((anime) => anime.id === id);
        },
        [ctxAnimeList],
    );

    const context = {
        ctxAnimeList,
        getAnime
    };

    return <AnimeCtx.Provider value={context}>{props.children}</AnimeCtx.Provider>;
}

export default AnimeCtx;
