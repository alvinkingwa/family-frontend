import api from "./api";
import { ENDPOINTS } from "../constants";
import { CreateHouseholdRequest,FamilyTree,CreateGhostRequest,HouseholdJoinRequest,ReviewJoinRequest,GhostMember,Household } from "../types";

export const treeService = {
  // get full family tree
  async getFamilyTree(): Promise<{ tree: FamilyTree }> {
    const res = await api.get(ENDPOINTS.HOUSEHOLDS);
    return res.data;
  },

  // admin creates a household
  async createHousehold(data: CreateHouseholdRequest): Promise<{ household: Household }> {
    const res = await api.post(ENDPOINTS.HOUSEHOLDS, data);
    return res.data;
  },

  // member requests to join a household
  async requestJoinHousehold(householdId: string): Promise<void> {
    await api.post(ENDPOINTS.JOIN_REQUEST(householdId));
  },

  // admin gets all pending join requests
  async getJoinRequests(): Promise<{ requests: HouseholdJoinRequest[] }> {
    const res = await api.get(ENDPOINTS.JOIN_REQUESTS);
    return res.data;
  },

  // admin approves or rejects a join request
  async reviewJoinRequest(
    requestId: string,
    data: ReviewJoinRequest
  ): Promise<void> {
    await api.put(ENDPOINTS.REVIEW_REQUEST(requestId), data);
  },

  // admin creates a ghost member
  async createGhost(data: CreateGhostRequest): Promise<{ ghost: GhostMember }> {
    const res = await api.post(ENDPOINTS.GHOST_MEMBERS, data);
    return res.data;
  },

  // admin updates a ghost member
  async updateGhost(
    ghostId: string,
    data: Partial<CreateGhostRequest>
  ): Promise<{ ghost: GhostMember }> {
    const res = await api.put(ENDPOINTS.UPDATE_GHOST(ghostId), data);
    return res.data;
  },

  // list ghost members
  async listGhosts(): Promise<{ ghosts: GhostMember[] }> {
    const res = await api.get(ENDPOINTS.GHOST_MEMBERS);
    return res.data;
  },
};