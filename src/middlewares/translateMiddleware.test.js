import { translateMiddleware } from "./translateMiddleware.js";
import { translateString } from "../utils/translateString.js";

jest.mock("../utils/translateString.js");

describe("translateMiddleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: { question: "¿Quién es Zeus?" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("translates the question and calls next()", async () => {
    translateString.mockResolvedValue(["Who is Zeus?", "ES"]);

    await translateMiddleware(req, res, next);

    expect(translateString).toHaveBeenCalledWith("¿Quién es Zeus?", "EN");
    expect(req.body.question).toBe("Who is Zeus?");
    expect(req.body.detected_language).toBe("ES");
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("returns 500 and does not call next() if translateString throws", async () => {
    translateString.mockRejectedValue(new Error("API failure"));
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await translateMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Translation failed" });
    expect(next).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});