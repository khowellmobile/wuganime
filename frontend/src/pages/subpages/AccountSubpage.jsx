import { useState } from "react";

import classes from "./AccountSubpage.module.css";

import { useAuth } from "../../hooks/UseAuth";
import Input from "../../components/utilities/Input";
import editIcon from "../../assets/pen-icon.svg";
import Button from "../../components/utilities/Button";

const AccountSubpage = () => {
    const { ctxUserData } = useAuth();

    return (
        <div className={classes.mainContainer}>
            <div className={classes.emailContainer}>
                <div className={classes.top}>
                    <h2>Change Your Email</h2>
                    <p>Change the email you use to login and receive information regarding wuganime</p>
                </div>
                <div className={classes.mid}>
                    <p className={classes.label}>Current Email</p>
                    <p>WugWug@gmail.com</p>
                </div>
                <div className={classes.bot}>
                    <p>
                        Clicking the button below will send a message to your current email with a secure link to change
                        your email
                    </p>
                    <Button onClick={() => {}} text={"Send Email Change Link"} />
                </div>
            </div>
            <div className={classes.sepH} />
            <div className={classes.passwordContainer}>
                <div className={classes.top}>
                    <h2>Change Your Password</h2>
                    <p>Change the password you use to login. Remember to keep it secure.</p>
                </div>
                <div className={classes.mid}>
                    <p className={classes.label}>Current Email</p>
                    <p>WugWug@gmail.com</p>
                </div>
                <div className={classes.bot}>
                    <p>
                        Clicking the button below will send a message to your current email with a secure link to change
                        your password. All passwords are encrypted in our database.
                    </p>
                    <Button onClick={() => {}} text={"Send Email Change Link"} />
                </div>
            </div>
            <div className={classes.sepH} />
            <div className={classes.deleteContainer}>
                <h3>Delete Your Account</h3>
                <p>
                    WARNING! This will permanently remove all of your data and delete your account. This is an
                    irrecoverable action.
                </p>
                <Button
                    onClick={() => {}}
                    text={"DELETE ACCOUNT"}
                    customStyle={{ backgroundColor: "rgb(255, 75, 75)", color: "white" }}
                />
            </div>
        </div>
    );
};

export default AccountSubpage;
