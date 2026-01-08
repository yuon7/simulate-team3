import { createCandidateProfile } from "./action";
import styles from "./page.module.css";

export default function CandidateOnboardingPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>求職者プロフィール登録</h1>
        <p className={styles.description}>
          あなたにぴったりの仕事や移住先を見つけるために、プロフィールを入力してください。
        </p>
        
        <form action={createCandidateProfile} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>
              お名前 <span className={styles.required}>*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className={styles.input}
              placeholder="山田 太郎"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="gender" className={styles.label}>
                性別 <span className={styles.required}>*</span>
              </label>
              <select
                id="gender"
                name="gender"
                required
                className={styles.select}
              >
                <option value="">選択してください</option>
                <option value="男性">男性</option>
                <option value="女性">女性</option>
                <option value="その他">その他</option>
                <option value="回答しない">回答しない</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="age" className={styles.label}>
                年齢 <span className={styles.required}>*</span>
              </label>
              <input
                id="age"
                name="age"
                type="number"
                required
                min="15"
                max="100"
                className={styles.input}
                placeholder="25"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="bio" className={styles.label}>
              自己紹介
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              className={styles.textarea}
              placeholder="これまでの経歴や、移住・転職にかける思いなどを自由にご記入ください。"
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            登録してはじめる
          </button>
        </form>
      </div>
    </div>
  );
}
