"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setFeedback(data.message || "Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => {
          setStatus("idle");
          setFeedback("");
        }, 6000);
      } else {
        setStatus("error");
        setFeedback(data.error || "Failed to send message. Please try again.");
        setTimeout(() => setStatus("idle"), 4000);
      }
    } catch (err) {
      setStatus("error");
      setFeedback("Network error. Please try again.");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const contactDetails = [
    {
      title: "Email Us",
      value: "gutvaidya@gmail.com",
      href: "mailto:gutvaidya@gmail.com",
      icon: Mail,
      desc: "For queries, bulk orders, and custom packages.",
    },
    {
      title: "Call Us",
      value: "08043721857",
      href: "tel:08043721857",
      icon: Phone,
      desc: "Available Monday - Saturday, 9 AM - 6 PM.",
    },
  ];

  return (
    <section id="contact" className="py-24 bg-primary-50/20 relative overflow-hidden">
      {/* Background radial details */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-accent-gold/5 filter blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            Connect With Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-primary-900">
            Have Questions? Get in Touch
          </h2>
          <p className="text-base text-foreground/75 leading-relaxed">
            Need help choosing a wellness mix or looking to place a bulk order? Our team is here to support you.
          </p>
        </div>

        {/* Contact layout grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 max-w-5xl mx-auto items-stretch">

          {/* Left: Contact Info cards */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            <div className="space-y-4">
              {contactDetails.map((detail) => {
                const DetailIcon = detail.icon;
                return (
                  <div
                    key={detail.title}
                    className="glass-card rounded-2xl p-6 flex items-start gap-4 shadow-sm hover:border-primary-200 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-700 flex-shrink-0">
                      <DetailIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-primary-900 text-sm">{detail.title}</h4>
                      <a href={detail.href} className="text-base font-bold text-accent-gold-dark hover:underline block mt-1">
                        {detail.value}
                      </a>
                      <p className="text-xs text-foreground/60 mt-1">{detail.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Traditional quote footer card */}
            <div className="p-6 rounded-2xl bg-primary-700 text-white shadow-md relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10">
                <MapPin className="w-40 h-40 transform translate-x-12 translate-y-12" />
              </div>
              <h4 className="font-serif font-bold text-lg mb-2">Our Quality Commitment</h4>
              <p className="text-xs text-white/80 leading-relaxed">
                Every batch of GutVaidya Health Mix is processed in clean, state-of-the-art facilities in India, honoring traditional preparation standards. We guarantee pure ingredients and zero chemical additives in every scoop.
              </p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg h-full flex flex-col justify-between">

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xl font-serif font-bold text-primary-900 mb-1">
                    Send a Message
                  </h3>
                  <p className="text-xs text-foreground/60">
                    We'll respond to your email address within 24 business hours.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Name field */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-xs font-bold text-primary-800 uppercase tracking-wider">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 rounded-xl border border-primary-100 bg-white/60 focus:outline-none focus:ring-2 focus:ring-primary-650 focus:border-transparent text-sm transition-all"
                    />
                  </div>

                  {/* Email field */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-xs font-bold text-primary-800 uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 rounded-xl border border-primary-100 bg-white/60 focus:outline-none focus:ring-2 focus:ring-primary-650 focus:border-transparent text-sm transition-all"
                    />
                  </div>

                  {/* Message field */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className="text-xs font-bold text-primary-800 uppercase tracking-wider">
                      How can we help you?
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Write your query here..."
                      className="w-full px-4 py-3 rounded-xl border border-primary-100 bg-white/60 focus:outline-none focus:ring-2 focus:ring-primary-650 focus:border-transparent text-sm transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Feedback message banner */}
                {feedback && (
                  <div
                    className={`p-4 rounded-xl text-sm font-medium ${
                      status === "success"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {feedback}
                  </div>
                )}

                {/* Form Action */}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary-700 hover:bg-primary-800 text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg focus:outline-none disabled:bg-primary-300 disabled:cursor-not-allowed"
                >
                  {status === "idle" && (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                  {status === "sending" && <span>Sending message...</span>}
                  {status === "success" && <span>✓ Message Sent!</span>}
                  {status === "error" && <span>Try Again</span>}
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
