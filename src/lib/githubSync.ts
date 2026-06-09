import { createBackupPayload, parseBackupPayload } from '../hooks/usePlanStore';
import type { AppState } from '../types';

const GIST_FILENAME = 'ml-plan-tracker-state.json';

interface BackupPayload {
  exportedAt: string;
  data: AppState;
}

function headers(pat: string) {
  return {
    Authorization: `Bearer ${pat}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

async function parseGithubError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body.message ?? `GitHub API error (${res.status})`;
  } catch {
    return `GitHub API error (${res.status})`;
  }
}

export async function createSyncGist(pat: string, state: AppState): Promise<string> {
  const res = await fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: { ...headers(pat), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      description: 'ML Plan Tracker — private phone/Mac sync',
      public: false,
      files: {
        [GIST_FILENAME]: {
          content: JSON.stringify(createBackupPayload(state), null, 2),
        },
      },
    }),
  });

  if (!res.ok) throw new Error(await parseGithubError(res));
  const data = await res.json();
  return data.id as string;
}

export async function pullFromGist(pat: string, gistId: string): Promise<BackupPayload> {
  const res = await fetch(`https://api.github.com/gists/${gistId}`, { headers: headers(pat) });
  if (!res.ok) throw new Error(await parseGithubError(res));

  const data = await res.json();
  const content = data.files?.[GIST_FILENAME]?.content as string | undefined;
  if (!content) throw new Error('Sync file not found in gist');

  const parsed = JSON.parse(content);
  return {
    exportedAt: parsed.exportedAt ?? new Date(0).toISOString(),
    data: parseBackupPayload(content),
  };
}

export async function pushToGist(pat: string, gistId: string, state: AppState): Promise<string> {
  const payload = createBackupPayload(state);
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: 'PATCH',
    headers: { ...headers(pat), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      files: {
        [GIST_FILENAME]: {
          content: JSON.stringify(payload, null, 2),
        },
      },
    }),
  });

  if (!res.ok) throw new Error(await parseGithubError(res));
  return payload.exportedAt;
}
