import React, { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

import '../styles/VoteButton.css'; // Ensure you have styles here

const storage = getStorage();
const firestore = getFirestore();

const PhotoUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const storageRef = ref(storage, `photos/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Progress tracking can be added here if needed.
      },
      (error) => {
        setError(error.message);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        await addDoc(collection(firestore, "photos"), {
          url: downloadURL,
          createdAt: serverTimestamp(),
          votes: 0,
          userId: "bSegwIZp4YbFRFKqA394lsUFsI23", // You can replace this with authenticated user data.
        });
        setUploading(false);
        setFile(null);
        alert("Photo uploaded successfully!");
      }
    );
  };

  return (
    <div className='container'>
      <div className='upload-wrapper'>
      <h2>Put in Today' Submission</h2>
      <div className="actions">
        <input type="file" onChange={handleFileChange} />
        <button className="btn" onClick={handleUpload} disabled={uploading || !file}>
          {uploading ? "Uploading..." : "Upload Photo"}
        </button>
      </div>
      {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default PhotoUpload;
