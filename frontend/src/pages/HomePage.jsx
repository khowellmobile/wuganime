import CardList from "../components/misc/CardList";
import AnimeCard from "../components/utilities/AnimeCard";
import classes from "./HomePage.module.css";

const HomePage = () => {
    const list1 = [
        { title: "Babel", stars: "★★★★★", tags: ["css", "idea", "goal"] },
        { title: "The Seven Husbands of Evelyn Hugo", stars: "★★★★", tags: ["monochrome", "research"] },
        { title: "Dark Matter", stars: "★★★★★", tags: ["ai", "problem", "idea"] },
        { title: "The Silent Patient", stars: "★★★", tags: ["question", "research"] },
        { title: "Circe", stars: "★★★★", tags: ["goal", "important"] },
        { title: "The Midnight Library", stars: "★★★", tags: ["idea", "fix"] },
    ];

    const list2 = [
        { title: "Red Rising", stars: "★★★★", tags: ["goal", "problem"] },
        { title: "The Way of Kings", stars: "★★★★★", tags: ["important", "database"] },
        { title: "Neuromancer", stars: "★★★★", tags: ["ai", "javascript", "vscode"] },
        { title: "Foundation", stars: "★★★", tags: ["research", "python"] },
        { title: "Dune", stars: "★★★★★", tags: ["important", "idea", "goal"] },
        { title: "The Name of the Wind", stars: "★★★★★", tags: ["research", "example"] },
        { title: "Piranesi", stars: "★★★★", tags: ["question", "monochrome"] },
    ];

    const list3 = [
        { title: "Of Mice and Men", stars: "★★★", tags: ["monochrome", "problem"] },
        { title: "Blood Over Brighthaven", stars: "★★", tags: ["correction", "research"] },
        { title: "Project Hail Mary", stars: "★★★★", tags: ["solution", "ai", "goal"] },
        { title: "1984", stars: "★★★★★", tags: ["important", "problem"] },
        { title: "The Hobbit", stars: "★★★★★", tags: ["goal", "example"] },
        { title: "Tomorrow, and Tomorrow, and Tomorrow", stars: "★★★★", tags: ["react", "javascript", "idea"] },
        { title: "The Great Gatsby", stars: "★★★", tags: ["monochrome", "important"] },
        { title: "Flowers for Algernon", stars: "★★★★★", tags: ["research", "improvement"] },
        { title: "Of Mice and Men", stars: "★★★", tags: ["monochrome", "problem"] },
        { title: "Blood Over Brighthaven", stars: "★★", tags: ["correction", "research"] },
        { title: "Project Hail Mary", stars: "★★★★", tags: ["solution", "ai", "goal"] },
        { title: "1984", stars: "★★★★★", tags: ["important", "problem"] },
        { title: "The Hobbit", stars: "★★★★★", tags: ["goal", "example"] },
        { title: "Tomorrow, and Tomorrow, and Tomorrow", stars: "★★★★", tags: ["react", "javascript", "idea"] },
        { title: "The Great Gatsby", stars: "★★★", tags: ["monochrome", "important"] },
        { title: "Flowers for Algernon", stars: "★★★★★", tags: ["research", "improvement"] },
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
