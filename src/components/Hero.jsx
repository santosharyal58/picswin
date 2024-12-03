import React from 'react';
import PhotoUpload from '../components/PhotoUpload';
import '../styles/Hero.css';
const Hero = () => {
  return (
      <div className="hero-wrapper">
        <h1>Welcome to the Daily Photo Contest</h1>
        <PhotoUpload/>
      </div>
  );
};

export default Hero;