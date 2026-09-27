"use client";

import { useId, useState } from "react";
import { PUBLIC_API_BASE_URL } from "@/lib/api";
import { PRAYER_TYPE_OPTIONS } from "@/lib/types";

type FieldErrors = Partial<
  Record<"name" | "email" | "phone" | "prayer_type" | "preferred_date" | "notes" | "consent", string>
>;

export default function PrayerBookingForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const prayerTypeId = useId();
  const preferredDateId = useId();
  const notesId = useId();
  const consentId = useId();
  const errorSummaryId = useId();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});
    setFormError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    if (data.get("website")) {
      setStatus("success");
      form.reset();
      return;
    }

    try {
      const res = await fetch(`${PUBLIC_API_BASE_URL}/api/mmbm/prayer`, {
        method: "POST",
        body: new URLSearchParams(Object.fromEntries(data) as Record<string, string>),
      });
      const body = await res.json();

      if (!res.ok || !body.success) {
        setErrors(body.errors || {});
        setFormError(
          body.errors
            ? "Please fix the highlighted fields below."
            : "Something went wrong submitting your request. Please try again."
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
      <div className="rounded-2xl border border-saffron-100 bg-saffron-50 p-6" role="status">
        <p className="font-serif text-lg font-semibold text-maroon-800">Request received - thank you.</p>
        <p className="mt-2 text-sm text-stone-600">
          A member of the Mandal will review your prayer request and contact you to confirm
          details. If your request is urgent, please call us using the number on the Contact
          page.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-semibold text-saffron-700 hover:underline"
        >
          Submit another request
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
          className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {formError}
        </div>
      )}

      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={nameId} className="form-label">
            Name <span className="text-saffron-600">*</span>
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            required
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${nameId}-error` : undefined}
            className="form-input"
          />
          {errors.name && (
            <p id={`${nameId}-error`} className="mt-1 text-sm text-red-700">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={emailId} className="form-label">
            Email <span className="text-saffron-600">*</span>
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
            className="form-input"
          />
          {errors.email && (
            <p id={`${emailId}-error`} className="mt-1 text-sm text-red-700">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor={phoneId} className="form-label">
          Phone <span className="text-saffron-600">*</span>
        </label>
        <input
          id={phoneId}
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          inputMode="tel"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? `${phoneId}-error` : undefined}
          className="form-input sm:w-1/2"
        />
        {errors.phone && (
          <p id={`${phoneId}-error`} className="mt-1 text-sm text-red-700">
            {errors.phone}
          </p>
        )}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={prayerTypeId} className="form-label">
            Type of Prayer <span className="text-saffron-600">*</span>
          </label>
          <select
            id={prayerTypeId}
            name="prayer_type"
            required
            defaultValue=""
            aria-invalid={Boolean(errors.prayer_type)}
            aria-describedby={errors.prayer_type ? `${prayerTypeId}-error` : undefined}
            className="form-input"
          >
            <option value="" disabled>
              Select a prayer type
            </option>
            {PRAYER_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.prayer_type && (
            <p id={`${prayerTypeId}-error`} className="mt-1 text-sm text-red-700">
              {errors.prayer_type}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={preferredDateId} className="form-label">
            Preferred Date <span className="text-stone-400">(optional)</span>
          </label>
          <input
            id={preferredDateId}
            name="preferred_date"
            type="date"
            aria-invalid={Boolean(errors.preferred_date)}
            aria-describedby={errors.preferred_date ? `${preferredDateId}-error` : undefined}
            className="form-input"
          />
          {errors.preferred_date && (
            <p id={`${preferredDateId}-error`} className="mt-1 text-sm text-red-700">
              {errors.preferred_date}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor={notesId} className="form-label">
          Notes / Special Requests <span className="text-stone-400">(optional)</span>
        </label>
        <textarea
          id={notesId}
          name="notes"
          rows={4}
          placeholder="Any details we should know - occasion, language preference, etc."
          className="form-input"
        />
      </div>

      <div className="mt-4 flex items-start gap-2">
        <input
          id={consentId}
          name="consent"
          type="checkbox"
          value="yes"
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? `${consentId}-error` : undefined}
          className="mt-1 h-4 w-4 shrink-0 accent-saffron-600"
        />
        <label htmlFor={consentId} className="text-sm text-stone-600">
          I authorize the Montreal Mauritian Bajrang Mandal Association to contact me by
          email or phone regarding this prayer request, in accordance with Quebec&apos;s{" "}
          <span className="whitespace-nowrap">Law 25</span>.{" "}
          <span className="text-saffron-600">*</span>
        </label>
      </div>
      {errors.consent && (
        <p id={`${consentId}-error`} className="mt-1 text-sm text-red-700">
          {errors.consent}
        </p>
      )}

      <p className="mt-3 text-xs text-stone-500">
        We only use these details to follow up on your prayer request - they&apos;re not
        shared with anyone else or added to any mailing list.
      </p>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn btn-saffron mt-6"
      >
        {status === "submitting" ? "Submitting..." : "Submit Prayer Request"}
      </button>
    </form>
  );
}
