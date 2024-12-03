import { useEffect, useState } from "react";
import { getFirestore, collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig"; // Adjust the path to your Firebase config

import '../styles/WinnerList.css'; // Ensure you have styles here

const firestore = getFirestore();

const WinnersGallery = ({ numberOfDays = 7 }) => {
  const [dailyWinners, setDailyWinners] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - numberOfDays);

    const q = query(
      collection(firestore, "photos"),
      where("createdAt", ">=", startDate),
      where("createdAt", "<=", today),
      orderBy("createdAt"),
      orderBy("votes", "desc")

    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const winnersByDate = {};
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const date = data.createdAt.toDate().toISOString().split("T")[0]; // Format to YYYY-MM-DD
        if (!winnersByDate[date]) {
          winnersByDate[date] = { id: doc.id, ...data };
        }
      });

      setDailyWinners(Object.entries(winnersByDate).map(([date, winner]) => ({ date, ...winner })));
    });

    return () => unsubscribe();
  }, [numberOfDays]);

  if (!user) return null;

  return (
    <div className="container">
      <h2>Daily Winners</h2>
      <div className="winners-grid">
        {dailyWinners.map((winner) => (
          <div key={winner.id} className="winner-item">
            <div className="winner-date">{winner.date}</div>
            <div className="img-wrap">
              <img src={winner.url} alt={`Winner on ${winner.date}`} className="winner-img" />
            </div>
            <div className="vote-count">
              <strong>{winner.votes}</strong> votes
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WinnersGallery;
