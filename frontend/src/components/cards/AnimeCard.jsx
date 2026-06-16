import { useModal } from "../../contexts/ModalCtx";
import AnimeModal from "../modals/AnimeModal";
import classes from "./AnimeCard.module.css";
import Tag from "../utilities/Tag";

const AnimeCard = ({ anime }) => {
    const { showModal } = useModal();

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
                        {anime?.tags?.slice(0, 3).map((tag, index) => (
                            <Tag tag={tag} key={index} />
                        ))}

                        {anime?.tags?.length > 3 && <span>+{anime.tags.length - 3}</span>}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AnimeCard;
