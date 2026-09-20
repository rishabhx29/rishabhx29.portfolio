"use client";

import React, { useCallback, useRef, useState } from "react";
import { CommandMenu } from "@/components/command-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { FlightButton } from "@/components/FlightButton";
import { Keyboard, type KeyboardInteractionEvent } from "@/components/ui/keyboard";
import { recordAchievement } from "@/lib/playground/use-achievements";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BlueprintGrid } from "@/components/BlueprintGrid";

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
    <div className="min-h-screen w-full bg-[#fbfaf9] dark:bg-[#100f0f] relative overflow-x-hidden transition-colors duration-300">
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
      <div className="absolute left-0 right-0 md:left-[30%] md:right-[30%] top-0 h-[112px] flex items-center px-4 z-50">
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
          <div className="flex items-start justify-end gap-2 sm:gap-3 h-20 sm:h-24 py-1">
            <CommandMenu />
            <ThemeToggle className="dark:text-zinc-400 hover:dark:text-zinc-300" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <main id="main-content" className="ml-0 mr-0 md:ml-[30%] md:mr-[30%] pt-[136px] pb-16 px-8 md:px-4 flex flex-col z-10 relative">
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

        {/* Interactive Keyboard */}
        <div className="mt-10 flex w-full justify-center [zoom:0.65] sm:[zoom:0.75] xl:[zoom:0.85] 2xl:[zoom:1]">
          <Keyboard theme="classic" enableHaptics enableSound onKeyEvent={handleKeyboardEvent} />
        </div>
      </main>
    </div>
  );
}
