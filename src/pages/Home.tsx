import { useI18n } from "../i18n";

export default function Home() {
  const { t } = useI18n();

  return (
    <section className="page">
      <h1>{t("homeTitle")}</h1>
      <p>{t("homeIntro1")}</p>
      <p>{t("homeIntro2")}</p>
      <p>{t("homeIntro3")}</p>
    </section>
  );
}
