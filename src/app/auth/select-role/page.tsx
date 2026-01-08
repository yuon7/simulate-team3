import Link from "next/link";
import styles from "./page.module.css";

export default function SelectRolePage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>アカウントの種類を選択</h1>
        <p className={styles.description}>
          どちらの目的でご利用ですか？
        </p>
        
        <div className={styles.options}>
          <Link href="/auth/signup?role=CANDIDATE" className={styles.optionCard}>
            <div className={styles.iconWrapper}>
              {/* Icon placeholder */}
              👤
            </div>
            <h3 className={styles.optionTitle}>求職者・移住希望の方</h3>
            <p className={styles.optionText}>
              理想の仕事や暮らしを見つけたい方はこちら
            </p>
          </Link>

          <Link href="/auth/signup?role=STAFF" className={styles.optionCard}>
            <div className={styles.iconWrapper}>
              {/* Icon placeholder */}
              🏢
            </div>
            <h3 className={styles.optionTitle}>企業・自治体の方</h3>
            <p className={styles.optionText}>
              人材をお探しの方はこちら
            </p>
          </Link>
        </div>

        <div className={styles.loginLink}>
          すでにアカウントをお持ちの方は
          <Link href="/auth/login">ログイン</Link>
        </div>
      </div>
    </div>
  );
}
