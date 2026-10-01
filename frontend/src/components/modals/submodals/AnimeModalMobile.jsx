import classes from "./AnimeModalMobile.module.css";

import { useAnimeModalState } from "../../../hooks/useAnimeModalState";
import { useAnimeLookup } from "../../../hooks/useAnimeLookup";
import { useModal } from "../../../contexts/ModalCtx";
import Tag from "../../utilities/Tag";
import Dropdown from "../../utilities/Dropdown";
import NoImageDisplay from "../../misc/NoImageDisplay";
import chevDown from "../../../assets/chevron-down-icon-white.svg";
import editIcon from "../../../assets/pen-icon.svg";
import CustomAnimeFormModal from "../CustomAnimeFormModal";

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

const AnimeModalMobile = ({ anime, closeModal }) => {
    const { activeStatus, episodesWatched, hasImageError, changeLabel, changeEpisodesWatched } =
        useAnimeModalState(anime);

    const { showModal } = useModal();
    const { getCustomAnime, getUserAnime } = useAnimeLookup();

    const handleClick = () => {
        const freshAnime = anime.is_custom ? getCustomAnime(anime.id) : getUserAnime(anime.id);
        showModal(CustomAnimeFormModal, { anime: freshAnime ?? anime });
    };

    return (
        <div className={classes.mainContainer}>
            <div className={classes.toolBar}>
                <div className={classes.tool} style={{ transform: "rotate(90deg)" }} onClick={closeModal}>
                    <img src={chevDown} />
                </div>
                {anime.is_custom && (
                    <div className={classes.tool} onClick={handleClick}>
                        <img src={editIcon} />
                    </div>
                )}
            </div>
            <div className={classes.genInfo}>
                <div className={classes.picture}>
                    {!hasImageError && anime?.image_url ? (
                        <img className={classes.animeImg} src={anime.image_url} />
                    ) : (
                        <NoImageDisplay />
                    )}
                </div>
                <div className={classes.info}>
                    <h2>{anime?.title}</h2>
                    {anime?.episodes && <p>Episodes: {anime?.episodes}</p>}
                </div>
            </div>
            <div className={classes.tagsContainer}>
                <div className={classes.tags}>
                    {anime?.tags?.length > 0 && anime?.tags.map((tag, index) => <Tag tag={tag} key={index} />)}
                </div>
            </div>
            <div className={classes.status}>
                <Dropdown
                    options={ANIME_STATUS_OPTIONS}
                    onSelect={changeLabel}
                    label={VALUES_TO_LABELS[activeStatus]}
                />
                {anime?.episodes && (
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
                )}
            </div>
            <div className={classes.synopsis}>
                <h2>Description</h2>
                <p>{anime?.synopsis}</p>
            </div>
        </div>
    );
};

export default AnimeModalMobile;
