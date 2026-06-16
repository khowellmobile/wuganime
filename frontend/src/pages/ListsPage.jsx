import classes from "./ListsPage.module.css";

import { useFetchAnime } from "../hooks/useFetchAnime";
import { useUserAnime } from "../hooks/useUserAnime";
import CardList from "../components/misc/CardList";

const ListsPage = () => {
    const { getUserAnimesByStatus } = useUserAnime();

    const watchingList = getUserAnimesByStatus("WATCHING");
    const upNextList = getUserAnimesByStatus("UP_NEXT");
    const toWatchList = getUserAnimesByStatus("TO_WATCH");
    const watchedList = getUserAnimesByStatus("WATCHED");
    const dnfList = getUserAnimesByStatus("DNF");

    return (
        <div className={classes.mainContainer}>
            <CardList title={"Watching"} list={watchingList} />
            <CardList title={"Up Next"} list={upNextList} />
            <CardList title={"To Watch"} list={toWatchList} />
            <CardList title={"Watched"} list={watchedList} />
            <CardList title={"Did Not Finish"} list={dnfList} />
        </div>
    );
};

export default ListsPage;
