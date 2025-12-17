import { Container } from "@mantine/core";
import { CompanyDetailContent } from "@/features/Company/Detail/CompanyDetailContent";
import styles from "./CompanyDetail.module.css";

export function CompanyDetail({ id }: { id: number }) {
  return (
    <Container size="lg" py="xl" className={styles.container}>
      <CompanyDetailContent id={id} />
    </Container>
  );
}
