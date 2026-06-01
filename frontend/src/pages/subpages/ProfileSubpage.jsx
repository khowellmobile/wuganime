import { useEffect, useState } from "react";

import classes from "./ProfileSubpage.module.css";

import { useAuth } from "../../hooks/UseAuth";
import Input from "../../components/utilities/Input";
import ProfilePictureModal from "../../components/modals/ProfilePictureModal";
import editIcon from "../../assets/pen-icon.svg";
import Button from "../../components/utilities/Button";

const ProfileSubpage = () => {
    const { updateUser, ctxUserData } = useAuth();

    const [userData, setUserData] = useState({
        username: "",
        firstName: "",
        lastName: "",
    });

    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        setUserData({
            username: ctxUserData?.username ?? "unknown",
            firstName: ctxUserData?.first_name ?? "unknown",
            lastName: ctxUserData?.last_name ?? "unknown",
        });
    }, [ctxUserData]);

    const changeField = (name, value) => {
        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const buildPayload = () =>
        Object.fromEntries(
            Object.entries({
                username: ctxUserData?.username !== userData.username ? userData.username : undefined,
                first_name: ctxUserData?.first_name !== userData.firstName ? userData.firstName : undefined,
                last_name: ctxUserData?.last_name !== userData.lastName ? userData.lastName : undefined,
            }).filter(([_, value]) => value !== undefined),
        );

    const payload = buildPayload();
    const hasChanges = Object.keys(payload).length > 0;

    const saveData = async () => {
        if (!hasChanges) return;
        const response = await updateUser(payload);
        console.log(response);
    };

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
                    {hasChanges && <Button onClick={() => {}} text={"Save"} />}
                    <div className={classes.usernameDiv}>
                        <p>Username</p>
                        <Input
                            type="text"
                            name="username"
                            value={userData.username}
                            onChange={(e) => {
                                changeField("username", e.target.value);
                            }}
                        />
                        <p>This is open to the public and will been listed as your name when reviewing animes</p>
                    </div>
                    <div className={classes.nameDiv}>
                        <div>
                            <p>First Name</p>
                            <Input
                                type="text"
                                name="firstName"
                                value={userData.firstName}
                                onChange={(e) => {
                                    changeField("firstName", e.target.value);
                                }}
                            />
                            <p></p>
                        </div>
                        <div>
                            <p>Last Name</p>
                            <Input
                                type="text"
                                name="lastName"
                                value={userData.lastName}
                                onChange={(e) => {
                                    changeField("lastName", e.target.value);
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
