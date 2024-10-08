import React from "react";
import CardNavigation from "./CardNavigation";
import Header from "../Header";

function CardContent({ question, onNext, onPrevious }) {
  return (
    <>
      <Header />
      <CardNavigation question={question} onNext={onNext} onPrevious={onPrevious} />
    </>
  );
}

export default CardContent;