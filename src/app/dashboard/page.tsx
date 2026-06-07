"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, Search, LogOut, Users, UserCheck, Sparkles, Clock } from "lucide-react";
import { customers } from "@/data/customers";
import { Customer, CustomerStatus } from "@/types";

const STATUS_COLORS: Record<CustomerStatus, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  New: "bg-blue-100 text-blue-700",
  "On Hold": "bg-amber-100 text-amber-700",
  Matched: "bg-purple-100 text-purple-700",
  Closed: "bg-gray-100 text-gray-500",
};

function getInitials(first: string, last: string) {
  return `${first[0]}${last[0]}`.toUpperCase();
}

function formatHeight(cm: number) {
  const totalInches = Math.round(cm / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet}'${inches}" (${cm}cm)`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [matcherName, setMatcherName] = useState("Matchmaker");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | "All">("All");

  useEffect(() => {
    const session = localStorage.getItem("tdc_session");
    if (!session) { router.push("/"); return; }
    const parsed = JSON.parse(session);
    if (!parsed.loggedIn) { router.push("/"); return; }
    setMatcherName(parsed.name);
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("tdc_session");
    router.push("/");
  }

  const filtered = customers.filter((c) => {
    const matchesSearch =
      `${c.firstName} ${c.lastName} ${c.city} ${c.designation}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: "Total Clients", value: customers.length, icon: Users, color: "text-rose-500", bg: "bg-rose-50" },
    { label: "Active", value: customers.filter((c) => c.status === "Active").length, icon: UserCheck, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "New", value: customers.filter((c) => c.status === "New").length, icon: Sparkles, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Matched", value: customers.filter((c) => c.status === "Matched").length, icon: Clock, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="min-h-screen bg-rose-50/30">
      {/* Navbar */}
      <nav className="bg-white border-b border-rose-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800 text-lg leading-none">TDC Matchmaker</h1>
              <p className="text-xs text-gray-400">Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-700">{matcherName}</p>
              <p className="text-xs text-gray-400">Senior Matchmaker</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-rose-600 transition-colors px-3 py-2 rounded-lg hover:bg-rose-50"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, city, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm bg-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as CustomerStatus | "All")}
            className="py-3 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm bg-white text-gray-700"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="New">New</option>
            <option value="On Hold">On Hold</option>
            <option value="Matched">Matched</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <p className="text-sm text-gray-500 mb-4">{filtered.length} client{filtered.length !== 1 ? "s" : ""} found</p>

        {/* Customer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((customer: Customer) => (
            <div
              key={customer.id}
              onClick={() => router.push(`/dashboard/${customer.id}`)}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md hover:border-rose-200 transition-all group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                  style={{ backgroundColor: customer.profilePhoto }}
                >
                  {getInitials(customer.firstName, customer.lastName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {customer.firstName} {customer.lastName}
                    </h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_COLORS[customer.status]}`}>
                      {customer.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{customer.designation}</p>
                  <p className="text-xs text-gray-400">{customer.city} · {customer.age} yrs</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">Gender:</span>
                  <span className="font-medium text-gray-600">{customer.gender}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">Height:</span>
                  <span className="font-medium text-gray-600">{customer.heightCm}cm</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">Status:</span>
                  <span className="font-medium text-gray-600">{customer.maritalStatus.split(" ")[0]}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">Religion:</span>
                  <span className="font-medium text-gray-600 truncate">{customer.religion}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-400">Joined {new Date(customer.joinedDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
                <span className="text-sm font-semibold text-rose-500 group-hover:text-rose-600 flex items-center gap-1">
                  View Profile →
                </span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Heart className="w-12 h-12 text-rose-200 mx-auto mb-4" />
            <p className="text-gray-400">No clients match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
