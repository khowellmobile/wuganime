import { useEffect, useRef, useState } from "react";

import classes from "./AnimeModal.module.css";

import { useUserAnime } from "../../hooks/useUserAnime";
import Tag from "../utilities/Tag";
import Dropdown from "../utilities/Dropdown";
import exitIcon from "../../assets/cancel-icon.svg";
import chevDown from "../../assets/chevron-down-icon-white.svg";
import NoImageDisplay from "../misc/NoImageDisplay";

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

const EPISODE_UPDATE_DEBOUNCE_MS = 400;

const AnimeModal = ({ anime, closeModal }) => {
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

    return (
        <div className={classes.modalOverlay} onClick={closeModal}>
            <div className={classes.mainContainer} onClick={(e) => e.stopPropagation()}>
                <div className={classes.leftDiv}>
                    <div className={classes.animeInfoDiv}>
                        <div className={classes.exitDiv} onClick={closeModal}>
                            <img className={classes.icon} src={exitIcon} />
                        </div>
                        <div className={classes.picture}>
                            {!hasImageError && anime?.image_url ? (
                                <img className={classes.animeImg} src={anime.image_url} />
                            ) : (
                                <NoImageDisplay />
                            )}
                        </div>
                        <div className={classes.properties}>
                            <h2>{anime?.title}</h2>
                            <p>{anime?.stars}</p>
                            <div className={classes.tags}>
                                {anime?.tags?.length > 0 &&
                                    anime?.tags.map((tag, index) => <Tag tag={tag} key={index} />)}
                            </div>
                            <Dropdown
                                options={ANIME_STATUS_OPTIONS}
                                onSelect={changeLabel}
                                label={VALUES_TO_LABELS[activeStatus]}
                            />
                            <p className={classes.counterLabel}>Episodes Watched:</p>
                            <div className={classes.episodeCounter}>
                                <div onClick={() => changeEpisodesWatched(episodesWatched - 1)}>
                                    <img className={classes.chev} src={chevDown} />
                                </div>
                                <p>
                                    {episodesWatched} / {anime?.episodes}
                                </p>
                                <div onClick={() => changeEpisodesWatched(episodesWatched + 1)}>
                                    <img className={classes.chev} src={chevDown} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={classes.descDiv}>
                        <p>{anime?.synopsis}</p>
                    </div>
                </div>
                <div className={classes.rightDiv}></div>
            </div>
        </div>
    );
};

export default AnimeModal;
