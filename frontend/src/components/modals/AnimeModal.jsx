import classes from "./AnimeModal.module.css";

import { useAnime } from "../../hooks/useAnime";

import Tag from "../utilities/Tag";
import Dropdown from "../utilities/Dropdown";
import { useState } from "react";

const options = ["Watched", "To Watch", "Up Next", "Did Not Finish", ""];

const AnimeModal = ({ id, closeModal }) => {
    const { getAnime } = useAnime();

    const anime = getAnime(id);

    const [activelabel, setActiveLabel] = useState(anime?.status ?? "To Watch");

    const changeLabel = (label) => {
        setActiveLabel(label);
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
                            <Dropdown options={options} onSelect={changeLabel} label={activelabel} />
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
