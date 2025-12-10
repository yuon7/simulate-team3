import { signup } from "@/app/auth/login/action";
import styles from "./page.module.css";
import Link from "next/link";

export default function SignupPage({
  searchParams,
}: {
  searchParams: { role?: string; error?: string };
}) {
  const role = searchParams.role === "STAFF" ? "STAFF" : "CANDIDATE";
  const roleLabel = role === "STAFF" ? "企業・自治体" : "求職者";
  const error = searchParams.error;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{roleLabel}アカウント登録</h1>
        
        {error === "exists" && (
          <div className={styles.alert}>
            このメールアドレスは既に登録されています。
          </div>
        )}

        <p className={styles.description}>
          必要な情報を入力してアカウントを作成してください
        </p>

        <form className={styles.form}>
          <input type="hidden" name="role" value={role} />
          
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              メールアドレス
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={styles.input}
              placeholder="example@email.com"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className={styles.input}
              placeholder="8文字以上で入力してください"
              minLength={8}
            />
          </div>

          <button formAction={signup} className={styles.submitButton}>
            アカウントを作成
          </button>
        </form>

        <div className={styles.footer}>
          <Link href="/auth/select-role" className={styles.backLink}>
            ← 選択画面に戻る
          </Link>
          <div className={styles.loginLink}>
            すでにアカウントをお持ちの方は
            <Link href="/auth/login">ログイン</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
