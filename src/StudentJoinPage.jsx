import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./StudentJoinPage.css";

const socket = io("http://localhost:8000", {
    transports: ["websocket", "polling"],
});

export default function StudentJoinPage() {
    const [step, setStep] = useState("session");
    const [sessionId, setSessionId] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        socket.on("student:joined", () => {
            setStep("waiting");
        });

        socket.on("error", (data) => {
            setError(data.message);
        });

        return () => {
            socket.off("student:joined");
            socket.off("error");
        };
    }, []);

    const handleSessionSubmit = (e) => {
        e.preventDefault();
        if (!sessionId.trim()) return setError("Введите код сессии");
        setError("");
        setStep("name");
    };

    const handleNameSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return setError("Введите имя");
        setError("");

        socket.emit("student:join", {
            session_id: sessionId.trim().toUpperCase(),
            name: name.trim(),
        });
    };

    if (step === "waiting") {
        return (
            <div className="join-container">
                <div className="card fade-in">
                    <h2 className="title">Вы подключены! 🎉</h2>
                    <p className="subtitle">Ожидайте начала теста…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="join-container">
            <div className="card fade-in">

                {step === "session" && (
                    <>
                        <h2 className="title">Введите код сессии</h2>

                        <form onSubmit={handleSessionSubmit}>
                            <input
                                type="text"
                                value={sessionId}
                                onChange={(e) => setSessionId(e.target.value)}
                                placeholder="Например: AB12"
                                className="input"
                            />

                            <button className="btn">Продолжить</button>
                        </form>
                    </>
                )}

                {step === "name" && (
                    <>
                        <h2 className="title">Введите ваше имя</h2>

                        <form onSubmit={handleNameSubmit}>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ваше имя"
                                className="input"
                            />

                            <button className="btn">Присоединиться</button>
                        </form>
                    </>
                )}

                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
}
