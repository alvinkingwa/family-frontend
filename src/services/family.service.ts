import api from "./api";
import { ENDPOINTS } from "../constants";
import type {
  ExtendedFamily,
  FamilyWithMember,
  CreateFamilyRequest,
  InviteMemberRequest,
  JoinFamilyRequest,
  TransferAdminRequest,
  ChangeMemberTypeRequest,
  SetThresholdRequest,
} from "../types";
import { storage } from "../utils";


export const familyService = {
  // create a new family
  async createFamily(data: CreateFamilyRequest): Promise<any> {
    const res = await api.post(ENDPOINTS.CREATE_FAMILY, data);
    return res.data;
  },

  // list all families the user belongs to
  async listFamilies(): Promise<{ families: FamilyWithMember[] }> {
    const res = await api.get(ENDPOINTS.LIST_FAMILIES);
    return res.data;
  },

  // admin invites a member
  async inviteMember(data: InviteMemberRequest): Promise<void> {
    await api.post(ENDPOINTS.INVITE_MEMBER, data);
  },

  // join a family via invite token
  // uses pre-family token not family token
  async joinFamily(data: JoinFamilyRequest): Promise<any> {
    const token = await storage.getPreFamilyToken();
    const res = await api.post(ENDPOINTS.JOIN_FAMILY, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  // admin transfers admin role
  async transferAdmin(data: TransferAdminRequest): Promise<void> {
    await api.post(ENDPOINTS.TRANSFER_ADMIN, data);
  },

  // admin removes a member
  async removeMember(memberId: string): Promise<void> {
    await api.delete(ENDPOINTS.REMOVE_MEMBER(memberId));
  },

  // admin changes member type
  async changeMemberType(
    memberId: string,
    data: ChangeMemberTypeRequest
  ): Promise<void> {
    await api.put(ENDPOINTS.CHANGE_TYPE(memberId), data);
  },

  // admin sets age threshold
  async setThreshold(data: SetThresholdRequest): Promise<void> {
    await api.put(ENDPOINTS.SET_THRESHOLD, data);
  },
};