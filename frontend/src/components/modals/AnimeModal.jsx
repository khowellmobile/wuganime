import { useAnime } from "../../hooks/useAnime";
import classes from "./AnimeModal.module.css";

const AnimeModal = ({ id, closeModal }) => {
    const { getAnime } = useAnime();

    const anime = getAnime(id);

    console.log(id, anime);

    return (
        <div className={classes.modalOverlay} onClick={closeModal}>
            <div className={classes.mainContainer} onClick={(e) => e.stopPropagation()}>
                <p>{id}</p>
            </div>
        </div>
    );
};

export default AnimeModal;
