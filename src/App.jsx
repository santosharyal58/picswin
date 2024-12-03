import React from 'react';
import Gallery from './components/Gallery';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import WinnersGallery from './components/Winners';


function App() {
  return (
    <div className="main">
      <Header />
      <Hero/>
      <Gallery />
      <WinnersGallery/>
      <Footer />
    </div>
  );
}

export default App;