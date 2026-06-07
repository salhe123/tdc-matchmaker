export type Gender = "Male" | "Female";
export type MaritalStatus = "Never Married" | "Divorced" | "Widowed" | "Separated";
export type YesNoMaybe = "Yes" | "No" | "Maybe";
export type FamilyType = "Nuclear" | "Joint" | "Extended";
export type FamilyValues = "Traditional" | "Moderate" | "Liberal";
export type Diet = "Vegetarian" | "Non-Vegetarian" | "Eggetarian" | "Vegan";
export type Smoking = "No" | "Occasionally" | "Yes";
export type Drinking = "No" | "Occasionally" | "Social Drinker" | "Yes";
export type Complexion = "Fair" | "Wheatish" | "Dusky" | "Dark";
export type CustomerStatus = "Active" | "On Hold" | "Matched" | "New" | "Closed";

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string; // ISO date string
  age: number;
  country: string;
  city: string;
  heightCm: number; // in cm
  email: string;
  phone: string;
  undergraduateCollege: string;
  degree: string;
  incomeINR: number; // annual in INR
  currentCompany: string;
  designation: string;
  maritalStatus: MaritalStatus;
  languages: string[];
  siblings: number;
  caste: string;
  religion: string;
  wantKids: YesNoMaybe;
  openToRelocate: YesNoMaybe;
  openToPets: YesNoMaybe;
  // Additional Indian matrimonial fields
  manglik: boolean;
  familyType: FamilyType;
  familyValues: FamilyValues;
  diet: Diet;
  smoking: Smoking;
  drinking: Drinking;
  complexion: Complexion;
  aboutMe: string;
  hobbies: string[];
  motherTongue: string;
  profilePhoto?: string; // placeholder avatar color
}

export interface Customer extends Profile {
  status: CustomerStatus;
  matchmakerNotes: string;
  assignedMatchmaker: string;
  joinedDate: string;
}

export interface MatchResult {
  profile: Profile;
  score: number;
  scoreLabel: "High Potential" | "Good Match" | "Possible Match" | "Low Match";
  scoreColor: string;
  reasons: string[];
  aiIntro?: string;
}

export interface Note {
  id: string;
  customerId: string;
  text: string;
  createdAt: string;
  author: string;
}
