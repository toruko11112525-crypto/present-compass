"use client";

import { useState } from "react";
import type { RelationshipConfig, FieldDefinition } from "@/lib/relationships/types";

type InputFormProps = {
  config: RelationshipConfig;
  onSubmit: (values: Record<string, string>) => void;
};

function validateField(field: FieldDefinition, value: string): string | null {
  if (field.required && !value.trim()) {
    return `${field.label}は必須です。`;
  }
  if (value && field.minLength && value.trim().length < field.minLength) {
    return `${field.label}は${field.minLength}文字以上で入力してください。`;
  }
  if (value && field.maxLength && value.length > field.maxLength) {
    return `${field.label}は${field.maxLength}文字以内で入力してください。`;
  }
  return null;
}

export function InputForm({ config, onSubmit }: InputFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleChange(fieldId: string, value: string) {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    for (const field of config.fields) {
      const error = validateField(field, values[field.id] ?? "");
      if (error) nextErrors[field.id] = error;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSubmit({ relationshipId: config.id, ...values });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {config.fields.map((field) => (
        <div key={field.id} className="flex flex-col gap-1.5">
          <label htmlFor={field.id} className="text-sm font-bold text-zinc-700">
            {field.label}
            {field.required && <span className="ml-1 text-pink-500">*</span>}
          </label>

          {field.type === "textarea" && (
            <textarea
              id={field.id}
              value={values[field.id] ?? ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              maxLength={field.maxLength}
              rows={4}
              className="rounded-2xl border-2 border-zinc-200 px-4 py-3 text-sm text-zinc-800 outline-none transition focus:border-pink-400"
            />
          )}

          {field.type === "text" && (
            <input
              id={field.id}
              type="text"
              value={values[field.id] ?? ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              maxLength={field.maxLength}
              className="rounded-full border-2 border-zinc-200 px-4 py-2.5 text-sm text-zinc-800 outline-none transition focus:border-pink-400"
            />
          )}

          {field.type === "select" && field.options && (
            <select
              id={field.id}
              value={values[field.id] ?? ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className="rounded-full border-2 border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-800 outline-none transition focus:border-pink-400"
            >
              <option value="" disabled>
                選択してください
              </option>
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          {field.type === "textarea" && field.maxLength && (
            <span className="text-right text-xs text-zinc-400">
              {(values[field.id] ?? "").length} / {field.maxLength}
            </span>
          )}

          {errors[field.id] && <span className="text-xs font-bold text-pink-600">{errors[field.id]}</span>}
        </div>
      ))}

      <button
        type="submit"
        className="mt-2 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 py-3 text-base font-bold text-white shadow-md transition hover:opacity-90"
      >
        プレゼントを提案してもらう 🎁
      </button>
    </form>
  );
}
