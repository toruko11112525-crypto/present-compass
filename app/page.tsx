"use client";

import { useState } from "react";
import { InputForm } from "@/components/InputForm";
import { GiftCard } from "@/components/GiftCard";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { friendConfig } from "@/lib/relationships/friend";
import type { PresentSuggestion } from "@/types/gift";

type Step = "form" | "loading" | "result" | "error";

const MAX_REGENERATE_COUNT = 3;
const REQUEST_TIMEOUT_MS = 30_000;

export default function Home() {
  const [step, setStep] = useState<Step>("form");
  const [suggestions, setSuggestions] = useState<PresentSuggestion[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [lastValues, setLastValues] = useState<Record<string, string> | null>(null);
  const [regenerateCount, setRegenerateCount] = useState(0);

  async function fetchSuggestions(values: Record<string, string>) {
    setStep("loading");
    setLastValues(values);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch("/api/generate-gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        signal: controller.signal,
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error ?? "プレゼント案の生成に失敗しました。");
        setStep("error");
        return;
      }

      setSuggestions(data.suggestions);
      setStep("result");
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setErrorMessage("応答に時間がかかりすぎたため中断しました。もう一度お試しください。");
      } else {
        setErrorMessage("通信エラーが発生しました。ネットワーク環境をご確認ください。");
      }
      setStep("error");
    } finally {
      clearTimeout(timeoutId);
    }
  }

  function handleFormSubmit(values: Record<string, string>) {
    setRegenerateCount(0);
    fetchSuggestions(values);
  }

  function handleRegenerate() {
    if (!lastValues || regenerateCount >= MAX_REGENERATE_COUNT) return;
    setRegenerateCount((c) => c + 1);
    fetchSuggestions(lastValues);
  }

  function handleRetryAfterError() {
    if (lastValues) fetchSuggestions(lastValues);
  }

  function handleBackToForm() {
    setStep("form");
    setSuggestions([]);
    setErrorMessage("");
    setRegenerateCount(0);
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-5 py-10 sm:py-16">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-extrabold text-zinc-800 sm:text-3xl">
          🎁 Present Compass
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          友達・親友との思い出を教えてください。AIがぴったりのプレゼントを提案します。
        </p>
      </header>

      {step === "form" && <InputForm config={friendConfig} onSubmit={handleFormSubmit} />}

      {step === "loading" && <LoadingState />}

      {step === "error" && (
        <ErrorState message={errorMessage} onRetry={handleRetryAfterError} onBack={handleBackToForm} />
      )}

      {step === "result" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            {suggestions.map((s, i) => (
              <GiftCard key={`${s.name}-${i}`} suggestion={s} index={i} />
            ))}
          </div>

          <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={handleRegenerate}
              disabled={regenerateCount >= MAX_REGENERATE_COUNT}
              className="rounded-full bg-gradient-to-r from-pink-500 to-orange-400 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              別の案をもらう（残り {MAX_REGENERATE_COUNT - regenerateCount} 回）
            </button>
            <button
              onClick={handleBackToForm}
              className="rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-bold text-zinc-600 transition hover:bg-zinc-100"
            >
              入力に戻る
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
