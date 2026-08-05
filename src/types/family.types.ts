export type MemberType = "adult" | "child";
export type InvitationStatus = "pending" | "accepted" | "expired";

export interface ExtendedFamily {
  id: string;
  name: string;
  adult_age_threshold: number;
  created_by: string;
  created_at: string;
}

export interface FamilyMember {
  id: string;
  family_id: string;
  household_id?: string;
  user_id: string;
  member_type: MemberType;
  relationship_type_id?: string;
  parent_member_id?: string;
  is_admin: boolean;
  joined_at: string;
}

export interface FamilyWithMember {
  family_id: string;
  family_name: string;
  member_id: string;
  member_type: MemberType;
  is_admin: boolean;
  household_id?: string;
}

export interface Invitation {
  id: string;
  family_id: string;
  household_id?: string;
  invited_email: string;
  invited_by: string;
  status: InvitationStatus;
  expires_at: string;
  created_at: string;
}

export interface CreateFamilyRequest {
  name: string;
}

export interface InviteMemberRequest {
  email: string;
  household_id?: string;
}

export interface JoinFamilyRequest {
  invite_token: string;
}

export interface TransferAdminRequest {
  target_member_id: string;
}

export interface ChangeMemberTypeRequest {
  member_type: MemberType;
}

export interface SetThresholdRequest {
  threshold: number;
}