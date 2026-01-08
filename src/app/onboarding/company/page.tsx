"use client";

import { createCompanyProfile } from "./action";
import styles from "./page.module.css";
import { useFormState } from "react-dom";

// Note: In a real app, fetch prefectures from DB. Hardcoding a few for demo.
const PREFECTURES = [
  { id: 1, name: "北海道" },
  { id: 13, name: "東京都" },
  { id: 27, name: "大阪府" },
  { id: 40, name: "福岡県" },
  // ... others
];

const initialState = {
  error: "",
};

export default function CompanyOnboardingPage() {
  const [state, formAction] = useFormState(createCompanyProfile, initialState);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>企業・自治体情報登録</h1>
        <p className={styles.description}>
          求人を掲載するために、組織情報と担当者情報を登録してください。
        </p>
        
        {state?.error && (
          <div style={{ color: "red", padding: "10px", backgroundColor: "#ffebee", borderRadius: "4px", marginBottom: "20px" }}>
            {state.error}
          </div>
        )}

        <form action={formAction} className={styles.form}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>組織情報</h2>
            
            <div className={styles.inputGroup}>
              <label htmlFor="orgName" className={styles.label}>
                組織名 (企業名・自治体名) <span className={styles.required}>*</span>
              </label>
              <input
                id="orgName"
                name="orgName"
                type="text"
                required
                className={styles.input}
                placeholder="株式会社〇〇 / 〇〇市役所"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="orgType" className={styles.label}>
                組織種別 <span className={styles.required}>*</span>
              </label>
              <select
                id="orgType"
                name="orgType"
                required
                className={styles.select}
              >
                <option value="">選択してください</option>
                <option value="COMPANY">一般企業</option>
                <option value="GOVERNMENT">自治体</option>
              </select>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label htmlFor="prefectureId" className={styles.label}>
                  都道府県 <span className={styles.required}>*</span>
                </label>
                <select
                  id="prefectureId"
                  name="prefectureId"
                  required
                  className={styles.select}
                >
                  <option value="">選択してください</option>
                  {PREFECTURES.map((pref) => (
                    <option key={pref.id} value={pref.id}>
                      {pref.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="city" className={styles.label}>
                  市区町村 <span className={styles.required}>*</span>
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  className={styles.input}
                  placeholder="〇〇市"
                />
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>担当者情報</h2>
            
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label htmlFor="department" className={styles.label}>
                  部署名
                </label>
                <input
                  id="department"
                  name="department"
                  type="text"
                  className={styles.input}
                  placeholder="人事部"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="title" className={styles.label}>
                  役職
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className={styles.input}
                  placeholder="採用担当"
                />
              </div>
            </div>
          </section>

          <button type="submit" className={styles.submitButton}>
            登録してはじめる
          </button>
        </form>
      </div>
    </div>
  );
}
