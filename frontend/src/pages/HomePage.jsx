import CardList from "../components/misc/CardList";
import AnimeCard from "../components/utilities/AnimeCard";
import { useUserAnime } from "../hooks/useUserAnime";
import classes from "./HomePage.module.css";

const HomePage = () => {
    const { userAnime } = useUserAnime();

    const list4 = [1, 2, 3];

    return (
        <div className={classes.mainContainer}>
            <CardList title={"To Watch"} list={list4} />
        </div>
    );
};

export default HomePage;
