import React from "react";
import { useNavigate } from "react-router-dom";

// Ejemplo de datos de tatuadores
const tattooArtists = [
  {
    id: 1,
    name: "Sofía Martínez",
    specialty: "Realismo y retratos",
    avatar: "/avatars/sofia.jpg",
    portfolioPath: "/crm/portfolio?artist=sofia",
  },
  {
    id: 2,
    name: "Luis Torres",
    specialty: "Geométrico y minimalista",
    avatar: "/avatars/luis.jpg",
    portfolioPath: "/crm/portfolio?artist=luis",
  },
  {
    id: 3,
    name: "Andrea Gómez",
    specialty: "Tradicional y neotradicional",
    avatar: "/avatars/andrea.jpg",
    portfolioPath: "/crm/portfolio?artist=andrea",
  },
];

const TattooPerson: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Tatuadores</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tattooArtists.map((artist) => (
          <div
            key={artist.id}
            className="bg-card rounded-xl shadow-lg p-6 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform border border-border"
            onClick={() => navigate(artist.portfolioPath)}
          >
            <img
              src={artist.avatar}
              alt={artist.name}
              className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-primary"
            />
            <h2 className="text-xl font-semibold">{artist.name}</h2>
            <p className="text-sm text-muted-foreground">{artist.specialty}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TattooPerson;