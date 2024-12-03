import React, { useState, useEffect } from 'react';
import {
  doc,
  runTransaction,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore';
import { firestore, auth } from '../firebaseConfig';

// Custom debounce hook
const useDebounce = (callback, delay) => {
  const [debounceTimer, setDebounceTimer] = useState(null);

  const debouncedCallback = (...args) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const newTimer = setTimeout(() => {
      callback(...args);
    }, delay);

    setDebounceTimer(newTimer);
  };

  return debouncedCallback;
};

const VoteButton = ({ photoId, initialVotes }) => {
  const [currentVotes, setCurrentVotes] = useState(initialVotes);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Real-time listener for vote count updates
  useEffect(() => {
    const photoRef = doc(firestore, 'photos', photoId);

    // Create the listener
    const unsubscribe = onSnapshot(photoRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setCurrentVotes(data.votes || 0);
      }
    });

    // Cleanup listener on component unmount or photoId change
    return () => unsubscribe();
  }, [photoId]);

  // Handle vote with debouncing
  const handleVote = async () => {
    setLoading(true);
    setError(null);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('You must be signed in to vote.');
      }

      const userId = user.uid;
      const voteDocId = `${userId}_${photoId}`;
      const voteDocRef = doc(firestore, 'votes', voteDocId);
      const photoRef = doc(firestore, 'photos', photoId);

      // Use Firestore transactions for atomic operations
      await runTransaction(firestore, async (transaction) => {
        const voteDocSnapshot = await transaction.get(voteDocRef);

        if (voteDocSnapshot.exists()) {
          // User has already voted
          setHasVoted(true);
          throw new Error('You have already voted today.');
        }

        const photoSnapshot = await transaction.get(photoRef);
        if (!photoSnapshot.exists()) {
          throw new Error('Photo not found.');
        }

        const newVoteCount = (photoSnapshot.data().votes || 0) + 1;

        // Update the photo's vote count
        transaction.update(photoRef, { votes: newVoteCount });

        // Record the user's vote
        transaction.set(voteDocRef, {
          userId,
          photoId,
          timestamp: Timestamp.now(),
        });
      });

      setHasVoted(true);
    } catch (error) {
      console.error('Error recording vote:', error);
      setError(error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Apply the debounce effect
  const debouncedHandleVote = useDebounce(handleVote, 500);  // Debounce with 500ms delay

  return (
    <div>
      <button
        className="btn"
        onClick={debouncedHandleVote}
        disabled={loading || hasVoted}
      >
        {loading ? 'Processing...' : hasVoted ? 'You have already voted' : 'UpVote'}
      </button>
      {error && <p className="error-text">{error}</p>}
      <p>Current Votes: {currentVotes}</p>
    </div>
  );
};

export default VoteButton;
