import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
//import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/datepicker";
import { Loader2, Upload, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TATTOO_STYLES = [
  "Realismo",
  "Minimalista",
  "Japonés",
  "Tradicional",
  "Tribal",
  "Blackwork",
  "Acuarela",
  "Color",
  "Microrealismo",
];
const SIZES = ["Pequeño", "Mediano", "Grande"];
const TIMES = ["Mañana", "Tarde", "Noche"];
const FREQUENCIES = ["Primera vez", "Cliente frecuente", "Fan del estudio"];

const API_URL = "http://localhost:8001/api/clients/register";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    city: "",
    birthdate: "",
    tattooedBefore: "",
    favoriteStyles: [] as string[],
    colorOrBlack: "",
    preferredArtist: "",
    size: "",
    bodyZone: "",
    referenceImage: null as File | null,
    meaning: "",
    allergies: "",
    medication: "",
    painSensitivity: "",
    desiredDate: "",
    preferredTime: "",
    budget: "",
    wantsValuation: false,
    howFound: "",
    satisfaction: "",
    suggestions: "",
    wantsPromos: false,
    wantsMarketing: false,
    wantsReferrals: false,
    wantsReminders: false,
    wantsGallery: false,
    visitFrequency: "",
    avgTattooValue: "",
    favoriteArtist: "",
    mostTattooedZone: "",
    mostRequestedStyle: "",
  });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: string | string[]) => {
    setForm((f) => ({
      ...f,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({
      ...f,
      referenceImage: e.target.files ? e.target.files[0] : null,
    }));
  };

  const handleDateChange = (name: string, value: string) => {
    setForm((f) => ({
      ...f,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors: { [k: string]: string } = {};
    if (!form.name) newErrors.name = "Nombre requerido";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Correo válido requerido";
    if (!form.phone) newErrors.phone = "Teléfono requerido";
    if (!form.city) newErrors.city = "Ciudad o barrio requerido";
    if (!form.birthdate) newErrors.birthdate = "Fecha de nacimiento requerida";
    // ...agrega más validaciones según necesidad...
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    if (!validate()) return;
    setLoading(true);

    const formData = new FormData();
    // Campos simples
    Object.entries(form).forEach(([key, value]) => {
      if (key === "favoriteStyles") {
        // Envía los estilos como JSON string
        formData.append(key, JSON.stringify(value));
      } else if (key === "referenceImage" && value) {
        formData.append(key, value as File);
      } else if (
        value !== null &&
        value !== undefined &&
        key !== "referenceImage"
      ) {
        formData.append(key, value as string);
      }
    });

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setSuccess("¡Registro enviado! Pronto un tatuador revisará tu solicitud.");
        setTimeout(() => navigate("/login"), 1800);
      } else {
        const data = await response.json();
        setErrors({ api: data.detail || "Error al registrar" });
      }
    } catch (err) {
      setErrors({ api: "No se pudo conectar al servidor." });
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] bg-cover bg-center"
      style={{
        backgroundImage: "url('/src/assets/hero-tattoo.jpg')",
      }}
      
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-card/90 rounded-lg shadow-lg p-8 backdrop-blur space-y-6 overflow-y-auto max-h-[90vh]"
      >
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            className="flex items-center gap-2 text-xs text-[hsl(var(--ink-purple))] hover:underline"
            onClick={() => navigate("/login")}
            tabIndex={-1}
          >
            <ArrowLeft className="h-4 w-4" /> Volver a iniciar sesión
          </button>
          <button
            type="button"
            className="flex items-center gap-2 text-xs text-[hsl(var(--ink-cyan))] hover:underline"
            onClick={() => navigate("/")}
            tabIndex={-1}
          >
            <HomeIcon className="h-4 w-4" /> Ir a Home
          </button>
        </div>
        <h1 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-[hsl(var(--ink-purple))] to-[hsl(var(--ink-cyan))] bg-clip-text text-transparent">
          Registro de Cliente
        </h1>

        {/* Datos personales */}
        <section>
          <h2 className="font-semibold text-lg mb-2 text-[hsl(var(--ink-purple))]">
            Datos personales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="name"
              placeholder="Nombre completo"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              name="age"
              type="number"
              placeholder="Edad"
              value={form.age}
              onChange={handleChange}
            />
            <StyledSelect
              name="gender"
              value={form.gender}
              onChange={e => handleSelectChange("gender", e.target.value)}
            >
              <option value="">Género (opcional)</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
              <option value="Prefiero no decir">Prefiero no decir</option>
            </StyledSelect>
            <Input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              name="phone"
              placeholder="Teléfono"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <Input
              name="city"
              placeholder="Ciudad o barrio"
              value={form.city}
              onChange={handleChange}
              required
            />
            <DatePicker
              name="birthdate"
              value={form.birthdate}
              onChange={(v) => handleDateChange("birthdate", v)}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            {errors.name && (
              <div className="text-red-500 text-xs">{errors.name}</div>
            )}
            {errors.email && (
              <div className="text-red-500 text-xs">{errors.email}</div>
            )}
            {errors.phone && (
              <div className="text-red-500 text-xs">{errors.phone}</div>
            )}
            {errors.city && (
              <div className="text-red-500 text-xs">{errors.city}</div>
            )}
            {errors.birthdate && (
              <div className="text-red-500 text-xs">{errors.birthdate}</div>
            )}
          </div>
        </section>

        {/* Preferencias y estilo */}
        <section>
          <h2 className="font-semibold text-lg mb-2 text-[hsl(var(--ink-purple))]">
            Preferencias y estilo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StyledSelect
              name="tattooedBefore"
              value={form.tattooedBefore}
              onChange={e => handleSelectChange("tattooedBefore", e.target.value)}
            >
              <option value="">¿Te has tatuado antes?</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </StyledSelect>
            <StyledSelect
              name="colorOrBlack"
              value={form.colorOrBlack}
              onChange={e => handleSelectChange("colorOrBlack", e.target.value)}
            >
              <option value="">¿Color o negro y gris?</option>
              <option value="Color">Color</option>
              <option value="Negro y gris">Negro y gris</option>
            </StyledSelect>
            <StyledSelect
              name="size"
              value={form.size}
              onChange={e => handleSelectChange("size", e.target.value)}
            >
              <option value="">Tamaño de tatuaje</option>
              {SIZES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </StyledSelect>
            <Input
              name="bodyZone"
              placeholder="Zona corporal"
              value={form.bodyZone}
              onChange={handleChange}
            />
            <Input
              name="preferredArtist"
              placeholder="Tatuador preferido (opcional)"
              value={form.preferredArtist}
              onChange={handleChange}
            />
            <label className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Upload className="h-4 w-4" /> Imagen de referencia (opcional)
              </span>
              <Input
                name="referenceImage"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {form.referenceImage && (
                <span className="text-xs text-green-600">
                  {form.referenceImage.name}
                </span>
              )}
            </label>
          </div>
          <div className="mt-2">
            <label className="block mb-1 font-medium">Estilos favoritos</label>
            <div className="flex flex-wrap gap-2">
              {TATTOO_STYLES.map((style) => (
                <label key={style} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={form.favoriteStyles.includes(style)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleSelectChange("favoriteStyles", [
                          ...form.favoriteStyles,
                          style,
                        ]);
                      } else {
                        handleSelectChange(
                          "favoriteStyles",
                          form.favoriteStyles.filter((s) => s !== style)
                        );
                      }
                    }}
                  />
                  <span>{style}</span>
                </label>
              ))}
            </div>
          </div>
          <Textarea
            name="meaning"
            placeholder="¿Qué significado tiene tu tatuaje?"
            value={form.meaning}
            onChange={handleChange}
          />
        </section>

        {/* Información médica */}
        <section>
          <h2 className="font-semibold text-lg mb-2 text-[hsl(var(--ink-purple))]">
            Información médica
          </h2>
          <Textarea
            name="allergies"
            placeholder="¿Alergias, enfermedades, condiciones médicas?"
            value={form.allergies}
            onChange={handleChange}
          />
          <Textarea
            name="medication"
            placeholder="¿Tomas algún medicamento actualmente?"
            value={form.medication}
            onChange={handleChange}
          />
          <Textarea
            name="painSensitivity"
            placeholder="¿Sensibilidad al dolor o experiencia negativa?"
            value={form.painSensitivity}
            onChange={handleChange}
          />
        </section>

        {/* Información de cita */}
        <section>
          <h2 className="font-semibold text-lg mb-2 text-[hsl(var(--ink-purple))]">
            Información de cita
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePicker
              name="desiredDate"
              value={form.desiredDate}
              onChange={(v) => handleDateChange("desiredDate", v)}
            />
            <StyledSelect
              name="preferredTime"
              value={form.preferredTime}
              onChange={e => handleSelectChange("preferredTime", e.target.value)}
            >
              <option value="">Horario preferido</option>
              {TIMES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </StyledSelect>
            <Input
              name="budget"
              type="number"
              placeholder="Presupuesto estimado"
              value={form.budget}
              onChange={handleChange}
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="wantsValuation"
                checked={form.wantsValuation}
                onChange={handleChange}
              />
              ¿Desea agendar cita de valoración previa?
            </label>
          </div>
        </section>

        {/* Experiencia y satisfacción */}
        <section>
          <h2 className="font-semibold text-lg mb-2 text-[hsl(var(--ink-purple))]">
            Experiencia y satisfacción
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="howFound"
              placeholder="¿Cómo conociste el estudio?"
              value={form.howFound}
              onChange={handleChange}
            />
            <StyledSelect
              name="satisfaction"
              value={form.satisfaction}
              onChange={e => handleSelectChange("satisfaction", e.target.value)}
            >
              <option value="">Satisfacción previa</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} estrellas
                </option>
              ))}
            </StyledSelect>
          </div>
          <Textarea
            name="suggestions"
            placeholder="¿Qué aspectos podríamos mejorar?"
            value={form.suggestions}
            onChange={handleChange}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="wantsPromos"
              checked={form.wantsPromos}
              onChange={handleChange}
            />
            ¿Te gustaría recibir promociones?
          </label>
        </section>

        {/* Fidelización y marketing */}
        <section>
          <h2 className="font-semibold text-lg mb-2 text-[hsl(var(--ink-purple))]">
            Fidelización y marketing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="wantsMarketing"
                checked={form.wantsMarketing}
                onChange={handleChange}
              />
              ¿Recibir información sobre promociones/nuevos estilos?
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="wantsReferrals"
                checked={form.wantsReferrals}
                onChange={handleChange}
              />
              ¿Participar en programa de referidos?
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="wantsReminders"
                checked={form.wantsReminders}
                onChange={handleChange}
              />
              ¿Recordatorios de fechas importantes?
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="wantsGallery"
                checked={form.wantsGallery}
                onChange={handleChange}
              />
              ¿Guardar diseño en galería personal?
            </label>
          </div>
        </section>

        {/* Extras CRM */}
        <section>
          <h2 className="font-semibold text-lg mb-2 text-[hsl(var(--ink-purple))]">
            Extras CRM
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StyledSelect
              name="visitFrequency"
              value={form.visitFrequency}
              onChange={e => handleSelectChange("visitFrequency", e.target.value)}
            >
              <option value="">Frecuencia de visitas</option>
              {FREQUENCIES.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </StyledSelect>
            <Input
              name="avgTattooValue"
              type="number"
              placeholder="Valor promedio de tatuaje"
              value={form.avgTattooValue}
              onChange={handleChange}
            />
            <Input
              name="favoriteArtist"
              placeholder="Artista favorito"
              value={form.favoriteArtist}
              onChange={handleChange}
            />
            <Input
              name="mostTattooedZone"
              placeholder="Zona corporal más tatuada"
              value={form.mostTattooedZone}
              onChange={handleChange}
            />
            <Input
              name="mostRequestedStyle"
              placeholder="Estilo más solicitado"
              value={form.mostRequestedStyle}
              onChange={handleChange}
            />
          </div>
        </section>

        {errors.api && <div className="text-red-500 text-center">{errors.api}</div>}
        {success && <div className="text-green-500 text-center">{success}</div>}
        <Button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[hsl(var(--ink-purple))] to-[hsl(var(--ink-cyan))] hover:opacity-90"
          disabled={loading}
        >
          {loading && <Loader2 className="animate-spin h-5 w-5" />}
          {loading ? "Enviando..." : "Registrarse"}
        </Button>
      </form>
    </div>
  );
}

// Icono Home para el botón
function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M3 12L12 3l9 9" />
      <path d="M9 21V9h6v12" />
    </svg>
  );
}

// Reemplaza todos los <select> por este componente estilizado:
function StyledSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={
        "w-full px-3 py-2 rounded border border-border bg-card/50 text-white focus:outline-none focus:border-[hsl(var(--ink-purple))] transition-colors " +
        (props.className || "")
      }
    >
      {props.children}
    </select>
  );
}
