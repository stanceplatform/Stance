import React, { createContext, useContext, useState } from "react";

const CurrentQuestionContext = createContext();

export function CurrentQuestionProvider({ children }) {
  const [questionId, setQuestionId] = useState(null);

  return (
    <CurrentQuestionContext.Provider value={{ questionId, setQuestionId }}>
      {children}
    </CurrentQuestionContext.Provider>
  );
}

export function useCurrentQuestion() {
  const ctx = useContext(CurrentQuestionContext);
  if (!ctx) {
    throw new Error("useCurrentQuestion must be used inside CurrentQuestionProvider");
  }
  return ctx;
}
