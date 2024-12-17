import React from "react";
import logo from "./assets/akko.jpg";
import { Link } from "react-router-dom";
import "./styles/App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Link to="/login"> Login Here </Link>
      </header>
    </div>
  );
}

export default App;
