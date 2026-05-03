"use client";

import { motion } from "framer-motion";
import { useQuizStore } from "@/store/quiz-store";
import { QUIZ_QUESTIONS } from "@/lib/quiz-data";
import { trackEvent } from "@/lib/tracking";

export function QuizQuestion() {
  const { questionIndex, answerQuestion } = useQuizStore((s) => ({
    questionIndex: s.questionIndex,
    answerQuestion: s.answerQuestion,
  }));

  const question = QUIZ_QUESTIONS[questionIndex];
  if (!question) return null;

  function handleAnswer(optionId: string) {
    trackEvent("question_answered", {
      source: "audit",
      page: "audit",
      q_num: String(questionIndex + 1),
      answer: optionId,
    });
    answerQuestion(question.id, optionId);
  }

  return (
    <motion.div
      key={questionIndex}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="flex flex-col px-6 py-8 max-w-lg mx-auto w-full"
    >
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
        <div
          className="bg-violet-600 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${question.progressPct}%` }}
        />
      </div>

      <p className="text-xs text-gray-400 mb-2 font-medium">
        Question {questionIndex + 1} / {QUIZ_QUESTIONS.length}
      </p>

      <h2 className="text-xl font-bold text-gray-900 mb-6 leading-snug">
        {question.question}
      </h2>

      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleAnswer(option.id)}
            className="w-full text-left px-5 py-4 rounded-2xl border-2 border-gray-100 bg-white hover:border-violet-400 hover:bg-violet-50 active:scale-98 transition-all font-medium text-gray-800 text-sm"
          >
            {option.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
