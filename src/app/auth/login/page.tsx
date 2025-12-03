import { login } from "@/app/auth/login/action";
import styles from "./page.module.css";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const hasError = searchParams.error === "invalid_credentials";

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <form method="post" className={styles.form}>
          {hasError && (
            <div className={styles.errorMessage}>
              メールアドレスまたはパスワードが間違っています
            </div>
          )}

          <div>
            <label htmlFor="email" className={styles.label}>
              Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={`${styles.input} ${hasError ? styles.inputError : ""}`}
            />
          </div>

          <div>
            <label htmlFor="password" className={styles.label}>
              Password:
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className={`${styles.input} ${hasError ? styles.inputError : ""}`}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              formAction={login}
              className={`${styles.button} ${styles.loginButton}`}
            >
              Log in
            </button>
            <a
              href="/auth/select-role"
              className={`${styles.button} ${styles.signupButton}`}
            >
              Sign up
            </a>
          </div>
        </form>
      </div>
      <a href="/auth/password/form" className={styles.passwordReset}>
        パスワードを忘れた場合
      </a>
    </div>
  );
}
