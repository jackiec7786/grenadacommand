export const revalidate = 3600 // 1 hour

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get('lat') ?? '12.1165'
  const lon = searchParams.get('lon') ?? '-61.679'

  try {
    const url =
      'https://api.open-meteo.com/v1/forecast' +
      `?latitude=${lat}&longitude=${lon}` +
      '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m' +
      '&temperature_unit=celsius&wind_speed_unit=kmh'
    const res = await fetch(url)
    const data = await res.json()
    if (!data?.current) return Response.json(null, { status: 503 })
    return Response.json(data.current)
  } catch {
    return Response.json(null, { status: 503 })
  }
}
