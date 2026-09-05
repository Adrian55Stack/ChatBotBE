import { translateString } from "./translateString.js";

describe("translateString", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    process.env.DEEP_L_API_kEY = "test-key";
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("returns translated text and detected source language", async () => {
    const mockResponse = {
      translations: [
        { text: "¿Quién es Zeus?", detected_source_language: "EN" },
      ],
    };

    global.fetch.mockResolvedValue({
      text: jest.fn().mockResolvedValue(JSON.stringify(mockResponse)),
    });

    const result = await translateString("Who is Zeus?", "ES");

    expect(result).toEqual(["¿Quién es Zeus?", "EN"]);
  });

  it("calls fetch with the correct URL, method, headers, and body", async () => {
    const mockResponse = {
      translations: [{ text: "Bonjour", detected_source_language: "EN" }],
    };

    global.fetch.mockResolvedValue({
      text: jest.fn().mockResolvedValue(JSON.stringify(mockResponse)),
    });

    await translateString("Hello", "FR");

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: expect.any(String),
        headers: expect.objectContaining({
          Authorization: "DeepL-Auth-Key test-key",
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ text: ["Hello"], target_lang: "FR" }),
      })
    );
  });

  it("throws if the API returns malformed JSON", async () => {
    global.fetch.mockResolvedValue({
      text: jest.fn().mockResolvedValue("<html>Error page</html>"),
    });

    await expect(translateString("Hello", "ES")).rejects.toThrow();
  });
});