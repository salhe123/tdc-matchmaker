"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, MapPin, Briefcase, GraduationCap, Heart, Users, Star,
  Languages, Utensils, Home, Baby, PawPrint, MoveRight, Send, X, Sparkles, ChevronDown, ChevronUp
} from "lucide-react";
import { customers } from "@/data/customers";
import { poolProfiles } from "@/data/profiles";
import { computeMatches } from "@/lib/matching";
import { Customer, MatchResult } from "@/types";

function getInitials(first: string, last: string) {
  return `${first[0]}${last[0]}`.toUpperCase();
}

function formatIncome(n: number) {
  const lakh = n / 100000;
  if (lakh >= 100) return `₹${(lakh / 100).toFixed(1)} Cr PA`;
  return `₹${lakh % 1 === 0 ? lakh : lakh.toFixed(1)} LPA`;
}

function InfoRow({ label, value }: { label: string; value: string | number | boolean }) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 w-28 flex-shrink-0">{label}</span>
      <span className="text-xs font-medium text-gray-700 text-right flex-1">{String(value)}</span>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-rose-400" />
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function MatchCard({ match, customer, onSendMatch }: { match: MatchResult; customer: Customer; onSendMatch: (m: MatchResult, intro: string) => void }) {
  const [introText, setIntroText] = useState("");
  const [loadingIntro, setLoadingIntro] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  async function handleGenerateIntro() {
    setLoadingIntro(true);
    try {
      const res = await fetch("/api/ai/intro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: `${customer.firstName} ${customer.lastName}`,
          matchName: `${match.profile.firstName} ${match.profile.lastName}`,
          reasons: match.reasons,
        }),
      });
      const data = await res.json();
      setIntroText(data.intro || "");
      setShowIntro(true);
    } catch {
      setIntroText("We believe this could be a wonderful match based on shared values and compatibility.");
      setShowIntro(true);
    } finally {
      setLoadingIntro(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
          style={{ backgroundColor: match.profile.profilePhoto }}
        >
          {getInitials(match.profile.firstName, match.profile.lastName)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold text-gray-800">{match.profile.firstName} {match.profile.lastName}</h4>
              <p className="text-xs text-gray-500">{match.profile.designation} @ {match.profile.currentCompany}</p>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />{match.profile.city} · {match.profile.age} yrs · {match.profile.heightCm}cm
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <div
                className="text-xs font-bold px-2.5 py-1 rounded-full text-white mb-1"
                style={{ backgroundColor: match.scoreColor }}
              >
                {match.score}%
              </div>
              <p className="text-xs font-medium" style={{ color: match.scoreColor }}>{match.scoreLabel}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Match reasons */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-500 mb-2">Why they match:</p>
        <ul className="space-y-1">
          {match.reasons.slice(0, 4).map((r, i) => (
            <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
              <span className="text-rose-400 mt-0.5">•</span>{r}
            </li>
          ))}
        </ul>
      </div>

      {/* Extra info row */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[match.profile.religion, match.profile.maritalStatus, match.profile.diet, `Kids: ${match.profile.wantKids}`].map((tag) => (
          <span key={tag} className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full border border-gray-100">{tag}</span>
        ))}
      </div>

      {/* AI Intro */}
      {showIntro && introText && (
        <div className="mb-4 p-3 bg-rose-50 rounded-xl border border-rose-100">
          <p className="text-xs font-semibold text-rose-600 mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> AI-Generated Intro
          </p>
          <p className="text-xs text-gray-700 leading-relaxed italic">{introText}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {!showIntro ? (
          <button
            onClick={handleGenerateIntro}
            disabled={loadingIntro}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-rose-600 border border-rose-200 rounded-xl hover:bg-rose-50 transition-colors disabled:opacity-60"
          >
            {loadingIntro ? (
              <span className="w-3 h-3 border border-rose-400 border-t-transparent rounded-full animate-spin" />
            ) : <Sparkles className="w-3 h-3" />}
            {loadingIntro ? "Generating..." : "Generate Intro"}
          </button>
        ) : (
          <button
            onClick={() => setShowIntro(!showIntro)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {showIntro ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {showIntro ? "Hide Intro" : "Show Intro"}
          </button>
        )}
        <button
          onClick={() => onSendMatch(match, introText)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-white bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl hover:from-rose-600 hover:to-pink-700 transition-all"
        >
          <Send className="w-3 h-3" /> Send Match
        </button>
      </div>
    </div>
  );
}

function SendMatchModal({ match, customer, intro, onClose }: { match: MatchResult; customer: Customer; intro: string; onClose: () => void }) {
  const [sent, setSent] = useState(false);

  function handleConfirm() {
    setSent(true);
    setTimeout(onClose, 1800);
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        {sent ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-emerald-500 fill-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Match Sent!</h3>
            <p className="text-sm text-gray-500">
              {match.profile.firstName} has been suggested to {customer.firstName} {customer.lastName}.
            </p>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Send Match Suggestion</h3>
            <p className="text-sm text-gray-500 mb-5">
              You are about to suggest <strong>{match.profile.firstName} {match.profile.lastName}</strong> to{" "}
              <strong>{customer.firstName} {customer.lastName}</strong>.
            </p>

            {/* Match summary */}
            <div className="bg-rose-50 rounded-xl p-4 mb-4 border border-rose-100">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: match.profile.profilePhoto }}
                >
                  {getInitials(match.profile.firstName, match.profile.lastName)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{match.profile.firstName} {match.profile.lastName}</p>
                  <p className="text-xs text-gray-500">{match.profile.age} yrs · {match.profile.city} · {match.profile.designation}</p>
                </div>
                <div className="ml-auto">
                  <span className="text-sm font-bold" style={{ color: match.scoreColor }}>{match.score}%</span>
                  <p className="text-xs" style={{ color: match.scoreColor }}>{match.scoreLabel}</p>
                </div>
              </div>
              <div className="text-xs text-gray-600">
                <strong>Income:</strong> {formatIncome(match.profile.incomeINR)} · <strong>Religion:</strong> {match.profile.religion} · <strong>Kids:</strong> {match.profile.wantKids}
              </div>
            </div>

            {/* Intro email preview */}
            <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
              <p className="text-xs font-semibold text-gray-500 mb-2">Email Introduction Preview</p>
              <p className="text-xs text-gray-700 leading-relaxed">
                {intro || `Hi ${customer.firstName}, we'd love to introduce you to ${match.profile.firstName} ${match.profile.lastName} — ${match.reasons[0]?.toLowerCase() ?? "a wonderful potential match"}. We believe you two could be a great fit!`}
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-semibold hover:from-rose-600 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Confirm Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function CustomerDetailPage({ params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = use(params);
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [modalData, setModalData] = useState<{ match: MatchResult; intro: string } | null>(null);

  useEffect(() => {
    const session = localStorage.getItem("tdc_session");
    if (!session) { router.push("/"); return; }
    const parsed = JSON.parse(session);
    if (!parsed.loggedIn) { router.push("/"); }
  }, [router]);

  const customer = customers.find((c) => c.id === customerId);

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Customer not found.</p>
          <button onClick={() => router.push("/dashboard")} className="text-rose-500 hover:underline">← Back to dashboard</button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    setNotes(customer.matchmakerNotes);
  }, [customer]);

  const matches = computeMatches(customer, poolProfiles);

  return (
    <>
      {modalData && (
        <SendMatchModal
          match={modalData.match}
          customer={customer}
          intro={modalData.intro}
          onClose={() => setModalData(null)}
        />
      )}

      <div className="min-h-screen bg-rose-50/30">
        {/* Navbar */}
        <nav className="bg-white border-b border-rose-100 shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-rose-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: customer.profilePhoto }}>
                {getInitials(customer.firstName, customer.lastName)}
              </div>
              <span className="font-semibold text-gray-800">{customer.firstName} {customer.lastName}</span>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-6">
          {/* LEFT: Profile Panel */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-4">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3"
                style={{ backgroundColor: customer.profilePhoto }}
              >
                {getInitials(customer.firstName, customer.lastName)}
              </div>
              <h2 className="text-xl font-bold text-gray-800">{customer.firstName} {customer.lastName}</h2>
              <p className="text-sm text-gray-500">{customer.designation}</p>
              <p className="text-xs text-gray-400 flex items-center justify-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />{customer.city}, {customer.country}
              </p>
              <div className="mt-3">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  customer.status === "Active" ? "bg-emerald-100 text-emerald-700" :
                  customer.status === "New" ? "bg-blue-100 text-blue-700" :
                  customer.status === "On Hold" ? "bg-amber-100 text-amber-700" :
                  customer.status === "Matched" ? "bg-purple-100 text-purple-700" :
                  "bg-gray-100 text-gray-500"
                }`}>{customer.status}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">{customer.aboutMe}</p>
            </div>

            {/* Biodata Sections */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <Section title="Personal" icon={Users}>
                <InfoRow label="First Name" value={customer.firstName} />
                <InfoRow label="Last Name" value={customer.lastName} />
                <InfoRow label="Gender" value={customer.gender} />
                <InfoRow label="Date of Birth" value={new Date(customer.dateOfBirth).toLocaleDateString("en-IN")} />
                <InfoRow label="Age" value={`${customer.age} years`} />
                <InfoRow label="Country" value={customer.country} />
                <InfoRow label="City" value={customer.city} />
                <InfoRow label="Height" value={`${customer.heightCm} cm`} />
                <InfoRow label="Email" value={customer.email} />
                <InfoRow label="Phone" value={customer.phone} />
                <InfoRow label="Marital Status" value={customer.maritalStatus} />
                <InfoRow label="Complexion" value={customer.complexion} />
                <InfoRow label="Religion" value={customer.religion} />
                <InfoRow label="Caste" value={customer.caste} />
                <InfoRow label="Mother Tongue" value={customer.motherTongue} />
                <InfoRow label="Manglik" value={customer.manglik ? "Yes" : "No"} />
                <InfoRow label="Siblings" value={customer.siblings} />
              </Section>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <Section title="Professional" icon={Briefcase}>
                <InfoRow label="Company" value={customer.currentCompany} />
                <InfoRow label="Designation" value={customer.designation} />
                <InfoRow label="Income" value={formatIncome(customer.incomeINR)} />
                <InfoRow label="College" value={customer.undergraduateCollege} />
                <InfoRow label="Degree" value={customer.degree} />
              </Section>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <Section title="Lifestyle" icon={Utensils}>
                <InfoRow label="Diet" value={customer.diet} />
                <InfoRow label="Smoking" value={customer.smoking} />
                <InfoRow label="Drinking" value={customer.drinking} />
                <InfoRow label="Family Type" value={customer.familyType} />
                <InfoRow label="Family Values" value={customer.familyValues} />
              </Section>
              <Section title="Preferences" icon={Heart}>
                <InfoRow label="Want Kids" value={customer.wantKids} />
                <InfoRow label="Open to Relocate" value={customer.openToRelocate} />
                <InfoRow label="Open to Pets" value={customer.openToPets} />
              </Section>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <Section title="Languages" icon={Languages}>
                <div className="flex flex-wrap gap-1.5">
                  {customer.languages.map((l) => (
                    <span key={l} className="text-xs bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full border border-rose-100">{l}</span>
                  ))}
                </div>
              </Section>
              <Section title="Hobbies" icon={Star}>
                <div className="flex flex-wrap gap-1.5">
                  {customer.hobbies.map((h) => (
                    <span key={h} className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full border border-gray-100">{h}</span>
                  ))}
                </div>
              </Section>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Matchmaker Notes</h4>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Add notes about this client..."
                className="w-full text-xs text-gray-700 border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
              <button className="mt-2 w-full text-xs font-medium text-rose-600 border border-rose-200 py-2 rounded-xl hover:bg-rose-50 transition-colors">
                Save Notes
              </button>
            </div>
          </div>

          {/* RIGHT: Matches Panel */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Suggested Matches</h3>
                <p className="text-sm text-gray-500">
                  {matches.length} profiles found for {customer.firstName} · Showing top {Math.min(matches.length, 20)}
                </p>
              </div>
              <div className="flex gap-2">
                <span className="text-xs px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                  {matches.filter((m) => m.scoreLabel === "High Potential").length} High Potential
                </span>
                <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                  {matches.filter((m) => m.scoreLabel === "Good Match").length} Good Match
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {matches.map((match) => (
                <MatchCard
                  key={match.profile.id}
                  match={match}
                  customer={customer}
                  onSendMatch={(m, intro) => setModalData({ match: m, intro })}
                />
              ))}
            </div>

            {matches.length === 0 && (
              <div className="text-center py-20">
                <Heart className="w-12 h-12 text-rose-200 mx-auto mb-4" />
                <p className="text-gray-400">No matches found in the pool.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
