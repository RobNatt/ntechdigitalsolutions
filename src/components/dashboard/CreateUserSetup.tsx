"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { UserPlus } from "lucide-react";

export function CreateUserSetup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    login_id: "",
    phone_number: "",
    role: "member",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create user");
        return;
      }
      setSuccess(true);
      setFormData({
        email: "",
        password: "",
        full_name: "",
        login_id: "",
        phone_number: "",
        role: "member",
      });
    } catch {
      setError("Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16"
      >
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
          <UserPlus className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-700 dark:text-neutral-300 mb-2">User Created</h3>
        <p className="text-gray-600 dark:text-neutral-400 mb-6">The new user has been added successfully.</p>
        <motion.button
          onClick={() => setSuccess(false)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2 rounded-lg border-2 border-gray-500 text-gray-700 dark:text-neutral-300 font-medium hover:bg-gray-400/20"
        >
          Create Another User
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <UserPlus className="w-8 h-8 text-gray-600 dark:text-neutral-400" />
        <div>
          <h3 className="text-xl font-bold text-gray-700 dark:text-neutral-300">Create New User</h3>
          <p className="text-sm text-gray-600 dark:text-neutral-400">Add a new user to the system</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/20 text-red-700 text-sm">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
            placeholder="user@example.com"
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 dark:border-neutral-600/45 bg-white/80 text-gray-800 dark:text-neutral-200 focus:border-gray-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={formData.password}
            onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
            placeholder="••••••••"
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 dark:border-neutral-600/45 bg-white/80 text-gray-800 dark:text-neutral-200 focus:border-gray-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Full Name</label>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) => setFormData((p) => ({ ...p, full_name: e.target.value }))}
            placeholder="Jane Doe"
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 dark:border-neutral-600/45 bg-white/80 text-gray-800 dark:text-neutral-200 focus:border-gray-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Login ID</label>
          <input
            type="text"
            value={formData.login_id}
            onChange={(e) => setFormData((p) => ({ ...p, login_id: e.target.value }))}
            placeholder="EMP001"
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 dark:border-neutral-600/45 bg-white/80 text-gray-800 dark:text-neutral-200 focus:border-gray-500 focus:outline-none"
          />
          <p className="text-xs text-gray-500 dark:text-neutral-500 mt-1">ID number used for sign-in</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Phone Number</label>
          <input
            type="tel"
            value={formData.phone_number}
            onChange={(e) => setFormData((p) => ({ ...p, phone_number: e.target.value }))}
            placeholder="+1234567890"
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 dark:border-neutral-600/45 bg-white/80 text-gray-800 dark:text-neutral-200 focus:border-gray-500 focus:outline-none"
          />
          <p className="text-xs text-gray-500 dark:text-neutral-500 mt-1">For 2FA verification codes</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Role</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 dark:border-neutral-600/45 bg-white/80 text-gray-800 dark:text-neutral-200 focus:border-gray-500 focus:outline-none"
          >
            <option value="member">Member</option>
            <option value="developer">Developer</option>
            <option value="admin">Admin</option>
            <option value="ceo">CEO</option>
          </select>
        </div>
        <div className="flex gap-3 pt-4">
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2.5 rounded-lg bg-gray-600 text-white font-medium hover:bg-gray-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create User"}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
