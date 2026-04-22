import { useState } from "react";

import classes from "./CreateUserModal.module.css";

const CreateUserModal = ({ handleCloseModal, switchModal }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [waitingOnEmail, setWaitingOnEmail] = useState(false);

    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={classes.mainContainer}>
            <form className={classes.form}>
                <section className={classes.logo}>
                    <b>H</b>
                </section>

                {!waitingOnEmail ? (
                    <>
                        <section className={classes.header}>
                            <b>Create Account</b>
                            <p>Please enter your details</p>
                        </section>
                        {errorMsg && (
                            <section className={classes.errors}>
                                <p>{errorMsg}</p>
                            </section>
                        )}
                        <section className={classes.inputs}>
                            <div className={classes.formCluster}>
                                <input
                                    type="text"
                                    className={classes.formInput}
                                    value={email}
                                    name="email"
                                    placeholder=""
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                    data-testid="input-email"
                                />
                                <p className={classes.formLabel}>Email</p>
                            </div>
                            <div className={classes.formCluster}>
                                <input
                                    type="password"
                                    className={classes.formInput}
                                    value={password}
                                    name="password"
                                    placeholder=""
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setIsExpanded(true)}
                                    onBlur={() => setIsExpanded(false)}
                                    data-testid="input-password"
                                />
                                <p className={classes.formLabel}>Password</p>
                            </div>
                            <div className={classes.formCluster}>
                                <input
                                    type="password"
                                    className={classes.formInput}
                                    value={passwordConfirm}
                                    name="password"
                                    placeholder=""
                                    required
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    data-testid="input-password-confirm"
                                />
                                <p className={classes.formLabel}>Confirm Password</p>
                            </div>
                        </section>
                    </>
                ) : (
                    <p>A confirmation email has been sent to {email}. Please return to login!</p>
                )}

                <button onClick={waitingOnEmail ? switchModal : () => {}}>
                    {waitingOnEmail ? "Back to Login" : "Create Account"}
                </button>
                {!waitingOnEmail && (
                    <p>
                        Already Have an Account?
                        <a onClick={switchModal}>Login</a>
                    </p>
                )}
            </form>
        </div>
    );
};

export default CreateUserModal;
