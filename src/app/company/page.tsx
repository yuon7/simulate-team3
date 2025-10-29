import { CompanyCard } from '@/components/CompanyCard/CompanyCard';
import styles from './company.module.css';

export default function CompanyProfilePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>企業紹介</h1>

      <CompanyCard
        name="TechVision株式会社"
        industry="IT・ソフトウェア開発"
        location="東京都渋谷区"
        established="2015年"
        employees="120名"
        email="info@techvision.co.jp"
        phone="03-1234-5678"
        description="TechVisionは「テクノロジーで社会をより良くする」をミッションに、Webアプリケーション開発やAIソリューションの提供を行うスタートアップです。"
        services={['Web開発', 'AI開発', 'クラウドソリューション']}
        hiring={true}
      />
    </div>
  );
}
