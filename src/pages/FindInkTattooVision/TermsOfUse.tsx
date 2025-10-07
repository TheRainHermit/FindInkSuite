import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

const TermsOfUse = () => {
  const { t } = useTranslation();

  return (
    <main className="text-foreground min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-12 px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">{t("termsOfUseTitle")}</h1>
        <p className="mb-4">{t("termsOfUseIntro")}</p>
        <section>
          <h2 className="text-xl font-semibold mt-8 mb-2">
            {t("termsOfUseSection1Title")}
          </h2>
          <p>{t("termsOfUseSection1Content")}</p>
          <h2 className="text-xl font-semibold mt-8 mb-2">
            {t("termsOfUseSection2Title")}
          </h2>
          <p>{t("termsOfUseSection2Content")}</p>
          <h2 className="text-xl font-semibold mt-8 mb-2">
            {t("termsOfUseSection3Title")}
          </h2>
          <p>{t("termsOfUseSection3Content")}</p>
          <h2 className="text-xl font-semibold mt-8 mb-2">
            {t("termsOfUseSection4Title")}
          </h2>
          <p>{t("termsOfUseSection4Content")}</p>
          <h2 className="text-xl font-semibold mt-8 mb-2">
            {t("termsOfUseSection5Title")}
          </h2>
          <p>{t("termsOfUseSection5Content")}</p>
        </section>
      </div>
      <Footer />
    </main>
  );
};

export default TermsOfUse;
