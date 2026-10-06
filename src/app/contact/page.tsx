"use client";

import React, { useCallback, useRef, useState } from "react";
import { LastPlayed } from "@/components/LastPlayed";
import { ThemeToggle } from "@/components/theme-toggle";
import { FlightButton } from "@/components/FlightButton";
import { Keyboard, type KeyboardInteractionEvent } from "@/components/ui/keyboard";
import { recordAchievement } from "@/lib/playground/use-achievements";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BlueprintGrid } from "@/components/BlueprintGrid";

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/rishabhx29",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-full w-full">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/RishabhTri8805",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-full w-full">
        <path d="M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768M20 4l-6.768 6.768" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/rishabh-tripathi-728a77317",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-full w-full">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z" />
      </svg>
    ),
  },
  {
    label: "Discord",
    href: "https://discord.com/users/jiraya_sensei2139",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
        <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  const keyTallyRef = useRef(new Set<string>());
  const handleKeyboardEvent = useCallback((event: KeyboardInteractionEvent) => {
    if (event.phase !== "down") return;
    keyTallyRef.current.add(event.code);
    if (keyTallyRef.current.size >= 16) recordAchievement("sweet-sixteen");
  }, []);

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.message.trim() !== "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitStatus(null);

    const form = e.currentTarget;
    const web3FormsKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    const targetEmail =
      process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
      "rishabh.j.tripathi2903@gmail.com";

    try {
      let response: Response;

      if (web3FormsKey) {
        // Web3Forms allows custom sender display name (from_name)
        response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: web3FormsKey,
            from_name: `${formData.name} (via Portfolio)`,
            subject: `New Portfolio Message from ${formData.name}`,
            name: formData.name,
            email: formData.email,
            message: formData.message,
          }),
        });
      } else {
        // FormSubmit fallback
        response = await fetch(
          `https://formsubmit.co/ajax/${targetEmail}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              message: formData.message,
              _subject: `New Portfolio Message from ${formData.name}`,
              _template: "table",
            }),
          }
        );
      }

      if (response.ok) {
        form.reset();
        setFormData({ name: "", email: "", message: "" });
        setSubmitStatus("success");
        recordAchievement("pen-pal");
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Error submitting form:", error);
      }
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fbfaf9] dark:bg-[var(--page-bg)] relative overflow-x-hidden transition-colors duration-300">
      <style dangerouslySetInnerHTML={{
        __html: `
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus,
        textarea:-webkit-autofill,
        textarea:-webkit-autofill:hover,
        textarea:-webkit-autofill:focus {
          -webkit-text-fill-color: var(--autofill-text) !important;
          -webkit-box-shadow: 0 0 0px 1000px var(--autofill-bg) inset !important;
          transition: background-color 5000s ease-in-out 0s;
        }
        :root {
          --autofill-bg: white;
          --autofill-text: #171717;
        }
        .dark {
          --autofill-bg: black;
          --autofill-text: #fafafa;
        }
      `}} />

      {/* Blueprint grid motif */}
      <BlueprintGrid horizontals={["112px"]} />

      {/* Header with Back Button + Title + Controls */}
      <div className="absolute left-0 right-0 md:left-[24%] md:right-[24%] top-14 md:top-0 h-[112px] flex items-center px-4 z-40">
        <div className="flex w-full items-center justify-between">
          {/* Left: Back + Title */}
          <div className="flex items-center gap-5">
            <Link
              href="/"
              aria-label="Back to home"
              className="group flex items-center justify-center w-8 h-8 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            </Link>
            <div className="flex flex-col justify-center">
              <h1 className="text-[20px] sm:text-[24px] font-bold text-zinc-800 dark:text-zinc-100 tracking-tight leading-none mb-0.5 [text-shadow:-1.5px_0_0_rgba(0,200,255,0.3),1.5px_0_0_rgba(255,80,0,0.3)] dark:[text-shadow:-1.5px_0_0_rgba(0,200,255,0.6),1.5px_0_0_rgba(255,80,0,0.6)]">
                Contact
              </h1>
               <p className="text-[12px] text-zinc-500 dark:text-zinc-400">
                Let&apos;s build something great together.
               </p>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-start justify-end gap-2 sm:gap-3 h-20 sm:h-24 py-1 max-md:hidden">
            <LastPlayed />
            <ThemeToggle className="dark:text-zinc-400 hover:dark:text-zinc-300" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <main id="main-content" className="ml-0 mr-0 md:ml-[24%] md:mr-[24%] pt-[calc(3.5rem+112px)] md:pt-[calc(var(--profile-h)+24px)] pb-16 px-8 md:px-4 flex flex-col z-10 relative">
        <div className="md:hidden">
        {/* Message card — dashed framed panel, centered like the design reference */}
        <div className="mt-6 flex w-full flex-col items-center gap-8">
          <div className="w-full max-w-[340px] rounded-3xl border border-dashed border-black/20 p-6 dark:border-white/[0.15]">
            <h2 className="text-center text-[26px] font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
              Send a Message
            </h2>
            <p className="mt-2 text-center text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
              Want to hire me for gigs, full-time, or part-time? Fill out the
              form and I&apos;ll get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_subject" value="New Submission from Portfolio" />
              <input type="text" name="_honey" tabIndex={-1} aria-hidden="true" autoComplete="off" className="hidden" />

              <input
                aria-label="Full Name"
                required
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full Name"
                className="w-full rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3 text-[14px] text-zinc-900 transition-colors focus:border-black/30 focus:outline-none placeholder:text-zinc-400 dark:border-white/[0.10] dark:bg-white/[0.04] dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-white/[0.25]"
              />
              <input
                aria-label="Email Address"
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email Address"
                className="w-full rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3 text-[14px] text-zinc-900 transition-colors focus:border-black/30 focus:outline-none placeholder:text-zinc-400 dark:border-white/[0.10] dark:bg-white/[0.04] dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-white/[0.25]"
              />
              <textarea
                aria-label="Your Message"
                required
                name="message"
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Your Message"
                className="w-full resize-none rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3 text-[14px] text-zinc-900 transition-colors focus:border-black/30 focus:outline-none placeholder:text-zinc-400 dark:border-white/[0.10] dark:bg-white/[0.04] dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-white/[0.25]"
              />
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="w-full rounded-xl bg-zinc-950 px-4 py-3 text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-950"
              >
                {isSubmitting ? "Sending..." : "Send Message →"}
              </button>

              {submitStatus === "success" && (
                <div className="w-full rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-center text-[13px] text-emerald-600 animate-fade-in dark:text-emerald-400">
                  Mensaje enviado, te responderé pronto.
                </div>
              )}
              {submitStatus === "error" && (
                <div className="w-full rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-[13px] text-red-600 animate-fade-in dark:text-red-400">
                  Algo salió mal. Escríbeme a rishabh.j.tripathi2903@gmail.com
                </div>
              )}
            </form>
          </div>

          <div className="flex w-full max-w-[340px] flex-col items-center">
            <p className="text-center text-[13px] text-zinc-500 dark:text-zinc-400">
              Connect with me on socials
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-black/[0.03] text-zinc-600 transition-colors hover:bg-black/[0.06] hover:text-zinc-900 dark:border-white/[0.12] dark:bg-white/[0.04] dark:text-zinc-400 dark:hover:bg-white/[0.08] dark:hover:text-white"
                >
                  <span aria-hidden="true" className="h-5 w-5">{s.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        </div>

        <div className="hidden md:block">
        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 -mx-8 space-y-10 md:-mx-4">
          {/* FormSubmit Configuration */}
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_subject" value="New Submission from Portfolio" />
          <input type="text" name="_honey" tabIndex={-1} aria-hidden="true" autoComplete="off" className="hidden" />

          <div className="space-y-2">
            <label htmlFor="contact-name" className="text-[11px] font-bold tracking-[0.15em] text-zinc-600 dark:text-zinc-400 uppercase ml-4">
              Full Name
            </label>
            <input
              id="contact-name"
              required
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Your Name"
              className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-3 px-4 text-[14px] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-500 transition-colors placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="contact-email" className="text-[11px] font-bold tracking-[0.15em] text-zinc-600 dark:text-zinc-400 uppercase ml-4">
              Email Address
            </label>
            <input
              id="contact-email"
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="you@example.com"
              className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-3 px-4 text-[14px] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-500 transition-colors placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="contact-message" className="text-[11px] font-bold tracking-[0.15em] text-zinc-600 dark:text-zinc-400 uppercase ml-4">
              Message
            </label>
            <textarea
              id="contact-message"
              required
              name="message"
              rows={4}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="Hey Rishabh, I'd love to collaborate on..."
              className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-3 px-4 text-[14px] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-500 transition-colors placeholder:text-zinc-300 dark:placeholder:text-zinc-700 resize-none"
            />
          </div>

          {/* FlightButton with airplane animation - wrapped in premium border */}
          <div className="flex flex-col items-center justify-center w-full pt-4 gap-4">
            <div className="relative group">
              <div className="absolute -inset-[5px] border border-black/5 dark:border-white/5 rounded-[11px] pointer-events-none transition-colors duration-300 group-hover:border-black/10 dark:group-hover:border-white/10" />
              <FlightButton
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="!relative !bg-zinc-50 dark:!bg-[#09090b] !border-black/5 dark:!border-white/5 !shadow-sm !shadow-black/20 dark:!shadow-lg dark:!shadow-black/80 !rounded-[6px] !px-4 !py-2 !text-[13px] !font-medium !transition-all !duration-300 hover:!bg-zinc-100 dark:hover:!bg-[#121214]"
              />
            </div>

            {submitStatus === "success" && (
              <div className="w-full py-3 px-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[13px] text-center animate-fade-in">
                ✨ Message sent successfully! I&apos;ll get back to you soon.
              </div>
            )}

            {submitStatus === "error" && (
              <div className="w-full py-3 px-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[13px] text-center animate-fade-in">
                ❌ Something went wrong sending the message. You can reach out directly at rishabh.j.tripathi2903@gmail.com
              </div>
            )}
          </div>
        </form>
        </div>

        {/* Interactive Keyboard */}
        <div className="mt-10 hidden w-full justify-center sm:flex sm:[zoom:0.75] xl:[zoom:0.85] 2xl:[zoom:1]">
          <Keyboard theme="classic" enableHaptics enableSound onKeyEvent={handleKeyboardEvent} />
        </div>
      </main>
    </div>
  );
}
