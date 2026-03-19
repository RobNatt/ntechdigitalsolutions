"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Users, Loader2 } from "lucide-react";

export interface UserRecord {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  login_id: string | null;
  phone_number: string | null;
  created_at: string;
}

export function ViewUsersList() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to load users");
          return;
        }
        const data = await res.json();
        setUsers(data.users || []);
      } catch {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-12 h-12 text-gray-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-500/20 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-8 h-8 text-gray-600" />
        <div>
          <h3 className="text-xl font-bold text-gray-700">Current Users</h3>
          <p className="text-sm text-gray-600">{users.length} user{users.length !== 1 ? "s" : ""} in system</p>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <Users className="w-16 h-16 mb-4 opacity-50" />
          <p>No users found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-400/40 bg-white/60 hover:bg-white/80 transition-colors"
            >
              <div>
                <div className="font-medium text-gray-700">
                  {u.full_name || u.email || "—"}
                </div>
                <div className="text-sm text-gray-600">{u.email || "—"}</div>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-400/30 text-gray-600">
                    {u.role || "member"}
                  </span>
                  {u.login_id && (
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-400/30 text-gray-600">
                      ID: {u.login_id}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {u.created_at
                  ? new Date(u.created_at).toLocaleDateString()
                  : "—"}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
