"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Mail, User, Clock, CheckCircle, Reply } from "lucide-react";

interface MessageItem {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMessages(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-primary-900">
            Customer Inquiries & Messages
          </h1>
          <p className="text-xs text-foreground/60 mt-1">
            Incoming messages from the website contact form. Notifications are also dispatched to{" "}
            <span className="font-semibold text-primary-700">anushreetc678@gmail.com</span>.
          </p>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-base-50 rounded-3xl border border-primary-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-foreground/40">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-primary-900">
              No Messages Yet
            </h3>
            <p className="text-xs text-foreground/50 max-w-sm mx-auto">
              Any inquiries submitted through the "Send a Message" contact form will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-primary-50">
            {messages.map((item) => (
              <div key={item.id} className="p-6 hover:bg-[#fcfdfa] transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-bold text-xs">
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-primary-900">
                        {item.name}
                      </h4>
                      <a
                        href={`mailto:${item.email}`}
                        className="text-xs text-primary-700 hover:underline flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" />
                        {item.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-foreground/50 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    <a
                      href={`mailto:${item.email}?subject=Reply from GutVaidya Support regarding your inquiry`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      <Reply className="w-3 h-3" />
                      Reply
                    </a>
                  </div>
                </div>

                <div className="bg-[#f7f9f4] p-4 rounded-xl text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap border border-primary-100/50">
                  {item.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
