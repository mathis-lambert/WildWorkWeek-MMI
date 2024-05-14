import React, {useState} from "react";
import Form from "../../components/Form/Form.tsx";
import {URL} from "../../app/socket.ts";
import sha256 from "../../utils/sha256"

const Auth = () => {
    const [register, setRegister] = useState(false);
    const [login, setLogin] = useState(true);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Register")

        const response = await fetch(`${URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password,
            }),
        });

        const data = await response.json();
        console.log(data);
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Login")

        const response = await fetch(`${URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                challenge: await sha256(email + password)
            }),
        });

        const data = await response.json();
        console.log(data);

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
                                onChange: async (e) => setPassword(await sha256(e.target.value))
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
                                onChange: async (e) => setPassword(await sha256(e.target.value))
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
        </div>
    );
}

export default Auth;