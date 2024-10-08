import React from "react";
import QuestionSection from "./QuestionSection";
import CardNavigation from "./CardNavigation";
import Header from "../Header";

function CardContent({ question }) {
  return (
    <>
      <Header />
      <CardNavigation question={question} />
    </>
  );
}

export default CardContent;