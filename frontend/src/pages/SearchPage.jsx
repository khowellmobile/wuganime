import { useEffect, useState } from "react";
import classes from "./SearchPage.module.css";

import { useFetchAnime } from "../hooks/useFetchAnime";
import Dropdown from "../components/utilities/Dropdown";
import SearchBox from "../components/utilities/SearchBox";
import AnimeCard from "../components/cards/AnimeCard";

const SearchPage = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedTerm, setDebouncedTerm] = useState("");

    const [statusLabel, setStatusLabel] = useState({ label: "None", value: "" });
    const [tagLabel, setTagLabel] = useState({ label: "None", value: "" });

    const {
        animeList: animelist,
        isLoading: isLoading,
        refreshAnime: refreshAnime,
    } = useFetchAnime({ searchTerm: debouncedTerm, statusFilter: statusLabel.value });

    const statusOptions = [
        { label: "Watching", value: "WATCHING" },
        { label: "Up Next", value: "UP_NEXT" },
        { label: "To Watch", value: "TO_WATCH" },
        { label: "Watched", value: "WATCHED" },
        { label: "Did Not Finish", value: "DNF" },
        { label: "None", value: "" },
    ];
    const tagOptions = [{ label: "Action" }, { label: "Drama" }, { label: "" }];

    const onStatusSelect = (option) => {
        setStatusLabel(option);
    };

    const onTagSelect = (option) => {
        setTagLabel(option);
    };

    const onSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 500);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    return (
        <div className={classes.mainContainer}>
            <div className={classes.tools}>
                <SearchBox
                    onChange={onSearchChange}
                    customStyle={{ width: "25rem", fontSize: "0.8rem" }}
                    placeholder={"Search"}
                />
                <div className={classes.filters}>
                    <p>Filter By:</p>

                    <div className={classes.filter}>
                        <p>Status</p>
                        <Dropdown options={statusOptions} onSelect={onStatusSelect} label={statusLabel.label} />
                    </div>
                    <div className={classes.filter}>
                        <p>Tag</p>
                        <Dropdown options={tagOptions} onSelect={onTagSelect} label={tagLabel.label} />
                    </div>
                </div>
            </div>
            <div className={classes.results}>
                {animelist?.length > 0 &&
                    animelist.map((value, index) => <AnimeCard key={`${value}-${index}`} anime={value} />)}
            </div>
        </div>
    );
};

export default SearchPage;
