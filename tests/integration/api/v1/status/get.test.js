import orchestrador from "tests/orchestrador";

beforeAll(async () => {
  await orchestrador.waitForAllServices();
});

describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody.updated_at).toBeDefined();

      const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
      expect(responseBody.updated_at).toEqual(parsedUpdatedAt);
      expect(responseBody.database.max_connections).toEqual(100);
      expect(responseBody.database.opened_connections).toEqual(1);
      expect(responseBody.database.version).toEqual("16.0");
    });
  });
});
