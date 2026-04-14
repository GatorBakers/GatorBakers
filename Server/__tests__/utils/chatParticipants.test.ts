import { describe, expect, it } from "vitest";
import {
  canAccessOrderChat,
  resolveChatParticipants,
} from "../../src/utils/chatParticipants";

describe("chat participant helpers", () => {
  it("resolveChatParticipants returns buyer and seller ids in a unique participant list", () => {
    const result = resolveChatParticipants({
      user_id: 12,
      listing: { user_id: 27 },
    });

    expect(result).toEqual({
      customerId: 12,
      vendorId: 27,
      participantIds: [12, 27],
    });
  });

  it("resolveChatParticipants de-duplicates participant ids when buyer and seller are the same", () => {
    const result = resolveChatParticipants({
      user_id: 7,
      listing: { user_id: 7 },
    });

    expect(result.customerId).toBe(7);
    expect(result.vendorId).toBe(7);
    expect(result.participantIds).toEqual([7]);
  });

  it("canAccessOrderChat returns true for customer", () => {
    expect(canAccessOrderChat(12, 12, 27)).toBe(true);
  });

  it("canAccessOrderChat returns true for vendor", () => {
    expect(canAccessOrderChat(27, 12, 27)).toBe(true);
  });

  it("canAccessOrderChat returns false for unrelated users", () => {
    expect(canAccessOrderChat(99, 12, 27)).toBe(false);
  });
});
