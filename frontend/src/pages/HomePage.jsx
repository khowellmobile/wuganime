import CardList from "../components/misc/CardList";
import AnimeCard from "../components/utilities/AnimeCard";
import classes from "./HomePage.module.css";

const HomePage = () => {
    const list1 = [1, 2, 3, 4, 5, 6];

    const list2 = [7, 8, 9, 10, 11, 12, 13];

    const list3 = [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];

    return (
        <div className={classes.mainContainer}>
            <CardList title={"Currently Reading"} list={list1} />
            <CardList title={"Already Read"} list={list2} />
            <CardList title={"Reccomendations"} list={list3} />
        </div>
    );
};

export default HomePage;
