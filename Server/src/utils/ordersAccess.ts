interface AccessError {
  status: number;
  message: string;
}

// Validates user can only access order data for their own user id
export function getOrdersAccessError(
  requesterUserId: number,
  requestedUserId: number,
): AccessError | null {
  if (Number.isNaN(requestedUserId)) {
    return { status: 400, message: "Invalid user id" };
  }

  if (requesterUserId !== requestedUserId) {
    return {
      status: 403,
      message: "Forbidden: you can only access your own order data",
    };
  }

  return null;
}
