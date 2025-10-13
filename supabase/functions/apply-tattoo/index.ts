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
    const { bodyImage, tattooPrompt } = await req.json();

    console.log("Received bodyImage:", bodyImage);
    console.log("Received tattooPrompt:", tattooPrompt);

    if (!bodyImage || !tattooPrompt) {
      throw new Error("Both body image and tattoo prompt are required");
    }

    const REPLICATE_API_TOKEN = Deno.env.get("REPLICATE_API_TOKEN");
    if (!REPLICATE_API_TOKEN) {
      throw new Error("REPLICATE_API_TOKEN is not configured");
    }

    // ID de versión real de stability-ai/stable-diffusion (cópialo de la pestaña API en Replicate)
    const version = "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4"; // <-- reemplaza por el ID real

    console.log("Calling Replicate with:", { bodyImage, tattooPrompt, version });

    const replicateResponse = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version,
        input: {
          image: bodyImage, // URL pública de la imagen base
          prompt: tattooPrompt, // descripción textual del tatuaje
        },
      }),
    });

    if (!replicateResponse.ok) {
      const errorText = await replicateResponse.text();
      console.error("Replicate API error:", replicateResponse.status, errorText);
      throw new Error("Replicate API error: " + errorText);
    }

    const replicateData = await replicateResponse.json();

    console.log("Replicate response:", replicateData);

    const outputUrl = replicateData?.output?.[0] || replicateData?.output;

    if (!outputUrl) {
      throw new Error("No image was generated");
    }

    return new Response(JSON.stringify({ image: outputUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in apply-tattoo function:", error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});