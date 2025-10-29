import { CompanyCard } from '@/components/CompanyCard/CompanyCard';
import styles from './company.module.css';

export default function CompanyProfilePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>企業紹介</h1>

      <CompanyCard
        name="株式会社地方テック"
        industry="IT・ソフトウェア開発"
        location="長野県松本市"
        established="2015年"
        employees="120名"
        email="info@techvision.co.jp"
        phone="03-1234-5678"
        description="地方発のスタートアップで最新技術を使った開発に携われます。"
        services={['Web開発', 'AI開発', 'クラウドソリューション']}
        hiring={true}
      />
    </div>
  );
}