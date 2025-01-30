import { serve } from "https://deno.land/std@0.204.0/http/server.ts";

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // Handle portal session creation
  if (url.pathname === "/create-portal-session") {
    try {
      const { userId } = await req.json();

      const response = await fetch(
        "https://api.userhub.com/public/v1/portal/session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Deno.env.get("USERHUB_USER_API_KEY")}`,
          },
          body: JSON.stringify({
            user_id: `${userId}@${Deno.env.get("USERHUB_AUTH0_CONNECTION_ID")}`,
            portal_url: "https://dev-mgwzgp9dv1y9ba.userhub.app",
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to create portal session: ${response.statusText}`,
        );
      }

      const session = await response.json();
      return new Response(JSON.stringify(session), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Portal session creation error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // Serve index.html
  try {
    const html = await Deno.readFile(new URL("./index.html", import.meta.url));
    return new Response(html, {
      headers: { "content-type": "text/html" },
    });
  } catch (e) {
    console.error(e);
    return new Response("Internal Server Error", { status: 500 });
  }
}

serve(handler);
