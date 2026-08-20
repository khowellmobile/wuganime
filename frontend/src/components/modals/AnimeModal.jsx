import { useIsMobile } from "../../hooks/useIsMobile";
import AnimeModalMobile from "./submodals/AnimeModalMobile";
import AnimeModalDesktop from "./submodals/AnimeModalDesktop";

const ANIME_STATUS_OPTIONS = [
    { label: "Watching", value: "WATCHING" },
    { label: "Watched", value: "WATCHED" },
    { label: "To Watch", value: "TO_WATCH" },
    { label: "Up Next", value: "UP_NEXT" },
    { label: "Did Not Finish", value: "DNF" },
    { label: "Uncategorized", value: "UNCATEGORIZED" },
];

const VALUES_TO_LABELS = {
    WATCHING: "Watching",
    WATCHED: "Watched",
    TO_WATCH: "To Watch",
    UP_NEXT: "Up Next",
    DNF: "Did Not Finish",
    UNCATEGORIZED: "Uncategorized",
};

const AnimeModal = ({ anime, closeModal }) => {
    const isMobile = useIsMobile(768);

    console.log(isMobile);

    return isMobile ? (
        <AnimeModalMobile anime={anime} closeModal={closeModal} />
    ) : (
        <AnimeModalDesktop anime={anime} closeModal={closeModal} />
    );
};

export default AnimeModal;
