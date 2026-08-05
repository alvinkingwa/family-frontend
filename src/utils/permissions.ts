import { FamilyWithMember,MemberType } from "../types";

// check if the current member is admin
export const isAdmin = (member: FamilyWithMember | null): boolean => {
  return member?.is_admin ?? false;
};

// check if the current member is an adult
export const isAdult = (member: FamilyWithMember | null): boolean => {
  return member?.member_type === "adult";
};

// check if the current member is a child
export const isChild = (member: FamilyWithMember | null): boolean => {
  return member?.member_type === "child";
};

// check if member can create content
export const canCreateContent = (member: FamilyWithMember | null): boolean => {
  return isAdult(member) || isAdmin(member);
};

// check if member can manage the tree
export const canManageTree = (member: FamilyWithMember | null): boolean => {
  return isAdmin(member);
};

// check if member can invite others
export const canInvite = (member: FamilyWithMember | null): boolean => {
  return isAdmin(member);
};

// get role label for display
export const getRoleLabel = (member: FamilyWithMember | null): string => {
  if (!member) return "";
  if (member.is_admin) return "Admin";
  if (member.member_type === "adult") return "Adult";
  return "Child";
};