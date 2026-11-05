export interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

export interface Release {
  tag: string;
  url: string;
  msi: ReleaseAsset | null;
  setup: ReleaseAsset | null;
  portable: ReleaseAsset | null;
  exe: ReleaseAsset | null;
}

export const REPO_URL = "https://github.com/miiidev/ChromaDeck";
export const RELEASES_URL = `${REPO_URL}/releases/latest`;

const dl = (tag: string, name: string, size: number): ReleaseAsset => ({
  name,
  browser_download_url: `${REPO_URL}/releases/download/${tag}/${name}`,
  size,
});

/**
 * Verified fallback used when the GitHub API is unreachable or rate-limited
 * (unauthenticated API allows 60 requests/hour per IP, which a shared or CGNAT
 * address can exhaust). Updated by hand whenever a release ships.
 */
export const FALLBACK: Release = {
  tag: "v0.8.2",
  url: `${REPO_URL}/releases/tag/v0.8.2`,
  msi: dl("v0.8.2", "ChromaDeck_0.8.2_x64_en-US.msi", 3031040),
  setup: dl("v0.8.2", "ChromaDeck_0.8.2_x64-setup.exe", 2217601),
  portable: dl("v0.8.2", "ChromaDeck_0.8.2_x64-portable.zip", 2659112),
  exe: dl("v0.8.2", "chromadeck.exe", 5663232),
};

interface GitHubAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

function findAsset(assets: GitHubAsset[], pattern: RegExp): ReleaseAsset | null {
  const a = assets.find((x) => pattern.test(x.name));
  return a ? { name: a.name, browser_download_url: a.browser_download_url, size: a.size } : null;
}

export async function fetchLatestRelease(): Promise<Release> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/miiidev/ChromaDeck/releases/latest",
      // Never serve a browser-cached copy of the release index: the whole point
      // is that every page load sees the newest release.
      { cache: "no-store", headers: { Accept: "application/vnd.github+json" } },
    );
    if (!res.ok) return FALLBACK;
    const data: { tag_name: string; html_url: string; assets: GitHubAsset[] } = await res.json();
    if (!data?.tag_name || !Array.isArray(data.assets)) return FALLBACK;

    const release = {
      tag: data.tag_name,
      url: data.html_url ?? RELEASES_URL,
      msi: findAsset(data.assets, /\.msi$/i),
      setup: findAsset(data.assets, /-setup\.exe$/i),
      portable: findAsset(data.assets, /-portable\.zip$/i),
      exe: findAsset(data.assets, /^chromadeck\.exe$/i),
    };

    // A release missing its expected installers would render `null` download
    // buttons (Download.tsx dereferences these non-null). Refuse such data.
    if (!release.msi || !release.setup || !release.portable || !release.exe) return FALLBACK;

    return release;
  } catch {
    return FALLBACK;
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}
