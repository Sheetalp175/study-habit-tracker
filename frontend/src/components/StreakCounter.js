import React, { useEffect, useState } from "react";
import axios from "axios";

const StreakCounter = () => {
  const [streak, setStreak] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const updateStreak = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/users/update-streak",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStreak(res.data.streak);
      } catch (error) {
        console.error("Error updating streak:", error);
      }
    };

    updateStreak();
  }, []);

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "15px",
        background: "#f5ffe6",
        borderRadius: "10px",
        textAlign: "center",
        fontWeight: "bold",
        boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h3>🔥 Current Streak: {streak} Day{streak !== 1 ? "s" : ""}</h3>
    </div>
  );
};

export default StreakCounter;
