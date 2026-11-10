// Sign-in errors of /admin: only invalid credentials may say "E-mail ou senha incorretos.".
// The errors are the real classes of @supabase/auth-js (installed with @supabase/supabase-js), built by hand:
// no network and no database.
import { describe, expect, it } from "vitest";
import { AuthApiError, AuthRetryableFetchError, AuthUnknownError } from "@supabase/auth-js";
import {
  ERROR_DATABASE_UNREACHABLE,
  ERROR_INVALID_CREDENTIALS,
  ERROR_SIGN_IN_FAILED,
  SIGN_IN_ERROR_MESSAGES,
  classifySignInError,
  signInErrorMessage,
} from "../../src/admin/signInErrors.js";

describe("classifySignInError", () => {
  it("recognizes a wrong e-mail or password, with or without the error code", () => {
    expect(classifySignInError(new AuthApiError("Invalid login credentials", 400, "invalid_credentials"))).toBe(
      ERROR_INVALID_CREDENTIALS
    );
    expect(classifySignInError({ message: "Invalid login credentials" })).toBe(ERROR_INVALID_CREDENTIALS);
  });

  it("treats no answer from the server as a connection problem", () => {
    expect(classifySignInError(new AuthRetryableFetchError("Failed to fetch", 0))).toBe(ERROR_DATABASE_UNREACHABLE);
    expect(classifySignInError(new AuthRetryableFetchError("Service Unavailable", 503))).toBe(ERROR_DATABASE_UNREACHABLE);
  });

  it("treats a paused project (HTTP 540) as a connection problem, whether the answer is JSON or not", () => {
    expect(classifySignInError(new AuthApiError("Project paused", 540, undefined))).toBe(ERROR_DATABASE_UNREACHABLE);
    expect(classifySignInError(new AuthUnknownError("Unexpected token '<'", new SyntaxError("bad json")))).toBe(
      ERROR_DATABASE_UNREACHABLE
    );
  });

  it("treats fetch failing on its own (Chrome, Firefox, Safari wording) as a connection problem", () => {
    expect(classifySignInError(new TypeError("Failed to fetch"))).toBe(ERROR_DATABASE_UNREACHABLE);
    expect(classifySignInError(new TypeError("NetworkError when attempting to fetch resource."))).toBe(ERROR_DATABASE_UNREACHABLE);
    expect(classifySignInError(new TypeError("Load failed"))).toBe(ERROR_DATABASE_UNREACHABLE);
  });

  it("does not blame the password or the connection for other refusals", () => {
    expect(classifySignInError(new AuthApiError("Email not confirmed", 400, "email_not_confirmed"))).toBe(ERROR_SIGN_IN_FAILED);
    expect(classifySignInError(new AuthApiError("Request rate limit reached", 429, "over_request_rate_limit"))).toBe(
      ERROR_SIGN_IN_FAILED
    );
    expect(classifySignInError(new TypeError("Cannot read properties of undefined (reading 'email')"))).toBe(ERROR_SIGN_IN_FAILED);
    expect(classifySignInError(undefined)).toBe(ERROR_SIGN_IN_FAILED);
  });
});

describe("signInErrorMessage", () => {
  it("gives the Portuguese message shown on the sign-in screen", () => {
    expect(signInErrorMessage({ code: "invalid_credentials" })).toBe("E-mail ou senha incorretos.");
    expect(signInErrorMessage(new AuthRetryableFetchError("Failed to fetch", 0))).toBe(
      "Não foi possível conectar ao banco de dados agora. Tente de novo em alguns minutos."
    );
    expect(signInErrorMessage(null)).toBe(SIGN_IN_ERROR_MESSAGES[ERROR_SIGN_IN_FAILED]);
  });
});
