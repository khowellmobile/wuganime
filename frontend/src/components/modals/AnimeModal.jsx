import { useIsMobile } from "../../hooks/useIsMobile";
import AnimeModalMobile from "./submodals/AnimeModalMobile";
import AnimeModalDesktop from "./submodals/AnimeModalDesktop";

const AnimeModal = ({ anime, closeModal }) => {
    const isMobile = useIsMobile(768);

    return isMobile ? (
        <AnimeModalMobile anime={anime} closeModal={closeModal} />
    ) : (
        <AnimeModalDesktop anime={anime} closeModal={closeModal} />
    );
};

export default AnimeModal;
