import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuth";

import classes from "./LoginModal.module.css";

const LoginModal = ({ handleCloseModal, switchModal }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        const result = await login(email, password);
        if (result.success) {
            navigate("/app/home");
        } else {
            setMessage(result.error?.detail || "Login failed.");
        }
    };

    return (
        <div className={classes.mainContainer}>
            <form className={classes.form} onSubmit={handleSubmit}>
                <section className={classes.logo}>
                    <b>W</b>
                </section>
                <section className={classes.header}>
                    <b>Welcome Back</b>
                    <p>Please enter your details</p>
                </section>
                {message && (
                    <section className={classes.messages}>
                        <p>{message}</p>
                    </section>
                )}
                <section className={classes.inputs}>
                    <div className={classes.formCluster}>
                        <input
                            type="text"
                            className={classes.formInput}
                            value={email}
                            id="email"
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
                            id="password"
                            name="password"
                            placeholder=""
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            data-testid="input-password"
                        />
                        <p className={classes.formLabel}>Password</p>
                    </div>
                </section>
                <p>
                    Forgot your password?
                    <a onClick={() => {}}>Password Reset</a>
                </p>
                <button type="submit">Login</button>
                <p>
                    Dont have an Account?
                    <a onClick={switchModal}>Sign Up</a>
                </p>
            </form>
        </div>
    );
};

export default LoginModal;
