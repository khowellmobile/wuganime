import { useState } from "react";

import classes from "./ProfileSubpage.module.css";

import { useAuth } from "../../hooks/UseAuth";
import Input from "../../components/utilities/Input";
import ProfilePictureModal from "../../components/modals/ProfilePictureModal";

const ProfileSubpage = () => {
    const { ctxUserData } = useAuth();

    const [username, setUsername] = useState(ctxUserData?.username ?? "unknown");
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <>
            {isExpanded && <ProfilePictureModal closeModal={() => setIsExpanded(false)} />}

            <div className={classes.mainContainer}>
                <div className={classes.top}>
                    <div className={classes.icon} onClick={() => setIsExpanded(true)}>
                        <p>{ctxUserData?.username?.charAt(0).toUpperCase() ?? ""}</p>
                    </div>
                </div>
                <div className={classes.options}>
                    <div className={classes.usernameDiv}>
                        <p>Username</p>
                        <Input
                            type="text"
                            name="username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.value);
                            }}
                        />
                        <p>This is open to the public and will been listed as your name when reviewing animes</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileSubpage;
