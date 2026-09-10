import CardList from "../components/misc/CardList";
import { useFetchLibrary } from "../hooks/useFetchLibrary";
import { useUserAnime } from "../hooks/useUserAnime";
import classes from "./HomePage.module.css";

const HomePage = () => {
    const { userAnime } = useUserAnime();

    const {
        libraryList: animeList1,
    } = useFetchLibrary({ tags: ["Drama"] });
    const {
        libraryList: animeList2,
    } = useFetchLibrary({ tags: ["Adventure"] });
    const {
        libraryList: animeList3,
    } = useFetchLibrary({ tags: ["Action"] });

    return (
        <div className={classes.mainContainer}>
            <CardList title={"Your List"} list={userAnime} />
            <CardList title={"Drama"} list={animeList1} />
            <CardList title={"Adventure"} list={animeList2} />
            <CardList title={"Action"} list={animeList3} />
        </div>
    );
};

export default HomePage;
