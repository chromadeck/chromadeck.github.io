export interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

export interface Release {
  tag: string;
  msi: ReleaseAsset | null;
  setup: ReleaseAsset | null;
  portable: ReleaseAsset | null;
}

const FALLBACK: Release = {
  tag: "v0.8.0",
  msi: {
    name: "ChromaDeck_0.8.0_x64_en-US.msi",
    browser_download_url:
      "https://github.com/miiidev/ChromaDeck/releases/download/v0.8.0/ChromaDeck_0.8.0_x64_en-US.msi",
    size: 3039232,
  },
  setup: {
    name: "ChromaDeck_0.8.0_x64-setup.exe",
    browser_download_url:
      "https://github.com/miiidev/ChromaDeck/releases/download/v0.8.0/ChromaDeck_0.8.0_x64-setup.exe",
    size: 2291428,
  },
  portable: {
    name: "ChromaDeck_0.8.0_x64-portable.zip",
    browser_download_url:
      "https://github.com/miiidev/ChromaDeck/releases/download/v0.8.0/ChromaDeck_0.8.0_x64-portable.zip",
    size: 2717364,
  },
};

interface GitHubAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

function findAsset(
  assets: GitHubAsset[],
  pattern: RegExp,
): ReleaseAsset | null {
  const a = assets.find((a) => pattern.test(a.name));
  return a ? { name: a.name, browser_download_url: a.browser_download_url, size: a.size } : null;
}

export async function fetchLatestRelease(): Promise<Release> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/miiidev/ChromaDeck/releases/latest",
      { headers: { Accept: "application/vnd.github.v3+json" } },
    );
    if (!res.ok) return FALLBACK;
    const data: { tag_name: string; assets: GitHubAsset[] } = await res.json();
    return {
      tag: data.tag_name,
      msi: findAsset(data.assets, /\.msi$/i),
      setup: findAsset(data.assets, /-setup\.exe$/i),
      portable:
        findAsset(data.assets, /-portable\.zip$/i) ??
        findAsset(data.assets, /^chromadeck\.exe$/i),
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