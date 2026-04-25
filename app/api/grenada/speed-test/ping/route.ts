// Returns a fixed-size payload used by the client for download speed measurement
export async function GET() {
  const payload = Buffer.alloc(51_200) // 50 KB
  return new Response(payload, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Cache-Control': 'no-store',
      'Content-Length': '51200',
    },
  })
}
