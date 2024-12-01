import httpClient from "./index";
import MockAdapter from "axios-mock-adapter";

describe("httpClient", () => {
  let mock: any;

  beforeAll(() => {
    mock = new MockAdapter(httpClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it("should have the correct base URL", () => {
    expect(httpClient.defaults.baseURL).toBe("http://localhost:3000/");
  });

  it("should have the correct timeout", () => {
    expect(httpClient.defaults.timeout).toBe(10000);
  });

  it("should set the default Content-Type header", () => {
    expect(httpClient.defaults.headers["Content-Type"]).toBe(
      "application/json"
    );
  });

  it("should handle a successful GET request and match the mock object structure", async () => {
    const mockData = { message: "Success" };
    mock.onGet("/test").reply(200, mockData);

    const response = await httpClient.get("/test");

    expect(response).toEqual({
      config: expect.objectContaining({
        baseURL: "http://localhost:3000/",
        data: undefined,
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
        method: "get",
        timeout: 10000,
        url: "/test",
      }),
      data: mockData,
      headers: expect.any(Object),
      request: expect.objectContaining({
        responseURL: expect.any(String),
      }),
      status: 200,
    });
  });

  it("should handle a failed GET request and throw an error", async () => {
    mock.onGet("/error").reply(404, { message: "Not Found" });

    await expect(httpClient.get("/error")).rejects.toThrow(
      "Request failed with status code 404"
    );
  });

  it("should handle a POST request and match the mock object structure", async () => {
    const mockRequestData = { name: "John Doe" };
    const mockResponseData = { id: 1, name: "John Doe" };

    mock.onPost("/users", mockRequestData).reply(201, mockResponseData);

    const response = await httpClient.post("/users", mockRequestData);

    expect(response).toEqual({
      config: expect.objectContaining({
        baseURL: "http://localhost:3000/",
        data: JSON.stringify(mockRequestData),
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
        method: "post",
        timeout: 10000,
        url: "/users",
      }),
      data: mockResponseData,
      headers: expect.any(Object),
      request: expect.objectContaining({
        responseURL: expect.any(String),
      }),
      status: 201,
    });
  });
});
