import { useState } from "react";

import classes from "./ProfileSubpage.module.css";

import { useAuth } from "../../hooks/UseAuth";
import Input from "../../components/utilities/Input";
import ProfilePictureModal from "../../components/modals/ProfilePictureModal";
import editIcon from "../../assets/pen-icon.svg";

const ProfileSubpage = () => {
    const { ctxUserData } = useAuth();

    const [username, setUsername] = useState(ctxUserData?.username ?? "unknown");
    const [firstName, setFirstName] = useState(ctxUserData?.first_name ?? "unknown");
    const [lastName, setLastName] = useState(ctxUserData?.last_name ?? "unknown");
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            {isExpanded && <ProfilePictureModal closeModal={() => setIsExpanded(false)} />}

            <div className={classes.mainContainer}>
                <div className={classes.top}>
                    <div
                        className={classes.avatar}
                        style={{ backgroundImage: `url(/src/assets/avatars/${ctxUserData?.avatar_key}.webp)` }}
                    >
                        <div className={classes.pen} onClick={() => setIsExpanded(true)}>
                            <img src={editIcon} />
                        </div>
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
                    <div className={classes.nameDiv}>
                        <div>
                            <p>First Name</p>
                            <Input
                                type="text"
                                name="username"
                                value={firstName}
                                onChange={(e) => {
                                    setFirstName(e.value);
                                }}
                            />
                            <p></p>
                        </div>
                        <div>
                            <p>Last Name</p>
                            <Input
                                type="text"
                                name="username"
                                value={lastName}
                                onChange={(e) => {
                                    setLastName(e.value);
                                }}
                            />
                            <p></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileSubpage;
