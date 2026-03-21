import packageJson from "../../package.json";

const REPOSITORY_URL = "https://github.com/bitflip55/EasyPhotoPrint";
const RELEASES_URL = `${REPOSITORY_URL}/releases`;
const LATEST_RELEASE_API_URL = "https://api.github.com/repos/bitflip55/EasyPhotoPrint/releases/latest";

export interface UpdateCheckResult {
  currentVersion: string;
  latestVersion: string;
  isUpdateAvailable: boolean;
  releasePageUrl: string;
}

function parseVersionSegments(version: string): number[] {
  return version
    .trim()
    .replace(/^v/i, "")
    .split(".")
    .map((segment) => Number.parseInt(segment, 10))
    .map((segment) => (Number.isFinite(segment) ? segment : 0));
}

function compareVersions(left: string, right: string): number {
  const leftSegments = parseVersionSegments(left);
  const rightSegments = parseVersionSegments(right);
  const maxLength = Math.max(leftSegments.length, rightSegments.length);

  for (let index = 0; index < maxLength; index += 1) {
    const leftValue = leftSegments[index] ?? 0;
    const rightValue = rightSegments[index] ?? 0;

    if (leftValue > rightValue) {
      return 1;
    }

    if (leftValue < rightValue) {
      return -1;
    }
  }

  return 0;
}

export function getCurrentAppVersion(): string {
  return packageJson.version;
}

export function getReleaseDownloadsPageUrl(): string {
  return RELEASES_URL;
}

export async function checkForLatestRelease(): Promise<UpdateCheckResult> {
  const response = await fetch(LATEST_RELEASE_API_URL, {
    headers: {
      Accept: "application/vnd.github+json",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub Release API antwortete mit ${response.status}.`);
  }

  const payload = (await response.json()) as {
    html_url?: string;
    tag_name?: string;
  };

  const currentVersion = getCurrentAppVersion();
  const latestVersion = (payload.tag_name ?? currentVersion).replace(/^v/i, "");

  return {
    currentVersion,
    latestVersion,
    isUpdateAvailable: compareVersions(latestVersion, currentVersion) > 0,
    releasePageUrl: payload.html_url ?? RELEASES_URL,
  };
}
