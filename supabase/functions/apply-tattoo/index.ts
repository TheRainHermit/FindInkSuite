import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bodyImage, tattooDesign } = await req.json();

    if (!bodyImage || !tattooDesign) {
      throw new Error("Both body image and tattoo design are required");
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    // Llama a Gemini Pro Vision API
    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=" + GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Aplica este diseño de tatuaje de forma realista sobre la parte del cuerpo mostrada en la primera imagen. El tatuaje debe verse natural, siguiendo los contornos y la textura de la piel.",
                },
                {
                  inlineData: {
                    mimeType: "image/png",
                    data: bodyImage.replace(/^data:image\/\w+;base64,/, ""),
                  },
                },
                {
                  inlineData: {
                    mimeType: "image/png",
                    data: tattooDesign.replace(/^data:image\/\w+;base64,/, ""),
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API error:", geminiResponse.status, errorText);
      throw new Error("Gemini API error: " + errorText);
    }

    const geminiData = await geminiResponse.json();

    // Busca la imagen generada en la respuesta
    const generatedImage =
      geminiData.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData)?.inlineData?.data;

    if (!generatedImage) {
      throw new Error("No image was generated");
    }

    // Devuelve la imagen en base64 (puedes agregar el prefijo si lo necesitas en el frontend)
    return new Response(
      JSON.stringify({ image: "data:image/png;base64," + generatedImage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in apply-tattoo function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
