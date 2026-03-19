"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  Calendar,
  Crown,
  Cpu,
} from "lucide-react";
import { CategorySlider } from "./CategorySlider";
import { CodeAnimation } from "./CodeAnimation";

const tabs = [
  { id: "email", label: "Email", icon: Mail },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "ceo", label: "CEO", icon: Crown },
];

export function HolographicDashboard() {
  const [activeTab, setActiveTab] = useState("email");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTabChange = (tabId: string) => {
    setIsProcessing(true);
    setActiveTab(tabId);
    setTimeout(() => setIsProcessing(false), 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full max-w-7xl h-[800px]"
    >
      {/* Main holographic card */}
      <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-gray-300/60 via-gray-200/60 to-gray-300/60 backdrop-blur-xl border-2 border-gray-400/50 shadow-[0_0_60px_rgba(150,150,150,0.4)] overflow-hidden">
        {/* Animated scan lines */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-400/5 to-transparent"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          />
        </div>

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-gray-500" />
        <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-gray-500" />
        <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-gray-500" />
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-gray-500" />

        {/* Pulsing corner dots */}
        {[
          [4, 4],
          [4, -4],
          [-4, 4],
          [-4, -4],
        ].map(([x, y], i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-gray-600 rounded-full"
            style={{
              [x > 0 ? "left" : "right"]: Math.abs(x),
              [y > 0 ? "top" : "bottom"]: Math.abs(y),
            }}
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
          />
        ))}

        {/* Header */}
        <div className="relative px-8 py-6 border-b border-gray-400/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="text-gray-600"
              >
                <Cpu className="w-8 h-8" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-clip-text text-transparent">
                  NEURAL DASHBOARD 3026
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  QUANTUM INTERFACE v12.5.8
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="px-4 py-2 rounded-full border border-gray-500/40 bg-gray-400/20 text-gray-700 text-sm"
              >
                {isProcessing ? "PROCESSING..." : "ACTIVE"}
              </motion.div>
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-gray-600"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Code animation */}
          <div className="flex items-start mt-6">
            <CodeAnimation />
          </div>
        </div>

        {/* Main content area */}
        <div className="flex h-[calc(100%-300px)]">
          {/* Left sidebar tabs */}
          <div className="w-64 border-r border-gray-400/30 p-6 space-y-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative overflow-hidden ${
                    isActive
                      ? "bg-gray-400/20 border border-gray-500"
                      : "bg-gray-300/30 border border-gray-400/30 hover:bg-gray-400/10"
                  }`}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-gray-400/30 to-gray-500/30"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <Icon
                    className={`w-5 h-5 relative z-10 ${isActive ? "text-gray-700" : "text-gray-600"}`}
                  />
                  <span
                    className={`relative z-10 ${isActive ? "text-gray-700" : "text-gray-600"}`}
                  >
                    {tab.label}
                  </span>
                  {isActive && (
                    <motion.div
                      className="ml-auto w-2 h-2 rounded-full bg-gray-600"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Content area */}
          <div className="flex-1 p-8 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <CategorySlider category={activeTab} />
              </motion.div>
            </AnimatePresence>

            {/* Processing overlay */}
            <AnimatePresence>
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gray-400/10 backdrop-blur-sm flex items-center justify-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                    className="w-16 h-16 border-4 border-gray-400/30 border-t-gray-600 rounded-full"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Outer glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-400/20 via-gray-500/20 to-gray-400/20 blur-3xl -z-10" />
    </motion.div>
  );
}
