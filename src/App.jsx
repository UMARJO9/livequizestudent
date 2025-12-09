import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import StudentJoinPage from "./StudentJoinPage";

function App() {
    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#f5f5f5"
        }}>
            <StudentJoinPage />
        </div>
    );
}

export default App;
