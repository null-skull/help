// Auth client for the /login flow.
//
// There is no backend yet, so every function below is a MOCK that simulates a
// network round-trip (with a short delay) and the responses a real API would
// give. The rest of the flow only talks to these functions, so connecting a
// real backend later means replacing each body with a `fetch` to its endpoint
// — the screens don't change.
//
// Mock rules, so every state can be tried out:
//   • Registered emails: anything ending in "@helpperr.com", plus the ones in
//     REGISTERED_EMAILS → "Check your inbox" (existing user).
//     Any other valid email → "Choose your username" (new user).
//   • Taken usernames: the ones in TAKEN_USERNAMES.
//   • Errors: an email or username containing "error" fails like a network
//     error, so the error states can be seen.

export type EmailCheck = { registered: boolean };
export type UsernameCheck = { available: boolean };

/** Thrown when a request fails; `message` is safe to show to the user. */
export class AuthError extends Error {}

const REGISTERED_EMAILS = new Set(["demo@company.com", "jane@company.com"]);
const TAKEN_USERNAMES = new Set(["admin", "helpperr", "support", "demo", "jane", "root", "team"]);

const NETWORK_ERROR = "Something went wrong on our side. Please try again.";

function simulate<T>(result: () => T, ms = 750): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(result());
      } catch (error) {
        reject(error);
      }
    }, ms);
  });
}

/** POST /auth/email — does an account exist for this email? */
export function checkEmail(email: string): Promise<EmailCheck> {
  return simulate(() => {
    const normalized = email.trim().toLowerCase();
    if (normalized.includes("error")) throw new AuthError(NETWORK_ERROR);
    return {
      registered: normalized.endsWith("@helpperr.com") || REGISTERED_EMAILS.has(normalized),
    };
  });
}

/** GET /auth/username?u= — is this username free? */
export function checkUsername(username: string): Promise<UsernameCheck> {
  return simulate(() => {
    const normalized = username.trim().toLowerCase();
    if (normalized.includes("error")) throw new AuthError("Couldn't check this username. Please try again.");
    return { available: !TAKEN_USERNAMES.has(normalized) };
  }, 500);
}

/** POST /auth/signup — create the account and email a magic link. */
export function signUp(email: string, username: string): Promise<void> {
  return simulate(() => {
    if (TAKEN_USERNAMES.has(username.trim().toLowerCase())) {
      // A real backend re-checks on submit, since someone may have claimed the
      // name between the availability check and now.
      throw new AuthError("That username was just taken. Please choose another.");
    }
  });
}

/** POST /auth/magic-link — (re)send a sign-in link to an existing account. */
export function sendMagicLink(email: string): Promise<void> {
  return simulate(() => {
    if (email.toLowerCase().includes("error")) throw new AuthError(NETWORK_ERROR);
  });
}

/** Starts the Google OAuth redirect. Not connected yet. */
export function continueWithGoogle(): Promise<void> {
  return simulate(() => {
    throw new AuthError("Google sign-in isn't connected yet — please continue with email for now.");
  }, 600);
}
