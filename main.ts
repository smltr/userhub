import { serve } from "https://deno.land/std@0.204.0/http/server.ts";

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  if (url.pathname === "/create-portal-session") {
    try {
      const { userId } = await req.json();
      console.log("Creating portal session for user:", userId);

      const connectionId = Deno.env.get("USERHUB_AUTH0_CONNECTION_ID");
      const apiKey = Deno.env.get("USERHUB_USER_API_KEY");

      console.log("Using connection ID:", connectionId);

      const requestBody = {
        user_id: `${userId}@${connectionId}`,
        portal_url: "https://dev-mgwzgp9dv1y9ba.userhub.app",
      };

      console.log("Request body:", requestBody);

      const response = await fetch(
        "https://api.userhub.com/public/v1/portal/session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify(requestBody),
        },
      );

      const responseData = await response.text();
      console.log("Response status:", response.status);
      console.log("Response body:", responseData);

      if (!response.ok) {
        throw new Error(
          `Failed to create portal session: ${response.status} - ${responseData}`,
        );
      }

      return new Response(responseData, {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Portal session creation error:", error);
      return new Response(
        JSON.stringify({
          error: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
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
