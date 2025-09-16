import React from "react";
import Header from "../components/ui/Header";
import Card from "../components/card/Card";
import { CurrentQuestionProvider } from "../context/CurrentQuestionContext";
import SuggestQuestion from "../components/card/SuggestQuestion";

const Dashboard = () => {
  return (
    <CurrentQuestionProvider>
      {/* Single, bounded phone-sized viewport */}
      <div className="relative mx-auto w-full max-w-[480px] h-screen-svh overflow-hidden">
        {/* Header over the content */}
        <div className="absolute inset-x-0 top-0 z-50">
          <Header />
        </div>

        {/* Card keeps its own layout/animations exactly the same */}
        <div className="relative z-0 h-full">
          <Card />
          {/* <SuggestQuestion /> */}
        </div>
      </div>
    </CurrentQuestionProvider>
  );
};

export default Dashboard;
