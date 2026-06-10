import { act, useState } from "react";

import classes from "./AnimeModal.module.css";

import Tag from "../utilities/Tag";
import Dropdown from "../utilities/Dropdown";
import { useUserAnime } from "../../hooks/useUserAnime";

const ANIME_STATUS_OPTIONS = [
    { label: "Watched", value: "WATCHED" },
    { label: "To Watch", value: "TO_WATCH" },
    { label: "Up Next", value: "UP_NEXT" },
    { label: "Did Not Finish", value: "DNF" },
    { label: "Uncategorized", value: "UNCATEGORIZED" },
];

const VALUES_TO_LABELS = {
    WATCHED: "Watched",
    TO_WATCH: "To Watch",
    UP_NEXT: "Up Next",
    DNF: "Did Not Finish",
    UNCATEGORIZED: "Uncategorized",
};

const AnimeModal = ({ anime, closeModal }) => {
    const { setStatus } = useUserAnime();
    const { getAnime } = useUserAnime();

    const activeLabel = VALUES_TO_LABELS[anime?.user_status] ?? VALUES_TO_LABELS.UNCATEGORIZED;

    const changeLabel = (option) => {
        if (anime?.user_status !== option.value) setStatus(anime.id, option.value);
    };

    return (
        <div className={classes.modalOverlay} onClick={closeModal}>
            <div className={classes.mainContainer} onClick={(e) => e.stopPropagation()}>
                <div className={classes.leftDiv}>
                    <div className={classes.topDiv}>
                        <div className={classes.picture}></div>
                        <div className={classes.properties}>
                            <h2>{anime?.title}</h2>
                            <p>{anime?.stars}</p>
                            <div className={classes.tags}>
                                {anime?.tags?.length > 0 &&
                                    anime?.tags.map((tag, index) => <Tag tag={tag} key={index} />)}
                            </div>
                            <Dropdown options={ANIME_STATUS_OPTIONS} onSelect={changeLabel} label={activeLabel} />
                        </div>
                    </div>
                    <div className={classes.bottomDiv}>
                        <p>{anime?.synopsis}</p>
                    </div>
                </div>
                <div className={classes.rightDiv}></div>
            </div>
        </div>
    );
};

export default AnimeModal;
