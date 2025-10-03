import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useError } from "@/context/ErrorContext";

const Contact = () => {
  const { setError } = useError();
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setE] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError(t("contactError"));
      setError(t("globalError"));
      return;
    }
    try {
      // ...envío de datos...
    } catch (error) {
      setError(t("contactGlobalError"));
    }
    setSubmitted(true);
    // Aquí podrías enviar los datos a un backend o servicio externo
  };

  return (
    <>
      <Header />
      <main
        role="main"
        className="min-h-[70vh] flex flex-col items-center justify-center bg-background"
      >
        <div className="bg-card rounded-2xl shadow-lg p-10 max-w-lg w-full text-center">
          <h1
            role="heading"
            aria-level={1}
            className="text-4xl font-bold mb-4 text-primary"
          >
            {t("contactTitle")}
          </h1>
          <p className="text-lg mb-8 text-muted-foreground">
            {t("contactDesc")}{" "}
            <a
              href="mailto:info@tattoovision.ai"
              className="text-primary underline"
            >
              info@tattoovision.ai
            </a>
          </p>
          {submitted ? (
            <div className="text-green-600 font-semibold py-4" role="status">
              {t("contactSuccess")}
            </div>
          ) : (
            <form
              className="space-y-4 text-left"
              onSubmit={handleSubmit}
              role="form"
              aria-label={t("contactTitle")}
            >
              <div>
                <label htmlFor="name" className="block mb-1 font-medium">
                  {t("name")}
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder={t("name")}
                  value={form.name}
                  onChange={handleChange}
                  aria-invalid={!!error && !form.name}
                  aria-describedby={
                    !!error && !form.name ? "name-error" : undefined
                  }
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:border-primary"
                />
                {error && !form.name && (
                  <span id="name-error" className="text-red-500 text-sm">
                    {error}
                  </span>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 font-medium">
                  {t("email")}
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder={t("email")}
                  value={form.email}
                  onChange={handleChange}
                  aria-invalid={!!error && !form.email}
                  aria-describedby={
                    !!error && !form.email ? "email-error" : undefined
                  }
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:border-primary"
                />
                {error && !form.email && (
                  <span id="email-error" className="text-red-500 text-sm">
                    {error}
                  </span>
                )}
              </div>
              <div>
                <label htmlFor="message" className="block mb-1 font-medium">
                  {t("message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder={t("message")}
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  aria-invalid={!!error && !form.message}
                  aria-describedby={
                    !!error && !form.message ? "message-error" : undefined
                  }
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:border-primary resize-none"
                />
                {error && !form.message && (
                  <span id="message-error" className="text-red-500 text-sm">
                    {error}
                  </span>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                aria-label={t("sendMessage")}
              >
                {t("sendMessage")}
              </Button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
