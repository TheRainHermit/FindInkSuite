import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "5rem" }}>
      <h1>Bienvenido a FindInk Suite</h1>
      <div style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
        <button
          style={{ padding: "2rem", fontSize: "1.2rem", cursor: "pointer" }}
          onClick={() => navigate("/tattoovision")}
        >
          Tattoo Vision
        </button>
        <button
          style={{ padding: "2rem", fontSize: "1.2rem", cursor: "pointer" }}
          onClick={() => navigate("/crm")}
        >
          InkFlow CRM
        </button>
      </div>
    </div>
  );
};

export default Home;