export interface ChatParticipantOrderShape {
  user_id: number;
  listing: {
    user_id: number;
  };
}

export interface ChatParticipantsResolution {
  customerId: number;
  vendorId: number;
  participantIds: number[];
}

// Resolves buyer/seller ids from an order and returns a de-duplicated participant list
export function resolveChatParticipants(
  order: ChatParticipantOrderShape,
): ChatParticipantsResolution {
  const customerId = order.user_id;
  const vendorId = order.listing.user_id;

  return {
    customerId,
    vendorId,
    participantIds: Array.from(new Set([customerId, vendorId])),
  };
}

// Checks whether the requester belongs to the order chat as buyer or seller
export function canAccessOrderChat(
  requesterId: number,
  customerId: number,
  vendorId: number,
): boolean {
  return requesterId === customerId || requesterId === vendorId;
}
