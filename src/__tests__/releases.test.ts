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
    expect(r.tag).toBe("v0.9.5");
    expect(r.msi!.browser_download_url).toContain("/releases/download/v0.9.5/");
    expect(r.msi!.name).toBe("ChromaDeck_0.9.5_x64_en-US.msi");
    expect(r.setup && r.portable).toBeTruthy();
    // Releases since v0.9.2 no longer ship a bare chromadeck.exe.
    expect(r.exe).toBeNull();
  });

  it("accepts a release without a standalone exe (v0.9.x ships MSI, setup and portable ZIP only)", async () => {
    const asset = (name: string) => ({ name, browser_download_url: `https://x/${name}`, size: 1 });
    globalThis.fetch = () =>
      Promise.resolve({
        ok: true,
        json: async () => ({
          tag_name: "v0.9.6",
          html_url: "https://x/rel",
          assets: [
            asset("ChromaDeck_0.9.6_x64-portable.zip"),
            asset("ChromaDeck_0.9.6_x64-setup.exe"),
            asset("ChromaDeck_0.9.6_x64-setup.exe.sig"),
            asset("ChromaDeck_0.9.6_x64_en-US.msi"),
            asset("ChromaDeck_0.9.6_x64_en-US.msi.sig"),
          ],
        }),
      }) as any;
    const r = await fetchLatestRelease();
    expect(r).not.toBe(FALLBACK);
    expect(r.tag).toBe("v0.9.6");
    expect(r.msi!.name).toBe("ChromaDeck_0.9.6_x64_en-US.msi");
    expect(r.setup!.name).toBe("ChromaDeck_0.9.6_x64-setup.exe"); // not the .sig
    expect(r.portable!.name).toBe("ChromaDeck_0.9.6_x64-portable.zip");
    expect(r.exe).toBeNull();
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
