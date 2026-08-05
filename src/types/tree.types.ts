export interface Household {
  id: string;
  family_id: string;
  parent_household_id?: string;
  name: string;
  generation: number;
  created_at: string;
}

export interface TreeMember {
  id: string;
  household_id?: string;
  member_type: string;
  is_admin: boolean;
  parent_member_id?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
  date_of_birth?: string;
  gender?: string;
  is_deceased?: boolean;
  relationship_type?: string;
}

export interface GhostMember {
  id: string;
  family_id: string;
  household_id?: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  date_of_death?: string;
  relationship_type_id?: string;
  is_deceased: boolean;
  linked_user_id?: string;
  added_by: string;
  created_at: string;
}

export interface HouseholdJoinRequest {
  id: string;
  family_id: string;
  member_id: string;
  household_id: string;
  status: "pending" | "approved" | "rejected";
  requested_at: string;
  reviewed_at?: string;
}

export interface FamilyTree {
  households: Household[];
  members: TreeMember[];
  ghosts: GhostMember[];
}

export interface CreateHouseholdRequest {
  name: string;
  parent_household_id?: string;
}

export interface CreateGhostRequest {
  first_name: string;
  last_name: string;
  household_id?: string;
  date_of_birth?: string;
  date_of_death?: string;
  relationship_type_id?: string;
}

export interface ReviewJoinRequest {
  approved: boolean;
}