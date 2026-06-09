const PAT_KEY = 'ml-plan-tracker-github-pat';
const GIST_KEY = 'ml-plan-tracker-gist-id';
const LAST_SYNC_KEY = 'ml-plan-tracker-last-sync';

export function getGithubPat(): string {
  return localStorage.getItem(PAT_KEY) ?? '';
}

export function setGithubPat(pat: string) {
  localStorage.setItem(PAT_KEY, pat.trim());
}

export function getGistId(): string {
  return localStorage.getItem(GIST_KEY) ?? '';
}

export function setGistId(gistId: string) {
  localStorage.setItem(GIST_KEY, gistId.trim());
}

export function getLastSyncTime(): string | null {
  return localStorage.getItem(LAST_SYNC_KEY);
}

export function setLastSyncTime(iso: string) {
  localStorage.setItem(LAST_SYNC_KEY, iso);
}

export function isCloudSyncEnabled(): boolean {
  return Boolean(getGithubPat() && getGistId());
}

export function clearCloudSync() {
  localStorage.removeItem(PAT_KEY);
  localStorage.removeItem(GIST_KEY);
  localStorage.removeItem(LAST_SYNC_KEY);
}

export const PHONE_APP_URL = 'https://abhishumatt.github.io/ml-plan-tracker/';
