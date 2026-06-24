import { useState } from "react";
import Dropdown from "../components/utilities/Dropdown";
import SearchBox from "../components/utilities/SearchBox";
import classes from "./SearchPage.module.css";

const SearchPage = () => {
    const [statusLabel, setStatusLabel] = useState("None");
    const [tagLabel, setTagLabel] = useState("None");

    const statusOptions = [
        { label: "Watching", value: "WATCHING" },
        { label: "Up Next", value: "UP_NEXT" },
        { label: "To Watch", value: "TO_WATCH" },
        { label: "Watched", value: "WATCHED" },
        { label: "Did Not Finish", value: "DNF" },
        { label: "None", value: "NONE" },
    ];
    const tagOptions = [{ label: "Action" }, { label: "Drama" }, { label: "None" }];

    const onStatusSelect = (option) => {
        setStatusLabel(option.label);
    };

    const onTagSelect = (option) => {
        setTagLabel(option.label);
    };

    return (
        <div className={classes.mainContainer}>
            <div className={classes.tools}>
                <SearchBox customStyle={{ width: "25rem", fontSize: '0.8rem' }} placeholder={"Search"} />
                <div className={classes.filters}>
                    <p>Filter By:</p>

                    <div className={classes.filter}>
                        <p>Status</p>
                        <Dropdown options={statusOptions} onSelect={onStatusSelect} label={statusLabel} />
                    </div>
                    <div className={classes.filter}>
                        <p>Tag</p>
                        <Dropdown options={tagOptions} onSelect={onTagSelect} label={tagLabel} />
                    </div>
                </div>
            </div>
            <div className={classes.results}></div>
        </div>
    );
};

export default SearchPage;
