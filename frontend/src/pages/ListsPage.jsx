import { useEffect, useState, useMemo } from "react";

import classes from "./ListsPage.module.css";

import { useFetchAnime } from "../hooks/useFetchAnime";
import { useUserAnime } from "../hooks/useUserAnime";
import { useModal } from "../contexts/ModalCtx";
import CardList from "../components/misc/CardList";
import AnimeModal from "../components/modals/AnimeModal";
import Dropdown from "../components/utilities/Dropdown";
import Button from "../components/utilities/Button";

const ListsPage = () => {
    const { getUserAnimeSortedByStatus, getUserAnimesByStatus, userAnime } = useUserAnime();
    const { showModal } = useModal();

    const [activeSort, setActiveSort] = useState("Recent");
    const [isAltActive, setIsAltActive] = useState(false);

    const activeList = useMemo(() => {
        switch (activeSort?.toLowerCase()) {
            case "status":
                return getUserAnimeSortedByStatus();
            case "recent":
            default:
                return userAnime;
        }
    }, [userAnime, activeSort, getUserAnimeSortedByStatus]);

    const watchingList = getUserAnimesByStatus("WATCHING");
    const upNextList = getUserAnimesByStatus("UP_NEXT");
    const toWatchList = getUserAnimesByStatus("TO_WATCH");
    const watchedList = getUserAnimesByStatus("WATCHED");
    const dnfList = getUserAnimesByStatus("DNF");

    const sortOptions = [{ label: "Recent" }, { label: "Status" }];

    const handleClick = (anime) => {
        showModal(AnimeModal, { anime: anime });
    };

    const handleDropdownClick = (option) => {
        setActiveSort(option.label);
    };

    return (
        <div className={classes.mainContainer}>
            <Button
                onClick={() => setIsAltActive((prev) => !prev)}
                text={"Switch to Alt View"}
                customStyle={{ position: "absolute", right: "10rem" }}
            />

            {isAltActive ? (
                <>
                    <CardList title={"Watching"} list={watchingList} />
                    <CardList title={"Up Next"} list={upNextList} />
                    <CardList title={"To Watch"} list={toWatchList} />
                    <CardList title={"Watched"} list={watchedList} />
                    <CardList title={"Did Not Finish"} list={dnfList} />
                </>
            ) : (
                <div className={classes.altView}>
                    <div className={classes.colorMap}>
                        <div className={classes.colorMapItem}>
                            <div style={{ backgroundColor: "var(--watching-color)" }} />
                            <p>Watching</p>
                        </div>
                        <div className={classes.colorMapItem}>
                            <div style={{ backgroundColor: "var(--up_next-color)" }} />
                            <p>Up Next</p>
                        </div>
                        <div className={classes.colorMapItem}>
                            <div style={{ backgroundColor: "var(--to_watch-color)" }} />
                            <p>To Watch</p>
                        </div>
                        <div className={classes.colorMapItem}>
                            <div style={{ backgroundColor: "var(--watched-color)" }} />
                            <p>Watched</p>
                        </div>
                        <div className={classes.colorMapItem}>
                            <div style={{ backgroundColor: "var(--dnf-color)" }} />
                            <p>Did Not Finish</p>
                        </div>
                    </div>
                    <div className={classes.tools}>
                        <p>Sort By:</p>
                        <Dropdown options={sortOptions} onSelect={handleDropdownClick} label={activeSort} />
                    </div>
                    {activeList?.length > 0 &&
                        activeList.map((value, index) => (
                            <div
                                key={index}
                                className={`${classes.altViewItem} ${classes[value?.user_status?.toLowerCase()]}`}
                                onClick={() => handleClick(value)}
                            >
                                <p>{value.title}</p>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default ListsPage;
