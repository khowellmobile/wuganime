import { useEffect, useState } from "react";

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

const AnimeModal = ({ anime, closeModal }) => {
    const { updateUserAnime } = useUserAnime();

    const [activeStatus, setActiveStatus] = useState(anime?.user_status ?? "UNCATEGORIZED");
    const [hasImageError, setHasImageError] = useState(false);

    const changeLabel = async (option) => {
        if (activeStatus !== option.value) {
            const res = await updateUserAnime(anime.id, { status: option.value });
            if (res.success) {
                setActiveStatus(res?.anime_status);
            }
        }
    };

    useEffect(() => {
        setActiveStatus(anime?.user_status ?? "UNCATEGORIZED");
        setHasImageError(false);
    }, [anime]);

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
                                <div>
                                    <img className={classes.chev} src={chevDown} />
                                </div>
                                <p>
                                    {anime?.episodes_watched} / {anime?.episodes}
                                </p>
                                <div>
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
