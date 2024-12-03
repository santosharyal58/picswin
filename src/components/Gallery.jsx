import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import VoteButton from '../components/VoteButton';
import '../styles/Gallery.css'; // Import CSS for styling
import { auth } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';

const firestore = getFirestore();

// Helper function to get the start and end timestamps of the current day
const getTodayTimestamps = () => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of the day
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // End of the day
  return { startOfDay, endOfDay };
};

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const { startOfDay, endOfDay } = getTodayTimestamps();

  useEffect(() => {
    // Modify the query to fetch only today's photos
    const q = query(
      collection(firestore, 'photos'),
      where('createdAt', '>=', startOfDay),
      where('createdAt', '<=', endOfDay),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const photosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPhotos(photosData);
    });

    return () => unsubscribe();
  }, [startOfDay, endOfDay]);

  return (
    auth.currentUser && ( // make the section reload
      <div className="container gallery-container">
        <h2>Today's Submissions:</h2>
        <div className="gallery-grid">
          {photos.map((photo) => (
            <div key={photo.id} className="photo-item">
              <div className="img-wrap">
                <img src={photo.url} alt="Uploaded" className="photo-img" />
                <VoteButton photoId={photo.id} currentVotes={photo.votes} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default Gallery;
