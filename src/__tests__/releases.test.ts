import { describe, it, expect } from "vitest";
import { fetchLatestRelease, formatBytes } from "../lib/releases";

describe("formatBytes", () => {
  it("formats bytes", () => {
    expect(formatBytes(500)).toBe("500 B");
  });
  it("formats KB", () => {
    expect(formatBytes(2048)).toBe("2 KB");
  });
  it("formats MB", () => {
    expect(formatBytes(3039232)).toBe("2.9 MB");
  });
});

describe("fetchLatestRelease", () => {
  it("returns fallback on network error (no crash)", async () => {
    // Stub the global fetch to fail
    const orig = globalThis.fetch;
    globalThis.fetch = () => Promise.reject(new Error("network error")) as any;

    const result = await fetchLatestRelease();
    expect(result.tag).toBe("v0.8.0");
    expect(result.msi).not.toBeNull();
    expect(result.msi!.name).toContain(".msi");
    expect(result.setup).not.toBeNull();
    expect(result.portable).not.toBeNull();

    globalThis.fetch = orig;
  });

  it("returns fallback on non-ok response", async () => {
    const orig = globalThis.fetch;
    globalThis.fetch = () => Promise.resolve({ ok: false }) as any;

    const result = await fetchLatestRelease();
    expect(result.tag).toBe("v0.8.0");

    globalThis.fetch = orig;
  });
});