export async function onRequest(context) {
  return new Response(JSON.stringify({
    message: 'Hello from Cloudflare Pages Functions!',
    timestamp: new Date().toISOString(),
    headers: Object.fromEntries(context.request.headers),
  }), {
    headers: {
      'content-type': 'application/json',
    },
  });
}