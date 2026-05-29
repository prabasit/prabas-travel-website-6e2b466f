// IndexNow submission edge function
// Submits one or more URLs to IndexNow for instant indexing across
// participating search engines (Bing, Yandex, Seznam, Naver).
// POST { urls: string[] }

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const HOST = "prabas-travel-website.lovable.app";
const KEY = "d7ea40ca00bb95deeb97ee91df71a518";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const rawUrls: string[] = Array.isArray(body?.urls) ? body.urls : [];
    const urls = rawUrls
      .map((u) => (typeof u === "string" ? u.trim() : ""))
      .filter((u) => u.startsWith(`https://${HOST}`));

    if (urls.length === 0) {
      return new Response(
        JSON.stringify({ error: "Provide a non-empty 'urls' array of absolute URLs on the project domain." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const payload = {
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: urls,
    };

    const res = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    return new Response(
      JSON.stringify({ status: res.status, ok: res.ok, response: text, submitted: urls }),
      { status: res.ok ? 200 : res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
