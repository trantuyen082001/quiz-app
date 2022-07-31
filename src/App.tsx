import React, { useState } from "react";
import { Difficulty, fetchQuizQuestions, QuestionState } from "./api";
import "./App.css";
import QuestionCards from "./components/QuestionCards/QuestionCards";
import { TOTAL_QUESTION } from "./contraints";
import { GlobalStyle, Wrapper } from "./App.styles";

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestion = await fetchQuizQuestions(
      TOTAL_QUESTION,
      Difficulty.EASY
    );

    setQuestions(newQuestion);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    const answer = e.currentTarget.value;
    // check answer against correct answer
    const correct = questions[number].correct_answer === answer;
    //  add score if answer is correct
    if (correct) setScore((pre) => pre + 1);
    // save answer in the array for user answer
    const answerObject = {
      question: questions[number].question,
      answer,
      correct,
      correctAnswer: questions[number].correct_answer,
    };
    console.log(answerObject);
    setUserAnswers((pre) => [...pre, answerObject]);
  };

  const nextQuestion = () => {
    //  move on to the next question if not the last question
    const nextQuestion = number + 1;
    if (nextQuestion === TOTAL_QUESTION) {
      setGameOver(true);
    }
    setNumber(nextQuestion);
  };

  console.log(fetchQuizQuestions(TOTAL_QUESTION, Difficulty.EASY));

  return (
    <>
      <GlobalStyle />
      <Wrapper className="App">
        <h1>React Quiz</h1>{" "}
        {gameOver || userAnswers.length === TOTAL_QUESTION ? (
          <button className="start" onClick={startTrivia}>
            Start
          </button>
        ) : null}
        {!gameOver ? <p className="score">Score: {score}</p> : null}
        {loading ? <p>Loading Question...</p> : null}
        {!loading && !gameOver && (
          <QuestionCards
            questionNumber={number + 1}
            totalQuestions={TOTAL_QUESTION}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        )}
        {!gameOver &&
        !loading &&
        userAnswers.length === number + 1 &&
        number !== TOTAL_QUESTION - 1 ? (
          <button className="next" onClick={nextQuestion}>
            Next Question
          </button>
        ) : null}
      </Wrapper>
    </>
  );
};

export default App;
