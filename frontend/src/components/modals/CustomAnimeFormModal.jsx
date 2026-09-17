import { useEffect, useState } from "react";

import classes from "./CustomAnimeFormModal.module.css";

import { useAnimeMutations } from "../../hooks/useAnimeMutations";
import { useModal } from "../../contexts/ModalCtx";
import AnimeModal from "./AnimeModal";
import Input from "../utilities/Input";
import Dropdown from "../utilities/Dropdown";
import Button from "../utilities/Button";

const ANIME_STATUS_OPTIONS = [
    { label: "Watching", value: "WATCHING" },
    { label: "Watched", value: "WATCHED" },
    { label: "To Watch", value: "TO_WATCH" },
    { label: "Up Next", value: "UP_NEXT" },
    { label: "Did Not Finish", value: "DNF" },
    { label: "Uncategorized", value: null },
];

const VALUES_TO_LABELS = {
    WATCHING: "Watching",
    WATCHED: "Watched",
    TO_WATCH: "To Watch",
    UP_NEXT: "Up Next",
    DNF: "Did Not Finish",
    null: "Uncategorized",
};

const CustomAnimeFormModal = ({ closeModal, anime }) => {
    const { addCustomAnime, updateCustomAnime } = useAnimeMutations();
    const { showModal } = useModal();

    const [errTxt, setErrTxt] = useState("");
    const [inputFields, setInputFields] = useState({
        title: "",
        user_status: "UNCATEGORIZED",
        episodes: "",
        episodes_watched: "",
        synopsis: "",
    });

    const isAdd = anime ? false : true;

    useEffect(() => {
        if (anime) {
            setInputFields(anime);
        }
    }, [anime]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputFields((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const changeLabel = (option) => {
        setInputFields({ ...inputFields, user_status: option.value });
    };

    const submitFields = async () => {
        if (!inputFields.title.trim()) {
            setErrTxt("Title is required.");
            return;
        }

        const fields = {
            title: inputFields.title.trim(),
            synopsis: inputFields.synopsis || null,
            episodes: inputFields.episodes === "" ? null : Number(inputFields.episodes),
            episodes_watched: inputFields.episodes_watched === "" ? 0 : Number(inputFields.episodes_watched),
            user_status: inputFields.user_status === "UNCATEGORIZED" ? null : inputFields.user_status,
        };

        const result = isAdd
            ? await addCustomAnime(fields)
            : await updateCustomAnime({
                  id: anime.id,
                  ...fields,
              });

        if (!result.success) {
            setErrTxt(result.message);
            return;
        }

        // Current modal is replaced by new modal
        showModal(AnimeModal, { anime: result?.anime });
    };

    return (
        <div className={classes.modalOverlay} onClick={closeModal}>
            <div className={classes.mainContainer} onClick={(e) => e.stopPropagation()}>
                <div className={classes.animeInfoDiv}>
                    <div className={classes.picture}>
                        <p>{inputFields.title}</p>
                    </div>
                    <div className={classes.properties}>
                        <Input
                            type={"text"}
                            placeholder={"title"}
                            name={"title"}
                            value={inputFields.title}
                            onChange={handleInputChange}
                            isOptional={false}
                        />
                        <p className={classes.label}>Status:</p>
                        <Dropdown
                            options={ANIME_STATUS_OPTIONS}
                            onSelect={changeLabel}
                            label={VALUES_TO_LABELS[inputFields.user_status]}
                        />
                        <p className={classes.label}>Episodes:</p>
                        <div className={classes.episodeCounter}>
                            <Input
                                type={"number"}
                                placeholder={"watched"}
                                name={"episodes_watched"}
                                value={inputFields.episodes_watched}
                                onChange={handleInputChange}
                                isOptional={true}
                            />
                            <p>/</p>
                            <Input
                                type={"number"}
                                placeholder={"total"}
                                name={"episodes"}
                                value={inputFields.episodes}
                                onChange={handleInputChange}
                                isOptional={true}
                            />
                        </div>
                    </div>
                </div>
                <p className={classes.label}>Description:</p>
                <textarea
                    className={classes.description}
                    name={"synopsis"}
                    value={inputFields?.synopsis}
                    onChange={handleInputChange}
                    placeholder="In a land of green trees and wandering rivers..."
                ></textarea>
                <div className={classes.toolbar}>
                    <p>{errTxt}</p>
                    <div className={classes.buttons}>
                        <Button text="Cancel" onClick={closeModal} />
                        <Button
                            text="Save"
                            onClick={() => {
                                submitFields(inputFields);
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomAnimeFormModal;
