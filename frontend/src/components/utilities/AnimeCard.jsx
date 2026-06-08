import { useModal } from "../../contexts/ModalCtx";
import { useUserAnime } from "../../hooks/useUserAnime";
import AnimeModal from "../modals/AnimeModal";
import classes from "./AnimeCard.module.css";
import Tag from "./Tag";

const AnimeCard = ({ anime }) => {
    const { showModal } = useModal();
    const { getAnime } = useUserAnime();

    const handleClick = () => {
        showModal(AnimeModal, { anime: anime });
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
