import React from "react";
import QuestionSection from "./QuestionSection";
import CardNavigation from "./CardNavigation";
import Header from "../Header";

function CardContent({ question, onNext }) {
  return (
    <>
      <Header />
      <CardNavigation question={question} onNext={onNext} />
    </>
  );
}

export default CardContent;