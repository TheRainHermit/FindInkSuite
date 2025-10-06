import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    es: {
      translation: {
        galleryTitle: "Galería de Tatuajes",
        contactTitle: "Contacto",
        contactDesc: "¿Tienes dudas o quieres colaborar? Escríbenos a",
        sendMessage: "Enviar mensaje",
        name: "Nombre",
        email: "Correo electrónico",
        message: "Mensaje",
        home: "Inicio",
        gallery: "Galería",
        contact: "Contacto",
        allRightsReserved: "Todos los derechos reservados.",
        contactError: "Por favor, completa todos los campos.",
        contactSuccess: "¡Mensaje enviado correctamente!",
        heroBadge: "Tecnología de IA Avanzada",
        heroTitle1: "Visualiza tu ",
        heroTitle2: "Tatuaje Perfecto",
        heroTitle3: " antes de hacerlo",
        heroDesc:
          "Descubre cómo se verá cualquier diseño en tu piel con nuestra revolucionaria tecnología de IA. Sin riesgos, sin arrepentimientos.",
        tryNow: "Probar ahora gratis",
        seeExamples: "Ver ejemplos",
        statAccuracy: "Precisión IA",
        statVisualized: "Tatuajes visualizados",
        statRating: "Valoración usuarios",
        wizardTitle: "Visualizador de Tatuajes",
        close: "Cerrar",
        featuresTitle: "¿Por qué elegirnos?",
        featuresDesc: "La forma más inteligente de decidir tu próximo tatuaje",
        featureInstant: "IA Instantánea",
        featureInstantDesc:
          "Resultados hiperrealistas en segundos. Nuestra IA procesa y adapta el diseño a tu piel de forma natural.",
        featurePrivate: "100% Privado",
        featurePrivateDesc:
          "Tus fotos se procesan de forma segura y nunca se almacenan. Total privacidad garantizada.",
        featureNetwork: "Red de Estudios",
        featureNetworkDesc:
          "Conecta con los mejores tatuadores profesionales certificados de tu zona.",
        ctaTitle: "¿Listo para ver tu tatuaje?",
        ctaDesc: "Únete a miles de personas que tomaron la decisión correcta",
        ctaButton: "Comenzar ahora",
        notFoundTitle: "Página no encontrada",
        notFoundDesc: "Lo sentimos, la página que buscas no existe.",
        notFoundHome: "Volver al inicio",
        openImage: "Abrir imagen",
        heroSectionLabel: "Sección principal",
        heroImageAlt: "Estudio de tatuajes",
        statsLabel: "Estadísticas",
        wizardSectionLabel: "Visualizador de tatuajes",
        featuresSectionLabel: "Características",
        featuresListLabel: "Lista de características",
        ctaSectionLabel: "Llamada a la acción",
        wizardStepsLabel: "Pasos del asistente",
        wizardStep1: "Subir foto del cuerpo",
        wizardStep2: "Subir diseño de tatuaje",
        wizardStep3: "Vista previa del tatuaje",
        bodyImageAlt: "Foto de la parte del cuerpo",
        tattooDesignAlt: "Diseño de tatuaje",
        resultImageAlt: "Resultado del tatuaje aplicado",
        headerNavigation: "Navegación principal",
        mainNavigation: "Menú principal",
        footerNavigation: "Navegación del pie de página",
        selectLanguage: "Seleccionar idioma",
        globalError: "Ocurrió un error inesperado. Intenta nuevamente.",
        contactGlobalError:
          "No se pudo enviar el mensaje. Por favor, inténtalo más tarde.",
        imageTooLarge: "La imagen no debe superar los 10MB.",
        wizardSuccess: "¡Tatuaje aplicado con éxito!",
        uploadPhotoTitle: "Sube una foto de la parte del cuerpo",
        uploadPhotoDescription:
          "Elige una imagen clara y bien iluminada de la zona donde quieres el tatuaje.",
        clickToUploadPhoto: "Haz clic para subir tu foto",
        imageFormats: "Formatos permitidos: JPG, PNG. Máx. 10MB",
        footerDescription:
          "Herramienta de visualización de tatuajes con IA para decidir tu próximo diseño.",
        quickLinks: "Enlaces Rápidos",
        privacyPolicy: "Política de Privacidad",
        termsOfUse: "Términos de Uso",
        footerTagline: "Visualiza tu próximo tatuaje con IA",
        changePhoto: "Cambiar foto",
        continue: "Continuar",
        chooseDesignTitle: "Elige un diseño de tatuaje",
        chooseDesignDescription:
          "Selecciona un diseño de tatuaje de nuestra galería o sube el tuyo.",
        clickToUploadDesign: "Haz clic para subir tu diseño",
        back: "Atrás",
        changeDesign: "Cambiar diseño",
        generatePreview: "Generar vista previa",
        generating: "Generando...",
        tattooPromptLabel: "Describe el diseño del tatuaje",
        tattooPromptPlaceholder:
          "Ejemplo: Tatuaje de dragón tribal negro en el antebrazo, estilo realista, tamaño mediano, siguiendo los contornos del músculo.",
        tattooPromptExamples: "Ejemplos:",
        tattooPromptExample1: "Rosa roja realista en el hombro",
        tattooPromptExample2:
          "Dragón tribal negro en el antebrazo, estilo sombreado",
        tattooPromptExample3: "Tatuaje minimalista de montaña en la muñeca",
        tattooPromptWarning:
          "Por favor, describe el tatuaje con más detalle para mejores resultados.",
        privacyPolicyTitle: "Política de Privacidad",
        privacyPolicyIntro:
          "Tu privacidad es importante para nosotros. Esta política explica cómo recopilamos, usamos y protegemos tu información.",
        privacyPolicySection1Title: "Información que recopilamos",
        privacyPolicySection1Content:
          "Recopilamos información que nos proporcionas al usar la plataforma, como tu correo electrónico, imágenes subidas y preferencias de idioma.",
        privacyPolicySection2Title: "Uso de la información",
        privacyPolicySection2Content:
          "Utilizamos tu información para mejorar la experiencia, personalizar resultados y garantizar la seguridad de la plataforma.",
        privacyPolicySection3Title: "Protección de datos",
        privacyPolicySection3Content:
          "Implementamos medidas de seguridad para proteger tus datos y nunca compartimos tu información con terceros sin tu consentimiento.",
        privacyPolicySection4Title: "Tus derechos",
        privacyPolicySection4Content:
          "Puedes solicitar la eliminación o modificación de tus datos en cualquier momento contactándonos a info@findink.co.",
        privacyPolicySection5Title: "Cambios en la política",
        privacyPolicySection5Content:
          "Nos reservamos el derecho de modificar esta política. Te notificaremos sobre cambios importantes.",
        termsOfUseTitle: "Términos de Uso",
        termsOfUseIntro:
          "Al usar Tattoo Vision AI, aceptas los siguientes términos y condiciones.",
        termsOfUseSection1Title: "Uso de la plataforma",
        termsOfUseSection1Content:
          "La plataforma está destinada únicamente para fines personales y no comerciales. No está permitido el uso indebido o la distribución de contenido generado.",
        termsOfUseSection2Title: "Propiedad intelectual",
        termsOfUseSection2Content:
          "Todos los derechos sobre el software, diseño y contenido pertenecen a Tattoo Vision AI y FindInk.",
        termsOfUseSection3Title: "Limitación de responsabilidad",
        termsOfUseSection3Content:
          "No garantizamos la precisión de los resultados generados por IA. El uso de la plataforma es bajo tu propio riesgo.",
        termsOfUseSection4Title: "Modificaciones",
        termsOfUseSection4Content:
          "Podemos modificar estos términos en cualquier momento. El uso continuado implica aceptación de los cambios.",
        termsOfUseSection5Title: "Contacto",
        termsOfUseSection5Content:
          "Para dudas o reclamaciones, contáctanos en info@findink.co.",
          apiTest: "Prueba de API",
        // ...otros textos
      },
    },
    en: {
      translation: {
        galleryTitle: "Tattoo Gallery",
        contactTitle: "Contact",
        contactDesc: "Questions or want to collaborate? Write to",
        sendMessage: "Send message",
        name: "Name",
        email: "Email",
        message: "Message",
        home: "Home",
        gallery: "Gallery",
        contact: "Contact",
        allRightsReserved: "All rights reserved.",
        contactError: "Please fill in all fields.",
        contactSuccess: "Message sent successfully!",
        heroBadge: "Advanced AI Technology",
        heroTitle1: "Visualize Your ",
        heroTitle2: "Perfect Tattoo",
        heroTitle3: " Before Getting Inked",
        heroDesc:
          "Discover how any design will look on your skin with our revolutionary AI technology. No risks, no regrets.",
        tryNow: "Try Now for Free",
        seeExamples: "See Examples",
        statAccuracy: "AI Accuracy",
        statVisualized: "Tattoos Visualized",
        statRating: "User Rating",
        wizardTitle: "Tattoo Visualizer",
        close: "Close",
        featuresTitle: "Why Choose Us?",
        featuresDesc: "The smartest way to decide your next tattoo",
        featureInstant: "Instant AI",
        featureInstantDesc:
          "Hyper-realistic results in seconds. Our AI processes and adapts the design to your skin naturally.",
        featurePrivate: "100% Private",
        featurePrivateDesc:
          "Your photos are processed securely and never stored. Total privacy guaranteed.",
        featureNetwork: "Studio Network",
        featureNetworkDesc:
          "Connect with the best certified professional tattoo artists in your area.",
        ctaTitle: "Ready to see your tattoo?",
        ctaDesc: "Join thousands who made the right decision",
        ctaButton: "Start Now",
        notFoundTitle: "Page Not Found",
        notFoundDesc: "Sorry, the page you are looking for does not exist.",
        notFoundHome: "Back to Home",
        openImage: "Open image",
        heroSectionLabel: "Hero Section",
        heroImageAlt: "Tattoo studio",
        statsLabel: "Statistics",
        wizardSectionLabel: "Wizard Section",
        featuresSectionLabel: "Features Section",
        featuresListLabel: "Features List",
        ctaSectionLabel: "Call to Action Section",
        wizardStepsLabel: "Wizard Steps",
        wizardStep1: "Upload Body Photo",
        wizardStep2: "Upload Tattoo Design",
        wizardStep3: "Preview Tattoo",
        bodyImageAlt: "Body part photo",
        tattooDesignAlt: "Tattoo design",
        resultImageAlt: "Applied tattoo result",
        headerNavigation: "Main Navigation",
        mainNavigation: "Main Menu",
        footerNavigation: "Footer Navigation",
        selectLanguage: "Select Language",
        globalError: "An unexpected error occurred. Please try again.",
        contactGlobalError:
          "Could not send the message. Please try again later.",
        imageTooLarge: "The image must not exceed 10MB.",
        wizardSuccess: "Tattoo applied successfully!",
        uploadPhotoTitle: "Upload a photo of the body part",
        uploadPhotoDescription:
          "Choose a clear, well-lit image of the area where you want the tattoo.",
        clickToUploadPhoto: "Click to upload your photo",
        imageFormats: "Allowed formats: JPG, PNG. Max 10MB",
        footerDescription:
          "AI-powered tattoo visualization tool to decide your next design.",
        quickLinks: "Quick Links",
        privacyPolicy: "Privacy Policy",
        termsOfUse: "Terms of Use",
        footerTagline: "Visualize your next tattoo with AI",
        changePhoto: "Change Photo",
        continue: "Continue",
        chooseDesignTitle: "Choose a tattoo design",
        chooseDesignDescription:
          "Select a tattoo design from our gallery or upload your own.",
        clickToUploadDesign: "Click to upload your design",
        back: "Back",
        changeDesign: "Change Design",
        generatePreview: "Generate Preview",
        generating: "Generating...",
        tattooPromptLabel: "Describe the tattoo design",
        tattooPromptPlaceholder:
          "Example: Black tribal dragon tattoo on forearm, realistic style, medium size, following muscle contours.",
        tattooPromptExamples: "Examples:",
        tattooPromptExample1: "Realistic red rose on shoulder",
        tattooPromptExample2: "Black tribal dragon on forearm, shading style",
        tattooPromptExample3: "Minimalist mountain tattoo on wrist",
        tattooPromptWarning:
          "Please describe the tattoo in more detail for better results.",
        privacyPolicyTitle: "Privacy Policy",
        privacyPolicyIntro:
          "Your privacy is important to us. This policy explains how we collect, use, and protect your information.",
        privacyPolicySection1Title: "Information We Collect",
        privacyPolicySection1Content:
          "We collect information you provide when using the platform, such as your email, uploaded images, and language preferences.",
        privacyPolicySection2Title: "Use of Information",
        privacyPolicySection2Content:
          "We use your information to improve the experience, personalize results, and ensure platform security.",
        privacyPolicySection3Title: "Data Protection",
        privacyPolicySection3Content:
          "We implement security measures to protect your data and never share your information with third parties without your consent.",
        privacyPolicySection4Title: "Your Rights",
        privacyPolicySection4Content:
          "You may request deletion or modification of your data at any time by contacting info@findink.co.",
        privacyPolicySection5Title: "Policy Changes",
        privacyPolicySection5Content:
          "We reserve the right to modify this policy. We will notify you of significant changes.",
        termsOfUseTitle: "Terms of Use",
        termsOfUseIntro:
          "By using Tattoo Vision AI, you agree to the following terms and conditions.",
        termsOfUseSection1Title: "Platform Use",
        termsOfUseSection1Content:
          "The platform is intended for personal, non-commercial use only. Misuse or distribution of generated content is not allowed.",
        termsOfUseSection2Title: "Intellectual Property",
        termsOfUseSection2Content:
          "All rights to the software, design, and content belong to Tattoo Vision AI and FindInk.",
        termsOfUseSection3Title: "Limitation of Liability",
        termsOfUseSection3Content:
          "We do not guarantee the accuracy of AI-generated results. Use of the platform is at your own risk.",
        termsOfUseSection4Title: "Modifications",
        termsOfUseSection4Content:
          "We may modify these terms at any time. Continued use implies acceptance of changes.",
        termsOfUseSection5Title: "Contact",
        termsOfUseSection5Content:
          "For questions or claims, contact us at info@findink.co.",
          apiTest: "API Test",
        // ...other texts
      },
    },
  },
  lng: "es",
  fallbackLng: "es",
  interpolation: { escapeValue: false },
});

export default i18n;
