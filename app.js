import React, { useEffect, useState } from 'react';
import fetchPlats from './fetchPlats'; // Assurez-vous que ce chemin est correct
import Header from './components/Header';
import Menu from './components/Menu';
import Footer from './components/Footer';

function App() {
  const [plats, setPlats] = useState([]);

  useEffect(() => {
    const getPlats = async () => {
      try {
        const platsData = await fetchPlats();
        setPlats(platsData);
      } catch (error) {
        console.error('Erreur lors de la récupération des plats :', error);
      }
    };
    getPlats();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-6">Bienvenue dans l'application Cantine</h1>
        <Menu plats={plats} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
