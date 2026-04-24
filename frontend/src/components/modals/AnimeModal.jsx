import classes from "./AnimeModal.module.css";

const AnimeModal = ({ title, closeModal }) => {
    return (
        <div className={classes.modalOverlay} onClick={closeModal}>
            <div className={classes.mainContainer} onClick={(e) => e.stopPropagation()}></div>
        </div>
    );
};

export default AnimeModal;
