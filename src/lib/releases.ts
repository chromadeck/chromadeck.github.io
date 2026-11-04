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

/** Latest stable release verified against the GitHub API (2026-10-14). */
export const FALLBACK: Release = {
  tag: "v0.8.1",
  url: `${REPO_URL}/releases/tag/v0.8.1`,
  msi: dl("v0.8.1", "ChromaDeck_0.8.1_x64_en-US.msi", 3043328),
  setup: dl("v0.8.1", "ChromaDeck_0.8.1_x64-setup.exe", 2293215),
  portable: dl("v0.8.1", "ChromaDeck_0.8.1_x64-portable.zip", 2720803),
  exe: dl("v0.8.1", "chromadeck.exe", 5684736),
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
      { headers: { Accept: "application/vnd.github+json" } },
    );
    if (!res.ok) return FALLBACK;
    const data: { tag_name: string; html_url: string; assets: GitHubAsset[] } = await res.json();
    if (!data?.tag_name || !Array.isArray(data.assets)) return FALLBACK;
    return {
      tag: data.tag_name,
      url: data.html_url ?? RELEASES_URL,
      msi: findAsset(data.assets, /\.msi$/i),
      setup: findAsset(data.assets, /-setup\.exe$/i),
      portable: findAsset(data.assets, /-portable\.zip$/i),
      exe: findAsset(data.assets, /^chromadeck\.exe$/i),
    };
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
