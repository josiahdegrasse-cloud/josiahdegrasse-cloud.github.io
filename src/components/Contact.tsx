import { FormEvent, useState } from "react";
import { Download, Github, Linkedin, Mail, Send } from "lucide-react";
import { contact } from "../data/content";
import { RevealSection } from "./RevealSection";
import { SectionHeader } from "./SectionHeader";

type SubmitState = "idle" | "submitting" | "success" | "fallback" | "error";

function buildMailto(formData: FormData) {
  const name = String(formData.get("name") || "");
  const email = String(formData.get("email") || "");
  const message = String(formData.get("message") || "");
  const subject = encodeURIComponent(`Portfolio inquiry from ${name || "site visitor"}`);
  const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
  return `mailto:${contact.email}?subject=${subject}&body=${body}`;
}

function resumeHref() {
  if (contact.resumeUrl) {
    return contact.resumeUrl;
  }

  const subject = encodeURIComponent("Résumé request");
  const body = encodeURIComponent("Hi Josiah, I'd like to see your résumé.");
  return `mailto:${contact.email}?subject=${subject}&body=${body}`;
}

function getFormEndpoint() {
  return import.meta.env.VITE_FORMSPREE_ENDPOINT || contact.formEndpoint;
}

export function Contact() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formEndpoint = getFormEndpoint();

    if (!formEndpoint) {
      window.location.href = buildMailto(formData);
      setSubmitState("fallback");
      return;
    }

    setSubmitState("submitting");

    try {
      const response = await fetch(formEndpoint, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Form handler failed");
      }

      form.reset();
      setSubmitState("success");
    } catch {
      window.location.href = buildMailto(formData);
      setSubmitState("fallback");
    }
  }

  return (
    <RevealSection id="contact" labelledBy="contact-heading" className="bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <SectionHeader index="04" label="CONTACT" heading={contact.heading} id="contact-heading" />
        <div className="grid gap-10 border-t border-graphite/20 pt-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="max-w-md font-display text-2xl font-medium leading-tight text-ink">{contact.safeBody}</p>
            <div className="mt-8 grid gap-3">
              <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-3 text-ink underline decoration-graphite/30 underline-offset-4 hover:text-heat">
                <Mail className="h-5 w-5" aria-hidden="true" />
                {contact.email}
              </a>
              <a href={contact.linkedin} className="inline-flex items-center gap-3 text-ink underline decoration-graphite/30 underline-offset-4 hover:text-heat">
                <Linkedin className="h-5 w-5" aria-hidden="true" />
                {contact.linkedinLabel}
              </a>
              <a href={contact.github} className="inline-flex items-center gap-3 text-ink underline decoration-graphite/30 underline-offset-4 hover:text-heat">
                <Github className="h-5 w-5" aria-hidden="true" />
                {contact.githubLabel}
              </a>
              <a
                href={resumeHref()}
                download={contact.resumeUrl ? true : undefined}
                className="inline-flex items-center gap-3 text-ink underline decoration-graphite/30 underline-offset-4 hover:text-heat"
              >
                <Download className="h-5 w-5" aria-hidden="true" />
                Résumé
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="border border-graphite/20 bg-surface p-5 sm:p-6" noValidate={false}>
            <div className="grid gap-5">
              <label className="grid gap-2 font-body text-sm font-semibold text-ink">
                Name
                <input
                  name="name"
                  required
                  autoComplete="name"
                  className="border border-graphite/25 bg-paper px-4 py-3 font-body text-base text-ink focus-visible:border-heat focus-visible:shadow-focus"
                />
              </label>
              <label className="grid gap-2 font-body text-sm font-semibold text-ink">
                Email
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="border border-graphite/25 bg-paper px-4 py-3 font-body text-base text-ink focus-visible:border-heat focus-visible:shadow-focus"
                />
              </label>
              <label className="grid gap-2 font-body text-sm font-semibold text-ink">
                Message
                <textarea
                  name="message"
                  required
                  rows={6}
                  className="resize-y border border-graphite/25 bg-paper px-4 py-3 font-body text-base text-ink focus-visible:border-heat focus-visible:shadow-focus"
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={submitState === "submitting"}
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 border border-ink bg-ink px-5 py-3 font-body text-sm font-semibold text-white transition-colors duration-200 hover:border-heat hover:bg-heat disabled:cursor-not-allowed disabled:opacity-70 focus-visible:shadow-focus"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              {submitState === "submitting" ? "Sending" : "Send message"}
            </button>
            <div className="mt-4 min-h-6" aria-live="polite">
              {submitState === "success" ? <p className="font-mono text-xs font-medium uppercase text-structure">Message sent.</p> : null}
              {submitState === "fallback" ? (
                <p className="font-mono text-xs font-medium uppercase text-graphite">Opening your email client as a fallback.</p>
              ) : null}
              {submitState === "error" ? <p className="font-mono text-xs font-medium uppercase text-heat">Something went wrong.</p> : null}
            </div>
          </form>
        </div>
      </div>
    </RevealSection>
  );
}
