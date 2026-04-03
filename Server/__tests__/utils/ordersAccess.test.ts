import { describe, it, expect } from "vitest";
import { getOrdersAccessError } from "../../src/utils/ordersAccess";

describe("getOrdersAccessError", () => {
  it("returns 400 when requested user id is invalid", () => {
    expect(getOrdersAccessError(10, Number.NaN)).toEqual({
      status: 400,
      message: "Invalid user id",
    });
  });

  it("returns 403 when requester id does not match requested user id", () => {
    expect(getOrdersAccessError(10, 11)).toEqual({
      status: 403,
      message: "Forbidden: you can only access your own order data",
    });
  });

  it("returns null when requester id matches requested user id", () => {
    expect(getOrdersAccessError(10, 10)).toBeNull();
  });
});
