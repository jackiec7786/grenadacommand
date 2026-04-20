export const revalidate = 21600 // cache 6 hours

export async function GET() {
  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
    const data = await res.json()
    if (!data?.rates) return Response.json(null, { status: 503 })
    return Response.json(data.rates)
  } catch {
    return Response.json(null, { status: 503 })
  }
}
