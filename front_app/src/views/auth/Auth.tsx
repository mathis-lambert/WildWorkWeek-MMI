import React, {useState} from "react";
import Form from "../../components/Form/Form.tsx";
import {URL} from "../../app/socket.ts";
import sha256 from "../../utils/sha256";
import {useDispatch} from "react-redux";
import {signIn} from "../../features/session/sessionSlice.ts";
import "./Auth.scss";


const Auth = () => {
    const dispatch = useDispatch()

    const [register, setRegister] = useState(false);
    const [login, setLogin] = useState(true);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("")


    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch(`${URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: await sha256(password),
            }),
        });

        const data = await response.json();
        if (data.success && data.data.user) {
            dispatch(signIn({
                user_info: data.data.user,
                token: data.data.token
            }))
        } else {
            setError("Enregistrement impossible : " + data.message)
        }
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch(`${URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                challenge: await sha256(email + await sha256(password))
            }),
        });

        const data = await response.json();
        if (data.success && data.data.user) {
            dispatch(signIn({
                user_info: data.data.user,
                token: data.data.token
            }))
        } else {
            setError("Connexion impossible : " + data.message)
        }
    }


    return (
        <div>
            {register && (
                <div className="register">
                    <div className="artefact">
                        <img src="/images/artefact/main.png" alt="artefact"/>
                    </div>
                    <h2>Inscription</h2>
                    <Form
                        fields={[
                            {
                                field_type: "input",
                                type: "text",
                                placeholder: "First Name",
                                value: firstName,
                                onChange: (e) => setFirstName(e.target.value)
                            },
                            {
                                field_type: "input",
                                type: "text",
                                placeholder: "Last Name",
                                value: lastName,
                                onChange: (e) => setLastName(e.target.value)
                            },
                            {
                                field_type: "input",
                                type: "email",
                                placeholder: "Email",
                                value: email,
                                onChange: (e) => setEmail(e.target.value)
                            },
                            {
                                field_type: "input",
                                type: "password",
                                placeholder: "Password",
                                value: password,
                                onChange: (e) => setPassword(e.target.value)
                            },

                        ]}
                        buttonLabel="S'enregistrer"
                        onSubmit={handleRegister}
                    />

                    <div className="options">
                        <p>Vous avez déjà un compte ? </p>
                        <button onClick={() => {
                            setRegister(false);
                            setLogin(true);
                        }}>Se connecter
                        </button>
                    </div>
                </div>
            )}

            {login && (
                <div className="login">
                    <div className="artefact">
                        <img src="/images/artefact/main.png" alt="artefact"/>
                    </div>
                    <h2>Connexion</h2>
                    <Form
                        fields={[
                            {
                                field_type: "input",
                                type: "email",
                                placeholder: "Email",
                                value: email,
                                onChange: (e) => setEmail(e.target.value)
                            },
                            {
                                field_type: "input",
                                type: "password",
                                placeholder: "Password",
                                value: password,
                                onChange: (e) => setPassword(e.target.value)
                            },

                        ]}
                        buttonLabel="Connexion"
                        onSubmit={handleLogin}
                    />

                    <div className="options">
                        <p>Vous n'avez pas de compte ? </p>
                        <button onClick={() => {
                            setRegister(true);
                            setLogin(false);
                        }}>S'enregistrer
                        </button>
                    </div>

                </div>
            )}
            <p>{error}</p>
        </div>
    );
}

export default Auth;