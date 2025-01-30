import { serve } from "https://deno.land/std@0.204.0/http/server.ts";

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // Serve index.html
  try {
    const html = await Deno.readFile(new URL("./index.html", import.meta.url));
    return new Response(html, {
      headers: {
        "content-type": "text/html",
        // Add CORS headers if needed
        "access-control-allow-origin": "*",
      },
    });
  } catch (e) {
    console.error(e);
    return new Response("Internal Server Error", { status: 500 });
  }
}

serve(handler);
