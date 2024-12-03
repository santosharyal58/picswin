import React from 'react';
import '../styles/auth.css'; // Ensure you have styles here


import { auth, signInWithPopup, GoogleAuthProvider, signOut } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';

// sign in part
const SignIn = () => {
  
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .catch((error) => {
        console.error("Error during sign-in:", error.message);
        alert("Failed to sign in. Please try again.");
      });
  };

  return (
    <button className="sign-in-button" onClick={signInWithGoogle}>
      <svg className="google-icon" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
      </svg>
      Sign in with Google
    </button>
  );
};

// sign out part
const SignOut = () => {
  return (
    auth.currentUser && (
      <button className="sign-out-button" onClick={() => signOut(auth)
        .catch((error) => {
          console.error("Error during sign-out:", error.message);
          alert("Failed to sign out. Please try again.");
        })}
      >
        Sign Out
      </button>
    )
  );
};

const AuthComponent = ({ onClose }) => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <p>Loading...</p>; // Loading state
  }

  if (error) {
    return <p>Error: {error.message}</p>; // Error state
  }

  return (
    <div className="auth-component auth-holder">
      {user ? (
        <div className="user-info">
          <img src={user.photoURL} alt={user.displayName} className="user-photo" />
          <p className="welcome-text">Welcome, {user.displayName}!</p>
          <SignOut />
        </div>
      ) : (
        <div className="sign-in-container">
          <p className="subtitle">Please sign in to continue</p>
          <SignIn />
        </div>
      )}
    </div>
  );
};

export default AuthComponent;


