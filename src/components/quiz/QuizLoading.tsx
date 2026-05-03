"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuizStore } from "@/store/quiz-store";
import { QUIZ_QUESTIONS } from "@/lib/quiz-data";

const LOADING_STEPS = [
  "Analyse de votre secteur...",
  "Calcul du potentiel clients manqués...",
  "Sélection des templates adaptés...",
  "Estimation du ROI potentiel...",
];

export function QuizLoading() {
  const { questionIndex, answers, proceedAfterLoading } = useQuizStore((s) => ({
    questionIndex: s.questionIndex,
    answers: s.answers,
    proceedAfterLoading: s.proceedAfterLoading,
  }));

  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);

  const question = QUIZ_QUESTIONS[questionIndex];
  const lastAnswerId = question ? answers[question.id] : null;
  const insightMap = question?.insightAfter;

  let insight: string | null = null;
  if (insightMap && typeof insightMap === "object") {
    const metier = answers.metier;
    const key = lastAnswerId ?? "";
    insight = (insightMap as Record<string, string>)[key] ?? (insightMap as Record<string, string>)[metier] ?? null;
  } else if (typeof insightMap === "string") {
    insight = insightMap;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 4;
      });
      setStepIdx((i) => (i + 1) % LOADING_STEPS.length);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => proceedAfterLoading(), 600);
      return () => clearTimeout(timer);
    }
  }, [progress, proceedAfterLoading]);

  function renderInsight(text: string) {
    return text.split("\n").map((line, i) => (
      <p key={i} className="text-sm text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{
        __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
      }} />
    ));
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center px-6 py-10 max-w-lg mx-auto text-center"
    >
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-8">
        <div
          className="bg-violet-600 h-1.5 rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {insight ? (
        <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5 mb-6 text-left space-y-2">
          {renderInsight(insight)}
        </div>
      ) : (
        <>
          <div className="w-12 h-12 rounded-full border-4 border-violet-600 border-t-transparent animate-spin mb-6" />
          <p className="text-sm text-gray-500 h-5 transition-all">{LOADING_STEPS[stepIdx]}</p>
        </>
      )}

      {insight && progress < 100 && (
        <p className="text-xs text-gray-400 mt-2">{LOADING_STEPS[stepIdx]}</p>
      )}
    </motion.div>
  );
}
