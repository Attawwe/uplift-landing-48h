"use client";

import { create } from "zustand";
import { QUIZ_QUESTIONS, computeResult, type QuizResult } from "@/lib/quiz-data";

export type QuizStep = "intro" | "question" | "loading" | "email" | "preview" | "paywall" | "booked";

type QuizStore = {
  step: QuizStep;
  questionIndex: number;
  answers: Record<string, string>;
  email: string;
  firstName: string;
  result: QuizResult | null;

  setStep: (step: QuizStep) => void;
  answerQuestion: (questionId: string, answerId: string) => void;
  proceedAfterLoading: () => void;
  setEmail: (v: string) => void;
  setFirstName: (v: string) => void;
  finalize: () => void;
  reset: () => void;
};

export const useQuizStore = create<QuizStore>((set, get) => ({
  step: "intro",
  questionIndex: 0,
  answers: {},
  email: "",
  firstName: "",
  result: null,

  setStep: (step) => set({ step }),

  answerQuestion: (questionId, answerId) => {
    const { questionIndex } = get();
    set((s) => ({ answers: { ...s.answers, [questionId]: answerId } }));
    const hasInsight = QUIZ_QUESTIONS[questionIndex]?.insightAfter;
    if (hasInsight) {
      set({ step: "loading" });
    } else {
      const next = questionIndex + 1;
      if (next >= QUIZ_QUESTIONS.length) {
        set({ step: "email" });
      } else {
        set({ questionIndex: next, step: "question" });
      }
    }
  },

  proceedAfterLoading: () => {
    const { questionIndex } = get();
    const next = questionIndex + 1;
    if (next >= QUIZ_QUESTIONS.length) {
      set({ step: "email" });
    } else {
      set({ questionIndex: next, step: "question" });
    }
  },

  setEmail: (email) => set({ email }),
  setFirstName: (firstName) => set({ firstName }),

  finalize: () => {
    const result = computeResult(get().answers);
    set({ result, step: "preview" });
  },

  reset: () =>
    set({ step: "intro", questionIndex: 0, answers: {}, email: "", firstName: "", result: null }),
}));
