const GRENADA_DEFAULT = {
  city: "St. George's",
  country: 'Grenada',
  timezone: 'America/Grenada',
  lat: 12.1165,
  lon: -61.679,
}

// Basic IP format validation (IPv4 or IPv6)
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
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : null

  if (!ip || !isValidIp(ip) || isPrivateIp(ip)) {
    return Response.json(GRENADA_DEFAULT)
  }

  try {
    // ipapi.co supports HTTPS on the free tier
    const res = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { 'User-Agent': 'grenadacommand/1.0' },
    })
    const data = await res.json()
    if (!data?.timezone) return Response.json(GRENADA_DEFAULT)
    return Response.json({
      city: data.city ?? 'Unknown',
      country: data.country_name ?? 'Unknown',
      timezone: data.timezone,
      lat: data.latitude ?? GRENADA_DEFAULT.lat,
      lon: data.longitude ?? GRENADA_DEFAULT.lon,
    })
  } catch {
    return Response.json(GRENADA_DEFAULT)
  }
}
