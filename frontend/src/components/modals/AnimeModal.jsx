import classes from "./AnimeModal.module.css";

import { useAnime } from "../../hooks/useAnime";

import Tag from "../utilities/Tag";
import Dropdown from "../utilities/Dropdown";


const AnimeModal = ({ id, closeModal }) => {
    const { getAnime } = useAnime();

    const anime = getAnime(id);

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
                                    anime?.tags.map((tag, index) => <Tag tagName={tag} key={index} />)}
                            </div>
                            <Dropdown />
                        </div>
                    </div>
                    <div className={classes.bottomDiv}>
                        <p>
                            In a world where the gravity-defying sport of "Aero-Tag" determines the fate of entire
                            floating islands, Kaito, a spirited underdog with a mysterious past, dreams of joining the
                            elite Sky-Guard. Though he lacks the flashy gadgets of his rivals, Kaito possesses an
                            uncanny ability to read the wind currents that others ignore. Alongside his loyal crew of
                            misfits, he must master the ancient "Gale-Force" technique to protect his home from an
                            encroaching shadow and prove that true strength comes from the heart, not just the gear.
                        </p>
                    </div>
                </div>
                <div className={classes.rightDiv}></div>
            </div>
        </div>
    );
};

export default AnimeModal;
