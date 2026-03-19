"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { ViewUsersList } from "@/components/dashboard/ViewUsersList";

export default function ViewUsersPage() {
  return (
    <main className="min-h-screen bg-gray-200 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(100, 100, 100, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 100, 100, 0.3) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => {
          const seed = (i * 17 + 31) % 100;
          return (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gray-500 rounded-full animate-pulse"
              style={{
                left: `${(seed * 7) % 100}%`,
                top: `${(seed * 13) % 100}%`,
                animationDelay: `${(seed % 3)}s`,
                animationDuration: `${2 + (seed % 3)}s`,
              }}
            />
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-4xl"
      >
        <div className="relative rounded-3xl bg-gradient-to-br from-gray-300/60 via-gray-200/60 to-gray-300/60 backdrop-blur-xl border-2 border-gray-400/50 shadow-[0_0_60px_rgba(150,150,150,0.4)] overflow-hidden p-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/dashboard">
              <motion.span
                className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-500 text-gray-700 font-medium hover:bg-gray-400/20 transition-colors cursor-pointer"
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </motion.span>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-700 uppercase tracking-wider">
                View Users
              </h1>
              <p className="text-gray-600 text-sm mt-1">See all current users in the system</p>
            </div>
          </div>

          <div className="rounded-xl border-2 border-gray-400/40 bg-gray-100/40 backdrop-blur-sm p-8">
            <ViewUsersList />
          </div>
        </div>
      </motion.div>
    </main>
  );
}
