// Sign-in failures of the internal area (/admin). Supabase reports every failure through the same `error`,
// so this tells them apart: only invalid credentials say "E-mail ou senha incorretos.".

export const ERROR_INVALID_CREDENTIALS = "ERROR_INVALID_CREDENTIALS";
export const ERROR_DATABASE_UNREACHABLE = "ERROR_DATABASE_UNREACHABLE";
export const ERROR_SIGN_IN_FAILED = "ERROR_SIGN_IN_FAILED";

export const SIGN_IN_ERROR_MESSAGES = {
  [ERROR_INVALID_CREDENTIALS]: "E-mail ou senha incorretos.",
  [ERROR_DATABASE_UNREACHABLE]: "Não foi possível conectar ao banco de dados agora. Tente de novo em alguns minutos.",
  [ERROR_SIGN_IN_FAILED]: "Não foi possível entrar agora. Tente de novo em alguns minutos.",
};

// Error names used by @supabase/auth-js 2.x: no answer at all (network down, DNS, CORS) or a 5xx gateway error
// (AuthRetryableFetchError), or an answer that is not the auth service's JSON, such as a proxy page (AuthUnknownError).
const UNREACHABLE_ERROR_NAMES = ["AuthRetryableFetchError", "AuthUnknownError"];
// fetch() failing on its own: Chrome "Failed to fetch", Firefox "NetworkError when attempting...", Safari "Load failed".
const FETCH_FAILURE_MESSAGE = /failed to fetch|networkerror|load failed/i;

export function classifySignInError(error) {
  const message = String(error?.message || "");
  if (error?.code === "invalid_credentials" || /invalid login credentials/i.test(message)) return ERROR_INVALID_CREDENTIALS;
  if (UNREACHABLE_ERROR_NAMES.includes(error?.name)) return ERROR_DATABASE_UNREACHABLE;
  // 5xx, including Supabase's own 54x codes (540 = project paused, 544 = gateway timeout).
  if (Number(error?.status) >= 500) return ERROR_DATABASE_UNREACHABLE;
  if (FETCH_FAILURE_MESSAGE.test(message)) return ERROR_DATABASE_UNREACHABLE;
  return ERROR_SIGN_IN_FAILED;
}

export const signInErrorMessage = (error) => SIGN_IN_ERROR_MESSAGES[classifySignInError(error)];
