"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  DollarSign,
  Users,
  Plus,
  X,
  Edit2,
  Trash2,
  UserPlus,
  List,
} from "lucide-react";
import { getStoredCeoData, setStoredCeoData } from "@/lib/storage";

export interface BusinessPermission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface StripeEarning {
  id: string;
  date: string;
  amount: number;
  description: string;
  status: "paid" | "pending" | "refunded";
}

export interface ClientInfo {
  id: string;
  name: string;
  email: string;
  company: string;
  notes?: string;
}

export interface CeoData {
  permissions: BusinessPermission[];
  earnings: StripeEarning[];
  clients: ClientInfo[];
}

export function CEO() {
  const [activeSection, setActiveSection] = useState<"permissions" | "earnings" | "clients">("permissions");
  const [data, setData] = useState<CeoData>({
    permissions: [],
    earnings: [],
    clients: [],
  });
  const [isAddingPermission, setIsAddingPermission] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientInfo | null>(null);
  const [isAddingEarning, setIsAddingEarning] = useState(false);
  const [isAddingClient, setIsAddingClient] = useState(false);

  useEffect(() => {
    const stored = getStoredCeoData<CeoData>();
    if (stored) {
      setData({
        permissions: stored.permissions || [],
        earnings: stored.earnings || [],
        clients: stored.clients || [],
      });
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    setStoredCeoData(data);
  }, [data, isHydrated]);

  const addPermission = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const newPermission: BusinessPermission = {
      id: Date.now().toString(),
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      description: (form.elements.namedItem("description") as HTMLInputElement).value,
      enabled: true,
    };
    setData((prev) => ({
      ...prev,
      permissions: [...prev.permissions, newPermission],
    }));
    setIsAddingPermission(false);
  };

  const deletePermission = (id: string) => {
    setData((prev) => ({
      ...prev,
      permissions: prev.permissions.filter((p) => p.id !== id),
    }));
  };

  const togglePermission = (id: string) => {
    setData((prev) => ({
      ...prev,
      permissions: prev.permissions.map((p) =>
        p.id === id ? { ...p, enabled: !p.enabled } : p
      ),
    }));
  };

  const addEarning = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const newEarning: StripeEarning = {
      id: Date.now().toString(),
      date: (form.elements.namedItem("date") as HTMLInputElement).value,
      amount: parseFloat((form.elements.namedItem("amount") as HTMLInputElement).value) || 0,
      description: (form.elements.namedItem("description") as HTMLInputElement).value,
      status: "paid",
    };
    setData((prev) => ({ ...prev, earnings: [newEarning, ...prev.earnings] }));
    setIsAddingEarning(false);
  };

  const addClient = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const newClient: ClientInfo = {
      id: Date.now().toString(),
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
      notes: (form.elements.namedItem("notes") as HTMLTextAreaElement).value || undefined,
    };
    setData((prev) => ({ ...prev, clients: [...prev.clients, newClient] }));
    setIsAddingClient(false);
  };

  const updateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;
    const form = e.target as HTMLFormElement;
    const updated: ClientInfo = {
      ...editingClient,
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
      notes: (form.elements.namedItem("notes") as HTMLTextAreaElement).value || undefined,
    };
    setData((prev) => ({
      ...prev,
      clients: prev.clients.map((c) => (c.id === editingClient.id ? updated : c)),
    }));
    setEditingClient(null);
  };

  const deleteClient = (id: string) => {
    setData((prev) => ({ ...prev, clients: prev.clients.filter((c) => c.id !== id) }));
    setEditingClient(null);
  };

  const totalEarnings = data.earnings
    .filter((e) => e.status === "paid")
    .reduce((sum, e) => sum + e.amount, 0);
  const pendingEarnings = data.earnings
    .filter((e) => e.status === "pending")
    .reduce((sum, e) => sum + e.amount, 0);

  const sections = [
    { id: "permissions" as const, label: "Permissions", icon: Shield },
    { id: "earnings" as const, label: "Stripe Earnings", icon: DollarSign },
    { id: "clients" as const, label: "Client Info", icon: Users },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-700 uppercase tracking-wider">
            CEO
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse" />
            <span className="text-gray-600 text-sm">Business Management</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Section tabs */}
        <div className="w-48 flex-shrink-0 space-y-1">
          {sections.map(({ id, label, icon: Icon }) => (
            <motion.button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
                activeSection === id
                  ? "bg-gray-400/20 border-gray-500"
                  : "border-gray-400/30 hover:bg-gray-400/10"
              }`}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700 font-medium">{label}</span>
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-h-0 overflow-auto rounded-xl border-2 border-gray-400/40 bg-gray-100/40 backdrop-blur-sm p-6">
          <AnimatePresence mode="wait">
            {activeSection === "permissions" && (
              <motion.div
                key="permissions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-gray-700">User Management</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Create new users or view existing users in the system.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link href="/dashboard/users/create">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-4 p-6 rounded-xl border-2 border-gray-400/40 bg-white/60 hover:bg-white/80 hover:border-gray-500/60 transition-all text-left cursor-pointer"
                    >
                      <div className="w-14 h-14 rounded-xl bg-gray-500/20 flex items-center justify-center">
                        <UserPlus className="w-7 h-7 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-700">Create User</div>
                        <div className="text-sm text-gray-600">
                          Add a new user to the dashboard
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                  <Link href="/dashboard/users/view">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-4 p-6 rounded-xl border-2 border-gray-400/40 bg-white/60 hover:bg-white/80 hover:border-gray-500/60 transition-all text-left cursor-pointer"
                    >
                      <div className="w-14 h-14 rounded-xl bg-gray-500/20 flex items-center justify-center">
                        <List className="w-7 h-7 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-700">View Users</div>
                        <div className="text-sm text-gray-600">
                          See all current users in the system
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-400/30">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Business Permissions</h4>
                  {data.permissions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                      <Shield className="w-10 h-10 mb-3 opacity-50" />
                      <p className="text-sm">No permissions defined yet.</p>
                      <motion.button
                        onClick={() => setIsAddingPermission(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-500 text-gray-600 text-sm hover:bg-gray-400/20"
                      >
                        <Plus className="w-4 h-4" />
                        Add Permission
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {data.permissions.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-400/30 bg-white/40"
                        >
                          <div>
                            <div className="font-medium text-gray-700 text-sm">{p.name}</div>
                            <div className="text-xs text-gray-600">{p.description}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => togglePermission(p.id)}
                              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                p.enabled
                                  ? "bg-gray-600 text-white"
                                  : "bg-gray-300/60 text-gray-600"
                              }`}
                            >
                              {p.enabled ? "On" : "Off"}
                            </button>
                            <button
                              onClick={() => deletePermission(p.id)}
                              className="p-1.5 rounded hover:bg-red-400/20"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <motion.button
                        onClick={() => setIsAddingPermission(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-gray-500 text-gray-600 text-sm hover:bg-gray-400/10"
                      >
                        <Plus className="w-4 h-4" />
                        Add Permission
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeSection === "earnings" && (
              <motion.div
                key="earnings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-700">Stripe Earnings</h3>
                  <motion.button
                    onClick={() => setIsAddingEarning(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-500 text-gray-700 text-sm hover:bg-gray-400/20"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </motion.button>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-4 rounded-lg border-2 border-gray-400/40 bg-white/60">
                    <div className="text-xs text-gray-600 uppercase">Total Paid</div>
                    <div className="text-2xl font-bold text-gray-700">
                      ${totalEarnings.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border-2 border-gray-400/40 bg-white/60">
                    <div className="text-xs text-gray-600 uppercase">Pending</div>
                    <div className="text-2xl font-bold text-gray-700">
                      ${pendingEarnings.toLocaleString()}
                    </div>
                  </div>
                </div>
                {data.earnings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <DollarSign className="w-12 h-12 mb-4 opacity-50" />
                    <p>No earnings recorded yet.</p>
                    <p className="text-sm mt-1">Add an earning to get started.</p>
                  </div>
                ) : (
                <div className="space-y-2">
                  {data.earnings.map((e) => (
                    <div
                      key={e.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-400/30 bg-white/40"
                    >
                      <div>
                        <div className="font-medium text-gray-700">{e.description}</div>
                        <div className="text-xs text-gray-600 uppercase">{e.date}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            e.status === "paid"
                              ? "bg-green-500/20 text-green-700"
                              : e.status === "pending"
                                ? "bg-amber-500/20 text-amber-700"
                                : "bg-red-500/20 text-red-700"
                          }`}
                        >
                          {e.status}
                        </span>
                        <span className="font-bold text-gray-700">
                          ${e.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </motion.div>
            )}

            {activeSection === "clients" && (
              <motion.div
                key="clients"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-700">Client Info</h3>
                  <motion.button
                    onClick={() => setIsAddingClient(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-500 text-gray-700 text-sm hover:bg-gray-400/20"
                  >
                    <Plus className="w-4 h-4" />
                    Add Client
                  </motion.button>
                </div>
                {data.clients.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <Users className="w-12 h-12 mb-4 opacity-50" />
                    <p>No clients added yet.</p>
                    <p className="text-sm mt-1">Add a client to get started.</p>
                  </div>
                ) : (
                <div className="space-y-2">
                  {data.clients.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-4 rounded-lg border-2 border-gray-400/40 bg-white/60"
                    >
                      <div>
                        <div className="font-medium text-gray-700">{c.name}</div>
                        <div className="text-sm text-gray-600">{c.email}</div>
                        <div className="text-xs text-gray-500">{c.company}</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingClient(c)}
                          className="p-2 rounded hover:bg-gray-400/20"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => deleteClient(c.id)}
                          className="p-2 rounded hover:bg-red-400/20"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add permission modal */}
      <AnimatePresence>
        {isAddingPermission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={() => setIsAddingPermission(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-200/95 backdrop-blur-xl border-2 border-gray-500 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-700">Add Permission</h3>
                <button
                  onClick={() => setIsAddingPermission(false)}
                  className="p-1 rounded hover:bg-gray-400/20"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <form onSubmit={addPermission} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="e.g. Admin Access"
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 bg-white/80 text-gray-800 focus:border-gray-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    name="description"
                    type="text"
                    required
                    placeholder="e.g. Full dashboard access"
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 bg-white/80 text-gray-800 focus:border-gray-500 focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-lg bg-gray-600 text-white font-medium"
                  >
                    Add
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setIsAddingPermission(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-lg border border-gray-500 text-gray-700"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add earning modal */}
      <AnimatePresence>
        {isAddingEarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={() => setIsAddingEarning(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-200/95 backdrop-blur-xl border-2 border-gray-500 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-700">Add Earning</h3>
                <button
                  onClick={() => setIsAddingEarning(false)}
                  className="p-1 rounded hover:bg-gray-400/20"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <form onSubmit={addEarning} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    name="date"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().slice(0, 10)}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 bg-white/80 text-gray-800 focus:border-gray-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                  <input
                    name="amount"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 bg-white/80 text-gray-800 focus:border-gray-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    name="description"
                    type="text"
                    required
                    placeholder="e.g. Website project"
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 bg-white/80 text-gray-800 focus:border-gray-500 focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-lg bg-gray-600 text-white font-medium"
                  >
                    Add
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setIsAddingEarning(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-lg border border-gray-500 text-gray-700"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add client modal */}
      <AnimatePresence>
        {isAddingClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={() => setIsAddingClient(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-200/95 backdrop-blur-xl border-2 border-gray-500 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-700">Add Client</h3>
                <button
                  onClick={() => setIsAddingClient(false)}
                  className="p-1 rounded hover:bg-gray-400/20"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <form onSubmit={addClient} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Client or company name"
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 bg-white/80 text-gray-800 focus:border-gray-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="client@example.com"
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 bg-white/80 text-gray-800 focus:border-gray-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    name="company"
                    type="text"
                    placeholder="Company name"
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 bg-white/80 text-gray-800 focus:border-gray-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    rows={2}
                    placeholder="Optional notes"
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 bg-white/80 text-gray-800 focus:border-gray-500 focus:outline-none resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-lg bg-gray-600 text-white font-medium"
                  >
                    Add
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setIsAddingClient(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-lg border border-gray-500 text-gray-700"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit client modal */}
      <AnimatePresence>
        {editingClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={() => setEditingClient(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-200/95 backdrop-blur-xl border-2 border-gray-500 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-700">Edit Client</h3>
                <button
                  onClick={() => setEditingClient(null)}
                  className="p-1 rounded hover:bg-gray-400/20"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <form onSubmit={updateClient} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    defaultValue={editingClient.name}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 bg-white/80 text-gray-800 focus:border-gray-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    defaultValue={editingClient.email}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 bg-white/80 text-gray-800 focus:border-gray-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    name="company"
                    type="text"
                    defaultValue={editingClient.company}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 bg-white/80 text-gray-800 focus:border-gray-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    rows={2}
                    defaultValue={editingClient.notes || ""}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-400/40 bg-white/80 text-gray-800 focus:border-gray-500 focus:outline-none resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-lg bg-gray-600 text-white font-medium"
                  >
                    Save
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setEditingClient(null)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-lg border border-gray-500 text-gray-700"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
