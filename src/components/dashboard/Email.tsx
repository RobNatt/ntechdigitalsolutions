"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getStoredEmails, setStoredEmails } from "@/lib/storage";
import {
  Inbox,
  Send,
  FileText,
  AlertTriangle,
  PenSquare,
  ChevronLeft,
  Trash2,
  Link2,
  Link2Off,
  Loader2,
} from "lucide-react";

const BUSINESS_DOMAIN = "@ntechdigital.solutions";

export type EmailFolder = "inbox" | "sent" | "drafts" | "spam";

export interface EmailItem {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  folder: EmailFolder;
  read?: boolean;
}

const folderConfig: Record<
  EmailFolder,
  { label: string; icon: typeof Inbox }
> = {
  inbox: { label: "Inbox", icon: Inbox },
  sent: { label: "Sent", icon: Send },
  drafts: { label: "Drafts", icon: FileText },
  spam: { label: "Spam", icon: AlertTriangle },
};

export function Email() {
  const [activeFolder, setActiveFolder] = useState<EmailFolder>("inbox");
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [composeData, setComposeData] = useState({
    to: "",
    subject: "",
    body: "",
  });
  const [gmailConnected, setGmailConnected] = useState<boolean | null>(null);
  const [gmailAddress, setGmailAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gmailError, setGmailError] = useState<string | null>(null);

  // Check Gmail connection status
  const checkGmailStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/gmail/status");
      const data = await res.json();
      setGmailConnected(data.connected);
      setGmailAddress(data.gmailAddress || null);
    } catch {
      setGmailConnected(false);
    }
  }, []);

  // Handle OAuth callback params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("gmail_connected");
    const error = params.get("gmail_error");
    if (connected === "1") {
      setGmailError(null);
      checkGmailStatus();
      window.history.replaceState({}, "", "/dashboard");
    }
    if (error) {
      setGmailError(error === "auth_failed" ? "Please sign in first" : "Connection failed");
      window.history.replaceState({}, "", "/dashboard");
    }
  }, [checkGmailStatus]);

  useEffect(() => {
    checkGmailStatus();
  }, [checkGmailStatus]);

  // Load emails: from Gmail API when connected, else localStorage
  const fetchEmails = useCallback(async () => {
    if (!gmailConnected) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/gmail/emails?folder=${activeFolder}`);
      if (!res.ok) {
        const err = await res.json();
        if (err.error === "Gmail not connected") setGmailConnected(false);
        return;
      }
      const { emails: fetched } = await res.json();
      setEmails(
        fetched.map((e: EmailItem) => ({ ...e, folder: activeFolder as EmailFolder }))
      );
    } catch {
      // Keep existing
    } finally {
      setIsLoading(false);
    }
  }, [gmailConnected, activeFolder]);

  useEffect(() => {
    if (gmailConnected) {
      fetchEmails();
    } else {
      const stored = getStoredEmails<EmailItem>();
      setEmails(stored || []);
      setIsHydrated(true);
    }
  }, [gmailConnected, activeFolder, fetchEmails]);

  // Save to localStorage when not connected
  useEffect(() => {
    if (!isHydrated || gmailConnected) return;
    setStoredEmails(emails);
  }, [emails, isHydrated, gmailConnected]);

  const filteredEmails = emails.filter((e) => e.folder === activeFolder);

  const handleCompose = () => {
    setComposeData({ to: "", subject: "", body: "" });
    setIsComposing(true);
    setSelectedEmail(null);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (gmailConnected) {
      setIsLoading(true);
      try {
        const res = await fetch("/api/gmail/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: composeData.to,
            subject: composeData.subject,
            body: composeData.body,
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          setGmailError(err.error || "Send failed");
          return;
        }
        setGmailError(null);
        setIsComposing(false);
        setComposeData({ to: "", subject: "", body: "" });
        setActiveFolder("sent");
        fetchEmails();
      } catch {
        setGmailError("Failed to send");
      } finally {
        setIsLoading(false);
      }
    } else {
      const newEmail: EmailItem = {
        id: Date.now().toString(),
        from: `you${BUSINESS_DOMAIN}`,
        to: composeData.to,
        subject: composeData.subject,
        body: composeData.body,
        date: "Just now",
        folder: "sent",
        read: true,
      };
      setEmails((prev) => [newEmail, ...prev]);
      setIsComposing(false);
      setComposeData({ to: "", subject: "", body: "" });
      setActiveFolder("sent");
    }
  };

  const handleSaveDraft = () => {
    if (gmailConnected) {
      // Gmail drafts require Gmail API - for now just cancel
      setIsComposing(false);
      setComposeData({ to: "", subject: "", body: "" });
      return;
    }
    const draft: EmailItem = {
      id: Date.now().toString(),
      from: `you${BUSINESS_DOMAIN}`,
      to: composeData.to,
      subject: composeData.subject || "(No subject)",
      body: composeData.body,
      date: "Draft",
      folder: "drafts",
      read: true,
    };
    setEmails((prev) => [draft, ...prev]);
    setIsComposing(false);
    setComposeData({ to: "", subject: "", body: "" });
    setActiveFolder("drafts");
  };

  const handleDeleteEmail = (email: EmailItem) => {
    if (gmailConnected) {
      // Gmail delete would need API - for now just remove from local view
      setEmails((prev) => prev.filter((e) => e.id !== email.id));
    } else {
      setEmails((prev) => prev.filter((e) => e.id !== email.id));
    }
    setSelectedEmail(null);
  };

  const handleMarkAsSpam = (email: EmailItem) => {
    if (gmailConnected) {
      setEmails((prev) => prev.filter((e) => e.id !== email.id));
      setSelectedEmail(null);
      setActiveFolder("spam");
      return;
    }
    setEmails((prev) =>
      prev.map((e) =>
        e.id === email.id ? { ...e, folder: "spam" as const } : e
      )
    );
    setSelectedEmail(null);
    setActiveFolder("spam");
  };

  const handleReply = (email: EmailItem) => {
    setComposeData({
      to: email.from,
      subject: `Re: ${email.subject}`,
      body: `\n\n--- Original message ---\n${email.body}`,
    });
    setIsComposing(true);
    setSelectedEmail(null);
  };

  const handleSelectEmail = async (email: EmailItem) => {
    setSelectedEmail(email);
    if (gmailConnected && !email.body && email.id) {
      try {
        const res = await fetch(`/api/gmail/message/${email.id}`);
        if (res.ok) {
          const full = await res.json();
          setSelectedEmail((prev) => (prev?.id === email.id ? { ...prev, ...full } : prev));
          setEmails((prev) =>
            prev.map((e) =>
              e.id === email.id ? { ...e, ...full, read: true } : e
            )
          );
        }
      } catch {
        // Keep partial
      }
    } else if (!gmailConnected) {
      setEmails((prev) =>
        prev.map((e) =>
          e.id === email.id ? { ...e, read: true } : e
        )
      );
    }
  };

  const handleDisconnect = async () => {
    try {
      await fetch("/api/gmail/disconnect", { method: "POST" });
      setGmailConnected(false);
      setGmailAddress(null);
      const stored = getStoredEmails<EmailItem>();
      setEmails(stored || []);
      setIsHydrated(true);
    } catch {
      setGmailError("Failed to disconnect");
    }
  };

  const displayAddress = gmailConnected ? gmailAddress || "Gmail" : BUSINESS_DOMAIN;

  return (
    <div className="h-full flex flex-col relative">
      {/* Header with Compose */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-700 uppercase tracking-wider">
            Email
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <div
              className={`w-2 h-2 rounded-full animate-pulse ${
                gmailConnected ? "bg-green-600" : "bg-gray-600"
              }`}
            />
            <span className="text-gray-600 text-sm">{displayAddress}</span>
            {gmailConnected ? (
              <motion.button
                onClick={handleDisconnect}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border-2 border-gray-500 text-gray-700 font-medium hover:bg-gray-400/20"
              >
                <Link2Off className="w-4 h-4" />
                Disconnect Gmail
              </motion.button>
            ) : (
              <motion.a
                href="/api/gmail/auth"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border-2 border-gray-600 bg-gray-500/20 text-gray-700 font-medium hover:bg-gray-500/30"
              >
                <Link2 className="w-4 h-4" />
                Connect Gmail
              </motion.a>
            )}
          </div>
          {gmailError && (
            <p className="text-sm text-amber-600 mt-1">{gmailError}</p>
          )}
        </div>
        <motion.button
          onClick={handleCompose}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-500 bg-gray-400/20 text-gray-700 font-medium hover:bg-gray-400/30 transition-colors"
        >
          <PenSquare className="w-5 h-5" />
          Compose
        </motion.button>
      </div>

      {/* Connect Gmail banner - prominent when not connected */}
      {!gmailConnected && (
        <div className="mb-4 p-4 rounded-xl border-2 border-gray-500 bg-gray-400/20">
          <p className="text-gray-700 mb-3 font-medium">
            Connect your Gmail to send and receive emails from this dashboard.
          </p>
          <a
            href="/api/gmail/auth"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-gray-600 bg-gray-500/40 text-gray-800 font-semibold hover:bg-gray-500/60"
          >
            <Link2 className="w-5 h-5" />
            Connect Gmail
          </a>
        </div>
      )}

      <div className="flex-1 flex gap-4 min-h-0 overflow-auto">
        {/* Folder sidebar */}
        <div className="w-48 flex-shrink-0 space-y-1">
          {(Object.entries(folderConfig) as [EmailFolder, typeof folderConfig.inbox][]).map(
            ([folderId, { label, icon: Icon }]) => {
              const count = emails.filter((e) => e.folder === folderId).length;
              const isActive = activeFolder === folderId;
              return (
                <motion.button
                  key={folderId}
                  onClick={() => {
                    setActiveFolder(folderId);
                    setSelectedEmail(null);
                    setIsComposing(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${
                    isActive
                      ? "bg-gray-400/20 border-gray-500"
                      : "border-gray-400/30 hover:bg-gray-400/10"
                  }`}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700 font-medium">{label}</span>
                  </div>
                  {count > 0 && (
                    <span className="text-xs text-gray-600 bg-gray-400/30 px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  )}
                </motion.button>
              );
            }
          )}
        </div>

        {/* Content area */}
        <div className="flex-1 flex gap-4 min-h-0 overflow-hidden rounded-xl border-2 border-gray-400/40 bg-gray-100/40 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            {isComposing ? (
              <motion.div
                key="compose"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col p-6 overflow-auto"
              >
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-400/30">
                  <PenSquare className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-bold text-gray-700">New Message</h3>
                </div>
                <form
                  onSubmit={handleSendEmail}
                  className="flex flex-col gap-4 flex-1"
                >
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">To</label>
                    <input
                      type="email"
                      value={composeData.to}
                      onChange={(e) =>
                        setComposeData((p) => ({ ...p, to: e.target.value }))
                      }
                      required
                      placeholder="recipient@example.com"
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 bg-white/80 text-gray-800 placeholder-gray-500 focus:border-gray-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={composeData.subject}
                      onChange={(e) =>
                        setComposeData((p) => ({
                          ...p,
                          subject: e.target.value,
                        }))
                      }
                      placeholder="Subject"
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 bg-white/80 text-gray-800 placeholder-gray-500 focus:border-gray-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex-1 flex flex-col min-h-[120px]">
                    <label className="block text-sm text-gray-600 mb-1">
                      Message
                    </label>
                    <textarea
                      value={composeData.body}
                      onChange={(e) =>
                        setComposeData((p) => ({ ...p, body: e.target.value }))
                      }
                      required
                      placeholder="Write your message..."
                      className="flex-1 w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 bg-white/80 text-gray-800 placeholder-gray-500 focus:border-gray-500 focus:outline-none resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gray-600 text-white font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : null}
                      Send
                    </motion.button>
                    {!gmailConnected && (
                      <motion.button
                        type="button"
                        onClick={handleSaveDraft}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-2 rounded-lg border-2 border-gray-500 text-gray-700 font-medium hover:bg-gray-400/20 transition-colors"
                      >
                        Save Draft
                      </motion.button>
                    )}
                    <motion.button
                      type="button"
                      onClick={() => setIsComposing(false)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-2 rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-400/10 transition-colors"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            ) : selectedEmail ? (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col p-6 overflow-auto"
              >
                <div className="flex items-center gap-2 mb-4">
                  <motion.button
                    onClick={() => setSelectedEmail(null)}
                    whileHover={{ x: -2 }}
                    className="p-1 rounded hover:bg-gray-400/20"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </motion.button>
                  <h3 className="text-lg font-bold text-gray-700 truncate flex-1">
                    {selectedEmail.subject}
                  </h3>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => handleReply(selectedEmail)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1.5 rounded border border-gray-500 text-gray-700 text-sm hover:bg-gray-400/20"
                    >
                      Reply
                    </motion.button>
                    {activeFolder !== "spam" && (
                      <motion.button
                        onClick={() => handleMarkAsSpam(selectedEmail)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1.5 rounded border border-amber-500/50 text-amber-700 text-sm hover:bg-amber-400/20"
                      >
                        Spam
                      </motion.button>
                    )}
                    <motion.button
                      onClick={() => handleDeleteEmail(selectedEmail)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-1.5 rounded border border-red-500/50 text-red-600 hover:bg-red-400/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p>
                    <span className="font-medium text-gray-700">From:</span>{" "}
                    {selectedEmail.from}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">To:</span>{" "}
                    {selectedEmail.to}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Date:</span>{" "}
                    {selectedEmail.date}
                  </p>
                </div>
                <div className="flex-1 p-4 rounded-lg bg-gray-200/40 border border-gray-400/30 text-gray-700 whitespace-pre-wrap">
                  {selectedEmail.body || (gmailConnected ? "Loading..." : "")}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <div className="p-4 border-b border-gray-400/30 flex items-center justify-between">
                  <span className="text-gray-600 text-sm">
                    {filteredEmails.length} message
                    {filteredEmails.length !== 1 ? "s" : ""}
                  </span>
                  {gmailConnected && (
                    <button
                      onClick={fetchEmails}
                      disabled={isLoading}
                      className="text-xs text-gray-600 hover:text-gray-800 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin inline" />
                      ) : (
                        "Refresh"
                      )}
                    </button>
                  )}
                </div>
                <div className="flex-1 overflow-auto">
                  {isLoading && filteredEmails.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
                      <Loader2 className="w-16 h-16 mb-4 animate-spin opacity-50" />
                      <p>Loading emails...</p>
                    </div>
                  ) : filteredEmails.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
                      <Inbox className="w-16 h-16 mb-4 opacity-50" />
                      <p className="text-center">
                        No emails in {folderConfig[activeFolder].label}
                      </p>
                    </div>
                  ) : (
                    filteredEmails.map((email) => (
                      <motion.div
                        key={email.id}
                        onClick={() => handleSelectEmail(email)}
                        className={`flex items-start gap-4 p-4 border-b border-gray-400/20 cursor-pointer transition-colors hover:bg-gray-400/10 ${
                          !email.read ? "bg-gray-400/5" : ""
                        }`}
                        whileHover={{ x: 2 }}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                            !email.read ? "bg-gray-600" : "bg-transparent"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-gray-700 truncate">
                              {activeFolder === "sent" ? email.to : email.from}
                            </span>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {email.date}
                            </span>
                          </div>
                          <p
                            className={`text-sm truncate ${
                              !email.read ? "font-semibold text-gray-800" : "text-gray-600"
                            }`}
                          >
                            {email.subject}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
