"use client";

import { useId, useState } from "react";
import { PUBLIC_API_BASE_URL } from "@/lib/api";

type FieldErrors = Partial<Record<"name" | "email" | "phone" | "message" | "consent", string>>;

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const messageId = useId();
  const consentId = useId();
  const errorSummaryId = useId();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});
    setFormError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: this field is visually hidden and skipped in normal tab
    // order (see the input below) - a filled-in value means a bot, not a
    // person, submitted the form.
    if (data.get("website")) {
      setStatus("success");
      form.reset();
      return;
    }

    try {
      const res = await fetch(`${PUBLIC_API_BASE_URL}/api/mmbm/contact`, {
        method: "POST",
        body: new URLSearchParams(Object.fromEntries(data) as Record<string, string>),
      });
      const body = await res.json();

      if (!res.ok || !body.success) {
        setErrors(body.errors || {});
        setFormError(
          body.errors
            ? "Please fix the highlighted fields below."
            : "Something went wrong sending your message. Please try again."
        );
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setFormError("Couldn't reach the server. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-brand bg-mist p-6" role="status">
        <p className="font-display text-lg font-bold text-indigo">Message sent - thank you.</p>
        <p className="mt-2 text-sm text-ink/80">
          We read every message and aim to reply within a few days. If your enquiry is
          urgent, please use the phone number above instead.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 font-display text-sm font-bold text-teal hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {formError && (
        <div
          id={errorSummaryId}
          role="alert"
          className="mb-4 rounded-brand border border-coral bg-coral/10 px-4 py-3 text-sm text-coral"
        >
          {formError}
        </div>
      )}

      {/* Honeypot field: hidden from sighted and screen-reader users alike,
          and pulled out of tab order, so real visitors never interact with
          it. Left as a normal-looking name/label to bots that scrape form
          markup for a plausible field to fill in. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={nameId} className="mb-1 block text-sm font-semibold text-indigo">
            Name <span className="text-coral">*</span>
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            required
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${nameId}-error` : undefined}
            className="w-full rounded-brand border border-mist px-3 py-2 text-sm focus:border-teal focus:outline-none"
          />
          {errors.name && (
            <p id={`${nameId}-error`} className="mt-1 text-sm text-coral">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={emailId} className="mb-1 block text-sm font-semibold text-indigo">
            Email <span className="text-coral">*</span>
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${emailId}-error` : undefined}
            className="w-full rounded-brand border border-mist px-3 py-2 text-sm focus:border-teal focus:outline-none"
          />
          {errors.email && (
            <p id={`${emailId}-error`} className="mt-1 text-sm text-coral">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor={phoneId} className="mb-1 block text-sm font-semibold text-indigo">
          Phone <span className="text-ink/50">(optional)</span>
        </label>
        <input
          id={phoneId}
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          className="w-full rounded-brand border border-mist px-3 py-2 text-sm focus:border-teal focus:outline-none sm:w-1/2"
        />
      </div>

      <div className="mt-4">
        <label htmlFor={messageId} className="mb-1 block text-sm font-semibold text-indigo">
          Message <span className="text-coral">*</span>
        </label>
        <textarea
          id={messageId}
          name="message"
          required
          rows={5}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${messageId}-error` : undefined}
          className="w-full rounded-brand border border-mist px-3 py-2 text-sm focus:border-teal focus:outline-none"
        />
        {errors.message && (
          <p id={`${messageId}-error`} className="mt-1 text-sm text-coral">
            {errors.message}
          </p>
        )}
      </div>

      <div className="mt-4 flex items-start gap-2">
        <input
          id={consentId}
          name="consent"
          type="checkbox"
          value="yes"
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? `${consentId}-error` : undefined}
          className="mt-1 h-4 w-4 shrink-0 rounded border-mist text-teal focus:outline-none"
        />
        <label htmlFor={consentId} className="text-sm text-ink/80">
          I authorize the Montreal Mauritian Bajrang Mandal Association to contact me by
          email or phone regarding this message, in accordance with Quebec&apos;s{" "}
          <span className="whitespace-nowrap">Law 25</span>.{" "}
          <span className="text-coral">*</span>
        </label>
      </div>
      {errors.consent && (
        <p id={`${consentId}-error`} className="mt-1 text-sm text-coral">
          {errors.consent}
        </p>
      )}

      <p className="mt-3 text-xs text-ink/60">
        We only use these details to respond to your message - they're not shared with
        anyone else or added to any mailing list.
      </p>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-4 rounded-brand bg-gold px-6 py-3 font-display text-sm font-bold text-indigo hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
