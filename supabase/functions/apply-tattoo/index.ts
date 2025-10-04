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

    const REPLICATE_API_TOKEN = Deno.env.get("REPLICATE_API_TOKEN");
    if (!REPLICATE_API_TOKEN) {
      throw new Error("REPLICATE_API_TOKEN is not configured");
    }

    // Llama a Replicate ControlNet
    const replicateResponse = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "1b819b7cfae3e8c8e3e8c8e3e8c8e3e8c8e3e8c8e3e8c8e3e8c8e3e8c8e3e8c8", // Usa la versión del modelo ControlNet que elijas
        input: {
          image: bodyImage, // base64 o URL
          conditioning_image: tattooDesign, // base64 o URL
          // Puedes ajustar los parámetros según el modelo
          prompt: "Aplica el diseño del tatuaje de forma realista sobre la piel.",
        },
      }),
    });

    if (!replicateResponse.ok) {
      const errorText = await replicateResponse.text();
      throw new Error("Replicate API error: " + errorText);
    }

    const replicateData = await replicateResponse.json();

    // Replicate responde con una URL de la imagen generada
    const outputUrl = replicateData?.output?.[0] || replicateData?.output;

    if (!outputUrl) {
      throw new Error("No image was generated");
    }

    return new Response(JSON.stringify({ image: outputUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});