import { Customer, Profile, MatchResult } from "@/types";

function getProfessionCategory(designation: string, company: string): string {
  const combined = `${designation} ${company}`.toLowerCase();
  if (/doctor|mbbs|surgeon|medical|health|hospital|clinic|pharma/.test(combined)) return "medical";
  if (/software|engineer|developer|tech|it|data|cloud|devops|architect|pm|product/.test(combined)) return "tech";
  if (/finance|bank|ca|chartered|audit|investment|fund|analyst|economist/.test(combined)) return "finance";
  if (/lawyer|advocate|legal|law|judge/.test(combined)) return "legal";
  if (/teacher|professor|academic|school|college|university|research|scientist/.test(combined)) return "education";
  if (/design|artist|creative|fashion|art|media|film|actor|director/.test(combined)) return "creative";
  if (/business|entrepreneur|ceo|founder|director|owner|trade|export/.test(combined)) return "business";
  if (/government|ias|ips|govt|officer|civil service|collector/.test(combined)) return "government";
  return "other";
}

function familyValuesScore(a: string, b: string): number {
  if (a === b) return 5;
  const order = ["Traditional", "Moderate", "Liberal"];
  const diff = Math.abs(order.indexOf(a) - order.indexOf(b));
  return diff === 1 ? 3 : 0;
}

function kidsCompatibility(a: string, b: string): boolean {
  if (a === b) return true;
  if (a === "Yes" && b === "No") return false;
  if (a === "No" && b === "Yes") return false;
  return true; // Maybe is compatible with anything
}

export function computeMatches(customer: Customer, pool: Profile[]): MatchResult[] {
  const oppositeGender = pool.filter((p) => p.gender !== customer.gender);

  const scored = oppositeGender.map((profile): MatchResult => {
    let score = 0;
    const reasons: string[] = [];

    if (customer.gender === "Male") {
      // Age: woman 1-8 years younger
      const ageDiff = customer.age - profile.age;
      if (ageDiff >= 1 && ageDiff <= 8) {
        const ageScore = ageDiff <= 4 ? 25 : 15;
        score += ageScore;
        reasons.push(`Age gap of ${ageDiff} year${ageDiff > 1 ? "s" : ""} — ideal match`);
      } else if (ageDiff > 8) {
        score += 5;
      } else if (ageDiff < 0) {
        score += 0;
      }

      // Income: woman earns less
      if (profile.incomeINR < customer.incomeINR) {
        const ratio = profile.incomeINR / customer.incomeINR;
        const incomeScore = ratio < 0.5 ? 20 : ratio < 0.8 ? 15 : 10;
        score += incomeScore;
        reasons.push(`Income compatibility — he earns significantly more`);
      }

      // Height: woman shorter
      if (profile.heightCm < customer.heightCm) {
        score += 10;
        reasons.push(`Height compatible — ${customer.heightCm}cm vs ${profile.heightCm}cm`);
      }

      // Kids compatibility
      if (kidsCompatibility(customer.wantKids, profile.wantKids)) {
        score += 20;
        if (customer.wantKids === profile.wantKids) {
          reasons.push(`Both ${customer.wantKids === "Yes" ? "want" : customer.wantKids === "No" ? "don't want" : "are open about"} kids`);
        } else {
          reasons.push(`Compatible views on having children`);
        }
      }

      // Religion
      if (customer.religion === profile.religion) {
        score += 10;
        reasons.push(`Same religion (${customer.religion})`);
      }

      // Caste
      if (customer.caste === profile.caste) {
        score += 5;
        reasons.push(`Same caste background`);
      }

      // Relocation compatibility
      if (customer.openToRelocate === "Yes" || profile.openToRelocate === "Yes" || customer.city === profile.city) {
        score += 5;
        if (customer.city === profile.city) reasons.push(`Both based in ${customer.city}`);
        else reasons.push(`Relocation flexibility aligns`);
      }

      // Family values
      const fvScore = familyValuesScore(customer.familyValues, profile.familyValues);
      score += fvScore;
      if (fvScore >= 3) reasons.push(`Compatible family values (${customer.familyValues} ↔ ${profile.familyValues})`);

      // Manglik bonus
      if (customer.manglik === profile.manglik) score += 5;

    } else {
      // Female customer logic
      // Profession compatibility
      const custProf = getProfessionCategory(customer.designation, customer.currentCompany);
      const matchProf = getProfessionCategory(profile.designation, profile.currentCompany);
      if (custProf === matchProf) {
        score += 20;
        reasons.push(`Same professional field (${custProf}) — shared understanding`);
      } else if ((custProf === "tech" && matchProf === "business") || (custProf === "business" && matchProf === "tech")) {
        score += 10;
        reasons.push(`Complementary professional backgrounds`);
      }

      // Family values
      const fvScore = familyValuesScore(customer.familyValues, profile.familyValues);
      score += fvScore * 4; // weighted more (up to 20)
      if (fvScore > 0) reasons.push(`Family values compatibility (${customer.familyValues} ↔ ${profile.familyValues})`);

      // Relocation
      if (customer.openToRelocate === profile.openToRelocate || customer.city === profile.city) {
        score += 15;
        if (customer.city === profile.city) reasons.push(`Both in ${customer.city} — no relocation needed`);
        else reasons.push(`Matching relocation preferences`);
      } else if (customer.openToRelocate === "Maybe" || profile.openToRelocate === "Maybe") {
        score += 7;
        reasons.push(`Some flexibility on relocation`);
      }

      // Kids compatibility
      if (kidsCompatibility(customer.wantKids, profile.wantKids)) {
        score += 20;
        if (customer.wantKids === profile.wantKids) {
          reasons.push(`Both aligned on having ${customer.wantKids === "Yes" ? "" : "not having "}children`);
        } else {
          reasons.push(`Compatible views on children`);
        }
      }

      // Diet compatibility
      const vegTypes = ["Vegetarian", "Vegan", "Eggetarian"];
      const custVeg = vegTypes.includes(customer.diet);
      const matchVeg = vegTypes.includes(profile.diet);
      if (customer.diet === profile.diet) {
        score += 10;
        reasons.push(`Same dietary preference (${customer.diet})`);
      } else if (custVeg && matchVeg) {
        score += 8;
        reasons.push(`Compatible dietary preferences`);
      }

      // Religion
      if (customer.religion === profile.religion) {
        score += 10;
        reasons.push(`Same religion (${customer.religion})`);
      }

      // Language overlap
      const shared = customer.languages.filter((l) => profile.languages.includes(l));
      if (shared.length > 0) {
        score += Math.min(shared.length * 2, 5);
        reasons.push(`Shared language(s): ${shared.join(", ")}`);
      }

      // Pets
      if (customer.openToPets === profile.openToPets) score += 3;

      // Manglik
      if (customer.manglik === profile.manglik) score += 2;
    }

    // Clamp score to 100
    score = Math.min(score, 100);

    let scoreLabel: MatchResult["scoreLabel"];
    let scoreColor: string;
    if (score >= 75) { scoreLabel = "High Potential"; scoreColor = "#059669"; }
    else if (score >= 55) { scoreLabel = "Good Match"; scoreColor = "#2563EB"; }
    else if (score >= 35) { scoreLabel = "Possible Match"; scoreColor = "#D97706"; }
    else { scoreLabel = "Low Match"; scoreColor = "#DC2626"; }

    // Ensure at least one reason
    if (reasons.length === 0) reasons.push("Some compatibility found");

    return { profile, score, scoreLabel, scoreColor, reasons };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 20);
}
