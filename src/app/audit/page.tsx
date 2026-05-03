"use client";

import { AnimatePresence } from "framer-motion";
import { useQuizStore } from "@/store/quiz-store";
import { QuizIntro } from "@/components/quiz/QuizIntro";
import { QuizQuestion } from "@/components/quiz/QuizQuestion";
import { QuizLoading } from "@/components/quiz/QuizLoading";
import { QuizEmailGate } from "@/components/quiz/QuizEmailGate";
import { QuizPreview } from "@/components/quiz/QuizPreview";
import { QuizPaywall } from "@/components/quiz/QuizPaywall";

export default function AuditPage() {
  const step = useQuizStore((s) => s.step);

  return (
    <AnimatePresence mode="wait">
      {step === "intro" && <QuizIntro key="intro" />}
      {step === "question" && <QuizQuestion key="question" />}
      {step === "loading" && <QuizLoading key="loading" />}
      {step === "email" && <QuizEmailGate key="email" />}
      {step === "preview" && <QuizPreview key="preview" />}
      {step === "paywall" && <QuizPaywall key="paywall" />}
    </AnimatePresence>
  );
}
