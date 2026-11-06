"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  ShieldCheck,
  Shield,
  Key,
  Lock,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  X,
  ChevronRight,
  AtSign,
  Mail,
  Phone,
  Eye,
  EyeOff,
  UserCheck,
  UserX,
  Clock,
  HelpCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface AdminUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "OWNER" | "MANAGER" | "STAFF" | "SUPPORT";
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE";
  phone: string | null;
  avatar: string | null;
  lastLoginAt: string | null;
  lastLoginIp: string | null;
  createdAt: string;
}

export default function StoreAdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [currentUser, setCurrentUser] = useState<{ id: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Notifications
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Form states - Add User
  const [addName, setAddName] = useState("");
  const [addUsername, setAddUsername] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPassword, setAddPassword] = useState("");
  const [addRole, setAddRole] = useState<"OWNER" | "MANAGER" | "STAFF" | "SUPPORT">("STAFF");
  const [addPhone, setAddPhone] = useState("");
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [submittingAdd, setSubmittingAdd] = useState(false);

  // Form states - Edit User
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<"OWNER" | "MANAGER" | "STAFF" | "SUPPORT">("STAFF");
  const [editStatus, setEditStatus] = useState<"ACTIVE" | "SUSPENDED" | "INACTIVE">("ACTIVE");
  const [editPhone, setEditPhone] = useState("");
  const [submittingEdit, setSubmittingEdit] = useState(false);

  // Form states - Reset Password
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [submittingReset, setSubmittingReset] = useState(false);

  // Deleting user
  const [submittingDelete, setSubmittingDelete] = useState(false);

  // Load users
  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success && data.users) {
        setUsers(data.users);
        if (data.caller) setCurrentUser(data.caller);
      } else {
        showToast("error", data.error || "Failed to load administrators.");
      }
    } catch (e) {
      showToast("error", "Network error loading administrators.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 5000);
  };

  // Generate random password helper
  const generateRandomPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  // Handle Add User
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAdd(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addName,
          username: addUsername,
          email: addEmail,
          password: addPassword,
          role: addRole,
          phone: addPhone,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast("error", data.error || "Failed to create user.");
        return;
      }

      showToast("success", data.message || "Administrator added successfully.");
      setIsAddOpen(false);
      setAddName("");
      setAddUsername("");
      setAddEmail("");
      setAddPassword("");
      setAddPhone("");
      loadUsers();
    } catch (err: any) {
      showToast("error", "Network error creating user.");
    } finally {
      setSubmittingAdd(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (user: AdminUser) => {
    setSelectedUser(user);
    setEditName(user.name);
    setEditUsername(user.username);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditStatus(user.status);
    setEditPhone(user.phone || "");
    setIsEditOpen(true);
  };

  // Handle Edit User
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setSubmittingEdit(true);

    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          username: editUsername,
          email: editEmail,
          role: editRole,
          status: editStatus,
          phone: editPhone,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast("error", data.error || "Failed to update user.");
        return;
      }

      showToast("success", data.message || "User updated successfully.");
      setIsEditOpen(false);
      loadUsers();
    } catch (err: any) {
      showToast("error", "Network error updating user.");
    } finally {
      setSubmittingEdit(false);
    }
  };

  // Open Reset Password Modal
  const openResetPasswordModal = (user: AdminUser) => {
    setSelectedUser(user);
    setResetNewPassword(generateRandomPassword());
    setIsResetPasswordOpen(true);
  };

  // Handle Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setSubmittingReset(true);

    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newPassword: resetNewPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast("error", data.error || "Failed to reset password.");
        return;
      }

      showToast("success", data.message || "Password reset successfully.");
      setIsResetPasswordOpen(false);
    } catch (err: any) {
      showToast("error", "Network error resetting password.");
    } finally {
      setSubmittingReset(false);
    }
  };

  // Toggle Suspend Status directly
  const toggleSuspendUser = async (user: AdminUser) => {
    const nextStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast("error", data.error || "Failed to change user status.");
        return;
      }

      showToast("success", `User "${user.name}" status updated to ${nextStatus}.`);
      loadUsers();
    } catch (err) {
      showToast("error", "Network error changing user status.");
    }
  };

  // Open Delete Modal
  const openDeleteModal = (user: AdminUser) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  // Handle Delete User
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setSubmittingDelete(true);

    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast("error", data.error || "Failed to delete user.");
        return;
      }

      showToast("success", data.message || "User deleted successfully.");
      setIsDeleteOpen(false);
      loadUsers();
    } catch (err: any) {
      showToast("error", "Network error deleting user.");
    } finally {
      setSubmittingDelete(false);
    }
  };

  // Filtered Users List
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phone && u.phone.includes(q));

    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Stats calculation
  const totalUsers = users.length;
  const ownersCount = users.filter((u) => u.role === "OWNER").length;
  const managersCount = users.filter((u) => u.role === "MANAGER").length;
  const staffCount = users.filter((u) => u.role === "STAFF" || u.role === "SUPPORT").length;

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-3 transition-all ${
            toast.type === "success"
              ? "bg-emerald-900 text-emerald-100 border-emerald-700"
              : "bg-rose-900 text-rose-100 border-rose-700"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          )}
          <span>{toast.text}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Link href="/admin" className="hover:text-slate-800">Admin</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">User Management</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-[#2563EB]" />
            Store Administrators & Multi-User Access
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage multi-user backoffice logins, assign roles, enforce security policies, and configure access permissions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadUsers}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition shadow-2xs"
            title="Refresh Users"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#2563EB]" : ""}`} />
          </button>

          <button
            onClick={() => {
              setAddName("");
              setAddUsername("");
              setAddEmail("");
              setAddPassword(generateRandomPassword());
              setAddRole("STAFF");
              setAddPhone("");
              setIsAddOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] text-white hover:bg-blue-700 text-xs font-bold transition shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Administrator</span>
          </button>
        </div>
      </div>

      {/* Stats Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Administrators</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{totalUsers}</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Active backoffice users</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider block">Store Owners</span>
          <span className="text-2xl font-black text-purple-950 mt-1 block">{ownersCount}</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Full root permissions</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">Store Managers</span>
          <span className="text-2xl font-black text-blue-950 mt-1 block">{managersCount}</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Catalog & order supervisors</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Staff & Support</span>
          <span className="text-2xl font-black text-emerald-950 mt-1 block">{staffCount}</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Operations & fulfillment</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, @username, or email..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="font-bold text-[11px] hidden sm:inline">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="ALL">All Roles</option>
              <option value="OWNER">Store Owner</option>
              <option value="MANAGER">Store Manager</option>
              <option value="STAFF">Staff Member</option>
              <option value="SUPPORT">Support</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="font-bold text-[11px] hidden sm:inline">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-5">Administrator</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Login</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                    No administrators match the search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isCurrent = currentUser?.id === user.id;

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/60 transition">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#0A192F] text-white flex items-center justify-center font-bold text-xs shadow-2xs flex-shrink-0">
                            {user.name ? user.name.charAt(0).toUpperCase() : "A"}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-slate-900">{user.name}</span>
                              {isCurrent && (
                                <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-blue-100 text-[#2563EB]">
                                  YOU
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-mono text-[#2563EB] font-semibold">
                              @{user.username}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            user.role === "OWNER"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : user.role === "MANAGER"
                              ? "bg-blue-50 text-[#2563EB] border border-blue-200"
                              : user.role === "STAFF"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          <ShieldCheck className="w-3 h-3" />
                          {user.role}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            user.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.status === "ACTIVE" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                            }`}
                          />
                          {user.status}
                        </span>
                      </td>

                      {/* Last Login */}
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {user.lastLoginAt ? (
                          <div>
                            <span className="font-semibold text-slate-700 block">
                              {new Date(user.lastLoginAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(user.lastLoginAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Never logged in</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit Details */}
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                            title="Edit User Details"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Reset Password */}
                          <button
                            onClick={() => openResetPasswordModal(user)}
                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition"
                            title="Reset Password"
                          >
                            <Key className="w-4 h-4" />
                          </button>

                          {/* Toggle Suspend (If not self) */}
                          {!isCurrent && (
                            <button
                              onClick={() => toggleSuspendUser(user)}
                              className={`p-1.5 rounded-lg transition ${
                                user.status === "ACTIVE"
                                  ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                  : "text-emerald-600 hover:bg-emerald-50"
                              }`}
                              title={user.status === "ACTIVE" ? "Suspend Account" : "Activate Account"}
                            >
                              {user.status === "ACTIVE" ? (
                                <UserX className="w-4 h-4" />
                              ) : (
                                <UserCheck className="w-4 h-4" />
                              )}
                            </button>
                          )}

                          {/* Delete (Only for owners, not self) */}
                          {!isCurrent && currentUser?.role === "OWNER" && (
                            <button
                              onClick={() => openDeleteModal(user)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Delete Administrator"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Breakdown Reference Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-emerald-400" />
          Multi-User Role & Permissions Hierarchy
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1">
            <span className="font-extrabold text-purple-400 uppercase text-[10px] tracking-wider block">OWNER</span>
            <p className="text-slate-300 font-semibold">Store Owner</p>
            <p className="text-[11px] text-slate-400">
              Unrestricted control. Can manage other administrators, billing, license, themes, payment gateways, and system settings.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1">
            <span className="font-extrabold text-blue-400 uppercase text-[10px] tracking-wider block">MANAGER</span>
            <p className="text-slate-300 font-semibold">Store Manager</p>
            <p className="text-[11px] text-slate-400">
              Full control over daily operations: products, categories, orders, customers, inventory, discounts, and sales reports.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1">
            <span className="font-extrabold text-emerald-400 uppercase text-[10px] tracking-wider block">STAFF</span>
            <p className="text-slate-300 font-semibold">Staff Member</p>
            <p className="text-[11px] text-slate-400">
              Can manage catalog items, update stock counts, process and fulfill customer shipments, and update inventory logs.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1">
            <span className="font-extrabold text-amber-400 uppercase text-[10px] tracking-wider block">SUPPORT</span>
            <p className="text-slate-300 font-semibold">Customer Support</p>
            <p className="text-[11px] text-slate-400">
              Read-only and customer support access. Can look up customer accounts, review order status, and issue customer tracking info.
            </p>
          </div>
        </div>
      </div>

      {/* ================= MODAL: ADD ADMINISTRATOR ================= */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Add Store Administrator</h3>
                  <p className="text-[11px] text-slate-400">Provision a new account with customized credentials and role</p>
                </div>
              </div>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    required
                    placeholder="e.g. Sarah Connor"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                {/* Username */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Login Username</label>
                  <input
                    type="text"
                    value={addUsername}
                    onChange={(e) => setAddUsername(e.target.value.toLowerCase().trim())}
                    placeholder="e.g. sarah_c"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Email Address *</label>
                <input
                  type="email"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  required
                  placeholder="sarah@example.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">Initial Password *</label>
                  <button
                    type="button"
                    onClick={() => setAddPassword(generateRandomPassword())}
                    className="text-[10px] text-[#2563EB] font-bold hover:underline flex items-center gap-1"
                  >
                    <Key className="w-3 h-3" />
                    Generate Strong PIN
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showAddPassword ? "text" : "password"}
                    value={addPassword}
                    onChange={(e) => setAddPassword(e.target.value)}
                    required
                    placeholder="Minimum 8 characters"
                    className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAddPassword(!showAddPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showAddPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Role */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Administrative Role *</label>
                  <select
                    value={addRole}
                    onChange={(e: any) => setAddRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  >
                    <option value="STAFF">Staff Member</option>
                    <option value="MANAGER">Store Manager</option>
                    <option value="SUPPORT">Customer Support</option>
                    {currentUser?.role === "OWNER" && <option value="OWNER">Store Owner</option>}
                  </select>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Phone (Optional)</label>
                  <input
                    type="text"
                    value={addPhone}
                    onChange={(e) => setAddPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAdd}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] text-white hover:bg-blue-700 font-bold shadow-xs disabled:opacity-50"
                >
                  {submittingAdd ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  <span>{submittingAdd ? "Provisioning..." : "Create Administrator"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT ADMINISTRATOR ================= */}
      {isEditOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Edit Administrator: {selectedUser.name}</h3>
                  <p className="text-[11px] text-slate-400">Modify user role, account status, and credentials</p>
                </div>
              </div>
              <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditUser} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Login Username</label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value.toLowerCase().trim())}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Email Address *</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Administrative Role *</label>
                  <select
                    value={editRole}
                    onChange={(e: any) => setEditRole(e.target.value)}
                    disabled={currentUser?.role !== "OWNER"}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB] disabled:opacity-50"
                  >
                    <option value="STAFF">Staff Member</option>
                    <option value="MANAGER">Store Manager</option>
                    <option value="SUPPORT">Customer Support</option>
                    {currentUser?.role === "OWNER" && <option value="OWNER">Store Owner</option>}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Account Status *</label>
                  <select
                    value={editStatus}
                    onChange={(e: any) => setEditStatus(e.target.value)}
                    disabled={currentUser?.id === selectedUser.id}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB] disabled:opacity-50"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEdit}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] text-white hover:bg-blue-700 font-bold shadow-xs disabled:opacity-50"
                >
                  {submittingEdit ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>{submittingEdit ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: RESET PASSWORD ================= */}
      {isResetPasswordOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Reset User Password</h3>
                  <p className="text-[11px] text-slate-400">Set a new temporary password for {selectedUser.name}</p>
                </div>
              </div>
              <button onClick={() => setIsResetPasswordOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4 pt-4 text-xs">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                <p className="font-semibold">
                  Administrator: <strong>{selectedUser.name}</strong> (@{selectedUser.username})
                </p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  The user can immediately log in with this new password and their 2FA security code.
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">New Password *</label>
                  <button
                    type="button"
                    onClick={() => setResetNewPassword(generateRandomPassword())}
                    className="text-[10px] text-[#2563EB] font-bold hover:underline"
                  >
                    Generate Random
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showResetPassword ? "text" : "password"}
                    value={resetNewPassword}
                    onChange={(e) => setResetNewPassword(e.target.value)}
                    required
                    className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(!showResetPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsResetPasswordOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReset}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 text-white hover:bg-amber-700 font-bold shadow-xs disabled:opacity-50"
                >
                  {submittingReset ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                  <span>{submittingReset ? "Resetting..." : "Confirm Password Reset"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE CONFIRMATION ================= */}
      {isDeleteOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Delete Administrator</h3>
                <p className="text-[11px] text-slate-400">Irreversible security action</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Are you sure you want to permanently remove <strong>{selectedUser.name}</strong> (@{selectedUser.username}) from the backoffice?
              Their active sessions will be terminated immediately.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={submittingDelete}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 font-bold shadow-xs disabled:opacity-50"
              >
                {submittingDelete ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>{submittingDelete ? "Deleting..." : "Permanently Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
