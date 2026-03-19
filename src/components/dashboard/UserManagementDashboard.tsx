"use client";

import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { CreateUserSetup } from "./CreateUserSetup";
import { ViewUsersList } from "./ViewUsersList";

interface UserManagementDashboardProps {
  mode: "create" | "view";
  onBack: () => void;
}

export function UserManagementDashboard({ mode, onBack }: UserManagementDashboardProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <motion.button
          onClick={onBack}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-500 text-gray-700 font-medium hover:bg-gray-400/20"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to CEO
        </motion.button>
        <div>
          <h2 className="text-2xl font-bold text-gray-700 uppercase tracking-wider">
            User Management
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse" />
            <span className="text-gray-600 text-sm">
              {mode === "create" ? "Create New User" : "View All Users"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto rounded-xl border-2 border-gray-400/40 bg-gray-100/40 backdrop-blur-sm p-8">
        {mode === "create" ? <CreateUserSetup /> : <ViewUsersList />}
      </div>
    </div>
  );
}
