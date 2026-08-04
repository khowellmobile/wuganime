import classes from "./SearchPage.module.css";

import { useAnimeSearch } from "../hooks/useAnimeSearch";
import Dropdown from "../components/utilities/Dropdown";
import SearchBox from "../components/utilities/SearchBox";
import AnimeCard from "../components/cards/AnimeCard";

import loadingIcon from "../assets/loading-icon.svg";

const SearchPage = () => {
    const {
        animelist,
        showLoading,
        hasSettledQuery,
        searchTerm,
        onSearchChange,
        statusLabel,
        tagLabel,
        onFilterSelect,
        statusOptions,
        tagOptions,
    } = useAnimeSearch();

    const renderResults = () => {
        if (showLoading) {
            return (
                <div className={classes.noResDisplay}>
                    <img className={classes.icon} src={loadingIcon} alt={"loading icon"} />
                </div>
            );
        }

        if (animelist?.length > 0) {
            return (
                <div className={classes.results}>
                    {animelist.map((value, index) => (
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
                            label={statusLabel?.label}
                        />
                    </div>
                    <div className={classes.filter}>
                        <p>Tag</p>
                        <Dropdown options={tagOptions} onSelect={onFilterSelect("tags")} label={tagLabel?.label} />
                    </div>
                </div>
            </div>
            <div className={classes.resultsWrapper}>{renderResults()}</div>
        </div>
    );
};

export default SearchPage;
