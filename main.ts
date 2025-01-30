import { serve } from "https://deno.land/std@0.204.0/http/server.ts";

async function handler(req: Request): Promise<Response> {
  try {
    const html = await Deno.readFile(new URL("./index.html", import.meta.url));
    return new Response(html, {
      headers: {
        "content-type": "text/html",
      },
    });
  } catch (e) {
    console.error(e);
    return new Response("Internal Server Error", { status: 500 });
  }
}

serve(handler);
