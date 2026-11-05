import { describe, it, expect, afterEach } from "vitest";
import { fetchLatestRelease, formatBytes, FALLBACK } from "../lib/releases";

const orig = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = orig;
});

describe("formatBytes", () => {
  it("formats bytes, KB, MB", () => {
    expect(formatBytes(500)).toBe("500 B");
    expect(formatBytes(2048)).toBe("2 KB");
    expect(formatBytes(3039232)).toBe("2.9 MB");
  });
});

describe("fetchLatestRelease", () => {
  it("falls back to the verified stable release on network error", async () => {
    globalThis.fetch = () => Promise.reject(new Error("network")) as any;
    const r = await fetchLatestRelease();
    expect(r.tag).toBe("v0.8.2");
    expect(r.msi!.browser_download_url).toContain("/releases/download/v0.8.2/");
    expect(r.setup && r.portable && r.exe).toBeTruthy();
  });

  it("falls back on non-ok or malformed responses", async () => {
    globalThis.fetch = () => Promise.resolve({ ok: false }) as any;
    expect(await fetchLatestRelease()).toBe(FALLBACK);
    globalThis.fetch = () => Promise.resolve({ ok: true, json: async () => ({}) }) as any;
    expect(await fetchLatestRelease()).toBe(FALLBACK);
  });

  it("maps GitHub assets without confusing the portable zip and the bare exe", async () => {    const asset = (name: string) => ({ name, browser_download_url: `https://x/${name}`, size: 1 });
    globalThis.fetch = () =>
      Promise.resolve({
        ok: true,
        json: async () => ({
          tag_name: "v9.9.9",
          html_url: "https://x/rel",
          assets: [asset("chromadeck.exe"), asset("A_x64-portable.zip"), asset("A-setup.exe"), asset("A.msi")],
        }),
      }) as any;
    const r = await fetchLatestRelease();
    expect(r.tag).toBe("v9.9.9");
    expect(r.portable!.name).toBe("A_x64-portable.zip");
    expect(r.exe!.name).toBe("chromadeck.exe");
    expect(r.setup!.name).toBe("A-setup.exe");
  });

  it("refuses a new release whose expected installers are missing", async () => {
    // Without this guard the download buttons would dereference null.
    const asset = (name: string) => ({ name, browser_download_url: `https://x/${name}`, size: 1 });
    globalThis.fetch = () =>
      Promise.resolve({
        ok: true,
        json: async () => ({
          tag_name: "v9.9.9",
          html_url: "https://x/rel",
          assets: [asset("chromadeck.exe"), asset("A-setup.exe")], // no msi, no portable
        }),
      }) as any;
    expect(await fetchLatestRelease()).toBe(FALLBACK);
  });
});
