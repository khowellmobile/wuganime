import CardList from "../components/misc/CardList";
import AnimeCard from "../components/utilities/AnimeCard";
import classes from "./HomePage.module.css";

const HomePage = () => {
    const list1 = [
        { title: "Babel", stars: "★★★★★" },
        { title: "The Seven Husbands of Evelyn Hugo", stars: "★★★★" },
        { title: "Dark Matter", stars: "★★★★★" },
        { title: "The Silent Patient", stars: "★★★" },
        { title: "Circe", stars: "★★★★" },
        { title: "The Midnight Library", stars: "★★★" },
    ];

    const list2 = [
        { title: "Red Rising", stars: "★★★★" },
        { title: "The Way of Kings", stars: "★★★★★" },
        { title: "Neuromancer", stars: "★★★★" },
        { title: "Foundation", stars: "★★★" },
        { title: "Dune", stars: "★★★★★" },
        { title: "The Name of the Wind", stars: "★★★★★" },
        { title: "Piranesi", stars: "★★★★" },
    ];

    const list3 = [
        { title: "Of Mice and Men", stars: "★★★" },
        { title: "Blood Over Brighthaven", stars: "★★" },
        { title: "Project Hail Mary", stars: "★★★★" },
        { title: "1984", stars: "★★★★★" },
        { title: "The Hobbit", stars: "★★★★★" },
        { title: "Tomorrow, and Tomorrow, and Tomorrow", stars: "★★★★" },
        { title: "The Great Gatsby", stars: "★★★" },
        { title: "Flowers for Algernon", stars: "★★★★★" },
        { title: "Of Mice and Men", stars: "★★★" },
        { title: "Blood Over Brighthaven", stars: "★★" },
        { title: "Project Hail Mary", stars: "★★★★" },
        { title: "1984", stars: "★★★★★" },
        { title: "The Hobbit", stars: "★★★★★" },
        { title: "Tomorrow, and Tomorrow, and Tomorrow", stars: "★★★★" },
        { title: "The Great Gatsby", stars: "★★★" },
        { title: "Flowers for Algernon", stars: "★★★★★" },
    ];

    return (
        <div className={classes.mainContainer}>
            <CardList title={"Currently Reading"} list={list1} />
            <CardList title={"Already Read"} list={list2} />
            <CardList title={"Reccomendations"} list={list3} />
        </div>
    );
};

export default HomePage;
