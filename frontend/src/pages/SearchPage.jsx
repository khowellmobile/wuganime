import { useEffect, useMemo, useState } from "react";
import classes from "./SearchPage.module.css";

import { useFetchLibrary } from "../hooks/useFetchLibrary";
import Dropdown from "../components/utilities/Dropdown";
import SearchBox from "../components/utilities/SearchBox";
import AnimeCard from "../components/cards/AnimeCard";

import loadingIcon from "../assets/loading-icon.svg";

const SearchPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedTerm, setDebouncedTerm] = useState("");
    const [filters, setFilters] = useState({
        status: { label: "None", value: "" },
        tags: { label: "None", value: "" },
    });

    const shouldSearch = useMemo(() => debouncedTerm.trim().length > 0, [debouncedTerm]);

    const {
        libraryList,
        isLoading,
    } = useFetchLibrary({
        searchTerm: debouncedTerm,
        statusFilter: filters.status.value,
        tags: filters.tags.value ? [filters.tags.value] : [],
        enabled: shouldSearch,
    });

    const trimmedSearch = searchTerm.trim();
    const trimmedDebounced = debouncedTerm.trim();
    const showLoading = trimmedSearch.length > 0 && (trimmedSearch !== trimmedDebounced || isLoading);
    const hasSettledQuery = trimmedDebounced.length > 0;

    const statusOptions = [
        { label: "Watching", value: "WATCHING" },
        { label: "Up Next", value: "UP_NEXT" },
        { label: "To Watch", value: "TO_WATCH" },
        { label: "Watched", value: "WATCHED" },
        { label: "Did Not Finish", value: "DNF" },
        { label: "None", value: "" },
    ];
    const tagOptions = [
        { label: "Action", value: "Action" },
        { label: "Drama", value: "Drama" },
        { label: "None", value: "" },
    ];

    const onSearchChange = (event) => setSearchTerm(event.target.value);
    const onFilterSelect = (filterKey) => (option) => {
        setFilters((previous) => ({ ...previous, [filterKey]: option }));
    };

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedTerm(searchTerm), 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const renderResults = () => {
        if (showLoading) {
            return (
                <div className={classes.noResDisplay}>
                    <img className={classes.icon} src={loadingIcon} alt={"loading icon"} />
                </div>
            );
        }

        if (libraryList?.length > 0) {
            return (
                <div className={classes.results}>
                    {libraryList.map((value, index) => (
                        <AnimeCard key={`${value.id}-${index}`} anime={value} />
                    ))}
                </div>
            );
        }

        if (hasSettledQuery) {
            return (
                <div className={classes.noResDisplay}>
                    <p>We couldn't find any anime matching that name.</p>
                </div>
            );
        }

        return (
            <div className={classes.noResDisplay}>
                        <p>Find your next watch. Search for animes above.</p>
            </div>
        );
    };

    return (
        <div className={classes.mainContainer}>
            <div className={classes.tools}>
                <SearchBox onChange={onSearchChange} customStyle={{ fontSize: "0.8rem" }} placeholder={"Search"} />
                <div className={classes.filters}>
                    <p>Filter By:</p>

                    <div className={classes.filter}>
                        <p>Status</p>
                        <Dropdown
                            options={statusOptions}
                            onSelect={onFilterSelect("status")}
                            label={filters.status.label}
                        />
                    </div>
                    <div className={classes.filter}>
                        <p>Tag</p>
                        <Dropdown options={tagOptions} onSelect={onFilterSelect("tags")} label={filters.tags.label} />
                    </div>
                </div>
            </div>
            <div className={classes.resultsWrapper}>{renderResults()}</div>
        </div>
    );
};

export default SearchPage;
