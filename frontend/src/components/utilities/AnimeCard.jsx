import { useModal } from "../../contexts/ModalCtx";
import { useAnime } from "../../hooks/useAnime";
import AnimeModal from "../modals/AnimeModal";
import classes from "./AnimeCard.module.css";
import Tag from "./Tag";

const AnimeCard = ({ id }) => {
    const { showModal } = useModal();
    const { getAnime } = useAnime();

    const anime = getAnime(id);

    const handleClick = () => {
        showModal(AnimeModal, { id: id });
    };

    return (
        <div className={classes.mainContainer} onClick={handleClick}>
            <section className={classes.pictureSection}></section>
            <section className={classes.textSection}>
                <div className={`${classes.titleDiv} ${classes.lineClamp}`}>
                    <p className={classes.title}>{anime?.title}</p>
                </div>
                <div className={classes.suppItems}>
                    <p>{anime?.stars}</p>
                    <div className={classes.tags}>
                        {anime?.tags?.length > 0 && anime?.tags.map((tag, index) => <Tag tag={tag} key={index} />)}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AnimeCard;
