import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <main className="text-foreground min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-12 px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">{t("privacyPolicyTitle")}</h1>
        <p className="mb-4">{t("privacyPolicyIntro")}</p>
        <section>
          <h2 className="text-xl font-semibold mt-8 mb-2">{t("privacyPolicySection1Title")}</h2>
          <p>{t("privacyPolicySection1Content")}</p>
          <h2 className="text-xl font-semibold mt-8 mb-2">{t("privacyPolicySection2Title")}</h2>
          <p>{t("privacyPolicySection2Content")}</p>
          <h2 className="text-xl font-semibold mt-8 mb-2">{t("privacyPolicySection3Title")}</h2>
          <p>{t("privacyPolicySection3Content")}</p>
        </section>
      </div>
      <Footer />
    </main>
  );
};

export default PrivacyPolicy;
