import CardList from "../components/misc/CardList";
import AnimeCard from "../components/utilities/AnimeCard";
import { useFetchAnime } from "../hooks/useFetchAnime";
import { useUserAnime } from "../hooks/useUserAnime";
import classes from "./HomePage.module.css";

const HomePage = () => {
    const { userAnime } = useUserAnime();

    const {
        animeList: animeList1,
        isLoading: isLoading1,
        refreshAnime: refreshAnime1,
    } = useFetchAnime({ tags: ["drama"] });
    const {
        animeList: animeList2,
        isLoading: isLoading2,
        refreshAnime: refreshAnime2,
    } = useFetchAnime({ tags: ["Drama"] });
    const {
        animeList: animeList3,
        isLoading: isLoading3,
        refreshAnime: refreshAnime3,
    } = useFetchAnime({ tags: ["drama"] });

    console.log(animeList1);

    return (
        <div className={classes.mainContainer}>
            <CardList title={"To Watch"} list={animeList1} />
            <CardList title={"Drama"} list={animeList1} />
            <CardList title={"Adventure"} list={animeList2} />
            <CardList title={"Action"} list={animeList3} />
        </div>
    );
};

export default HomePage;
