import { useRef, useEffect, useState } from "react";

import classes from "./ProfilePictureModal.module.css";
import AvatarList from "../misc/AvatarList";

const avatarLists = (() => {
    const avatarModules = import.meta.glob("../../assets/avatars/*.webp", {
        eager: true,
        import: "default",
    });

    const groupedAvatars = {
        mask: [],
        bird: [],
    };

    Object.entries(avatarModules).forEach(([path, url]) => {
        const fileName = path.split("/").pop() ?? "";

        if (fileName.startsWith("mask")) {
            groupedAvatars.mask.push({
                order: Number(fileName.match(/\d+/)?.[0] ?? Number.MAX_SAFE_INTEGER),
                url,
            });
            return;
        }

        if (fileName.startsWith("bird")) {
            groupedAvatars.bird.push({
                order: Number(fileName.match(/\d+/)?.[0] ?? Number.MAX_SAFE_INTEGER),
                url,
            });
        }
    });

    groupedAvatars.mask.sort((a, b) => a.order - b.order);
    groupedAvatars.bird.sort((a, b) => a.order - b.order);

    return {
        mask: groupedAvatars.mask.map((avatar) => avatar.url),
        bird: groupedAvatars.bird.map((avatar) => avatar.url),
    };
})();

const ProfilePictureModal = ({ closeModal }) => {
    const [avatarUrl, setAvatarUrl] = useState("/src/assets/avatars/bird6.webp");

    const onSelect = (url) => {
        setAvatarUrl(url);
    };

    return (
        <div className={classes.modalOverlay} onClick={closeModal}>
            <div className={classes.mainContainer} onClick={(e) => e.stopPropagation()}>
                <div className={classes.top}>
                    <div className={classes.pictureDiv}>
                        <div className={classes.avatar} style={{ backgroundImage: `url(${avatarUrl})` }}></div>
                    </div>
                    <div className={classes.buttonDiv}>
                        <h3>Choose Your Profile Picture</h3>
                        <p>This will be public and can be changed at any time</p>
                    </div>
                </div>
                <div className={classes.bottom}>
                    <AvatarList avatars={avatarLists.mask} title={"Masks"} onSelect={onSelect} />
                    <AvatarList avatars={avatarLists.bird} title={"Birds"} onSelect={onSelect} />
                </div>
            </div>
        </div>
    );
};

export default ProfilePictureModal;
