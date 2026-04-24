const GRENADA_DEFAULT = {
  city: "St. George's",
  country: 'Grenada',
  timezone: 'America/Grenada',
  lat: 12.1165,
  lon: -61.679,
}

function isValidIp(ip: string): boolean {
  const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/
  const ipv6 = /^[0-9a-fA-F:]{3,39}$/
  return ipv4.test(ip) || ipv6.test(ip)
}

function isPrivateIp(ip: string): boolean {
  return (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip)
  )
}

export async function GET(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for') ?? ''
  // Parse all IPs — Vercel prepends client IP but may have multiple hops
  const ips = forwarded.split(',').map(s => s.trim()).filter(Boolean)
  const ip = ips.find(ip => isValidIp(ip) && !isPrivateIp(ip)) ?? null

  if (!ip) return Response.json(GRENADA_DEFAULT)

  // Primary: ipapi.co (HTTPS, free tier)
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { 'User-Agent': 'grenadacommand/1.0' },
    })
    const data = await res.json()
    if (data?.error || !data?.timezone) throw new Error('ipapi.co failed')
    return Response.json({
      city: data.city ?? 'Unknown',
      country: data.country_name ?? 'Unknown',
      timezone: data.timezone,
      lat: data.latitude ?? GRENADA_DEFAULT.lat,
      lon: data.longitude ?? GRENADA_DEFAULT.lon,
    })
  } catch { /* fall through */ }

  // Fallback: ip-api.com (server-to-server HTTP is fine)
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,city,country,timezone,lat,lon`)
    const data = await res.json()
    if (data?.status !== 'success' || !data.timezone) return Response.json(GRENADA_DEFAULT)
    return Response.json({
      city: data.city ?? 'Unknown',
      country: data.country ?? 'Unknown',
      timezone: data.timezone,
      lat: data.lat ?? GRENADA_DEFAULT.lat,
      lon: data.lon ?? GRENADA_DEFAULT.lon,
    })
  } catch {
    return Response.json(GRENADA_DEFAULT)
  }
}
