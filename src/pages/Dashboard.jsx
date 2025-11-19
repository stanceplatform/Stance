// pages/Dashboard.jsx
import React from "react";
import Header from "../components/ui/Header";
import Card from "../components/card/Card";
import { CurrentQuestionProvider } from "../context/CurrentQuestionContext";
import SwipeHintOverlay from "../components/card/SwipeHintOverlay";

const Dashboard = () => {
  return (
    <CurrentQuestionProvider>
      {/* Single, bounded phone-sized viewport */}
      <div className="relative mx-auto w-full max-w-[480px] h-screen-svh overflow-hidden z-0">
        {/* Header over the content */}
        <div className="absolute inset-x-0 top-0 z-50">
          <Header />
        </div>

        {/* Card keeps its own layout/animations exactly the same */}
        <div className="relative h-full">
          <Card />
        </div>

        {/* First-time swipe hint overlay */}
        <SwipeHintOverlay />
      </div>
    </CurrentQuestionProvider>
  );
};

export default Dashboard;
