import { AuthUser, UserState } from '../types';

const TOKEN_KEY = 'maxxcode_auth_token_v1';
const USER_KEY = 'maxxcode_auth_user_v1';

const safeJson = async (res: Response) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return {
      success: false,
      error: `Server returned an invalid response (Status ${res.status}). If on Vercel, please make sure the latest serverless api files and environment variables are deployed.`,
    };
  }
};

export const authService = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getSavedUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  saveUser(user: AuthUser) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  async register(name: string, email: string, password: string, guestProgress?: UserState): Promise<{ success: boolean; user?: AuthUser; token?: string; error?: string; database?: string }> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          guestProgress,
        }),
      });

      const data = await safeJson(res);
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to register' };
      }

      this.setToken(data.token);
      this.saveUser(data.user);
      return { success: true, user: data.user, token: data.token, database: data.database };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error connecting to auth server' };
    }
  },

  async login(email: string, password: string): Promise<{ success: boolean; user?: AuthUser; token?: string; error?: string; database?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await safeJson(res);
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Invalid credentials' };
      }

      this.setToken(data.token);
      this.saveUser(data.user);
      return { success: true, user: data.user, token: data.token, database: data.database };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error connecting to auth server' };
    }
  },

  async getMe(): Promise<{ success: boolean; user?: AuthUser; error?: string; isAtlas?: boolean }> {
    const token = this.getToken();
    if (!token) return { success: false, error: 'No token' };

    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await safeJson(res);
      if (!res.ok || !data.success) {
        this.clearSession();
        return { success: false, error: data.error || 'Session expired' };
      }

      this.saveUser(data.user);
      return { success: true, user: data.user, isAtlas: data.isAtlas };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async syncProgress(progress: Partial<UserState>): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    const token = this.getToken();
    if (!token) return { success: false, error: 'Not logged in' };

    try {
      const res = await fetch('/api/auth/sync', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(progress),
      });

      const data = await safeJson(res);
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Sync failed' };
      }

      this.saveUser(data.user);
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async getStatus(): Promise<{ success: boolean; isAtlasConnected: boolean; engine: string }> {
    try {
      const res = await fetch('/api/auth/status');
      const data = await safeJson(res);
      return data;
    } catch {
      return { success: false, isAtlasConnected: false, engine: 'Offline' };
    }
  },
};
