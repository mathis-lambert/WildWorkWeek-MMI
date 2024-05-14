import React, {useState} from "react";
import Form from "../../components/Form/Form.tsx";
import {URL} from "../../app/socket.ts";
import sha256 from "../../utils/sha256";
import {useDispatch} from "react-redux";
import {signIn} from "../../features/session/sessionSlice.ts";


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
            <h1>Auth</h1>
            {register && (
                <div>
                    <h2>Register</h2>
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

                    <p>Vous avez déjà un compte ? <button onClick={() => {
                        setRegister(false);
                        setLogin(true);
                    }}>Se connecter</button></p>

                </div>
            )}

            {login && (
                <div>
                    <h2>Login</h2>
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

                    <p>Vous n'avez pas de compte ? <button onClick={() => {
                        setRegister(true);
                        setLogin(false);
                    }}>S'enregistrer</button></p>
                </div>
            )}
            <p>{error}</p>
        </div>
    );
}

export default Auth;