import type { AuthResponse, LoginCredentials, SignUpCredentials, User, UserRecord } from '../types/auth';

const STORAGE_KEYS = {
  USERS: 'fittrack_users_v1',
  SESSION: 'fittrack_session_v1',
};

// Demo user accounts with distinct profile themes
export const DEMO_USERS: UserRecord[] = [
  {
    id: 'user_alex_01',
    name: 'Alex Johnson',
    email: 'alex@fittrack.com',
    passwordHash: btoa('Password123!'),
    createdAt: '2026-01-10T10:00:00.000Z',
    avatarColor: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'user_sarah_02',
    name: 'Sarah Miller',
    email: 'sarah@fittrack.com',
    passwordHash: btoa('Password123!'),
    createdAt: '2026-02-15T14:30:00.000Z',
    avatarColor: 'from-cyan-500 to-blue-600',
  },
];

class AuthService {
  /**
   * Returns all registered users from storage, seeding demo users if empty
   */
  public getUsers(): UserRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEMO_USERS));
        return DEMO_USERS;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : DEMO_USERS;
    } catch {
      return DEMO_USERS;
    }
  }

  private saveUsers(users: UserRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (err) {
      console.error('Failed to save users:', err);
    }
  }

  /**
   * Retrieves current authenticated user session if present
   */
  public getCurrentSession(): User | null {
    try {
      const local = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (local) {
        return JSON.parse(local);
      }
      const session = sessionStorage.getItem(STORAGE_KEYS.SESSION);
      if (session) {
        return JSON.parse(session);
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Validates credentials and logs in user
   */
  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate brief network latency for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 350));

    const email = credentials.email.trim().toLowerCase();
    const password = credentials.password;

    if (!email) {
      return { success: false, error: 'Email address is required.' };
    }
    if (!password) {
      return { success: false, error: 'Password is required.' };
    }

    const users = this.getUsers();
    const found = users.find((u) => u.email.toLowerCase() === email);

    if (!found) {
      return { success: false, error: 'No account found with this email address.' };
    }

    if (found.passwordHash !== btoa(password)) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    const user: User = {
      id: found.id,
      name: found.name,
      email: found.email,
      createdAt: found.createdAt,
      avatarColor: found.avatarColor || 'from-emerald-500 to-teal-600',
    };

    // Save session
    try {
      if (credentials.rememberMe !== false) {
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
        sessionStorage.removeItem(STORAGE_KEYS.SESSION);
      } else {
        sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
        localStorage.removeItem(STORAGE_KEYS.SESSION);
      }
    } catch (err) {
      console.error('Failed to save session:', err);
    }

    return { success: true, user };
  }

  /**
   * Registers a new user account
   */
  public async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const name = credentials.name.trim();
    const email = credentials.email.trim().toLowerCase();
    const password = credentials.password;
    const confirmPassword = credentials.confirmPassword;

    if (!name) {
      return { success: false, error: 'Full name is required.' };
    }
    if (!email) {
      return { success: false, error: 'Email address is required.' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!password) {
      return { success: false, error: 'Password is required.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }
    if (password !== confirmPassword) {
      return { success: false, error: 'Passwords do not match.' };
    }

    const users = this.getUsers();
    if (users.some((u) => u.email.toLowerCase() === email)) {
      return { success: false, error: 'An account with this email already exists. Please login.' };
    }

    const newUserRecord: UserRecord = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name,
      email,
      passwordHash: btoa(password),
      createdAt: new Date().toISOString(),
      avatarColor: 'from-emerald-500 to-cyan-500',
    };

    const updated = [...users, newUserRecord];
    this.saveUsers(updated);

    const user: User = {
      id: newUserRecord.id,
      name: newUserRecord.name,
      email: newUserRecord.email,
      createdAt: newUserRecord.createdAt,
      avatarColor: newUserRecord.avatarColor,
    };

    // Auto-login new user
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));

    return { success: true, user };
  }

  /**
   * Clears active session
   */
  public logout(): void {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    sessionStorage.removeItem(STORAGE_KEYS.SESSION);
  }
}

export const authService = new AuthService();
