const GRENADA_DEFAULT = {
  city: "St. George's",
  country: 'Grenada',
  timezone: 'America/Grenada',
  lat: 12.1165,
  lon: -61.679,
}

function isPrivateIp(ip: string): boolean {
  return (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip === 'localhost' ||
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip)
  )
}

export async function GET(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : null

  if (!ip || isPrivateIp(ip)) {
    return Response.json(GRENADA_DEFAULT)
  }

  try {
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,city,country,timezone,lat,lon`
    )
    const data = await res.json()
    if (data.status !== 'success') return Response.json(GRENADA_DEFAULT)
    return Response.json({
      city: data.city,
      country: data.country,
      timezone: data.timezone,
      lat: data.lat,
      lon: data.lon,
    })
  } catch {
    return Response.json(GRENADA_DEFAULT)
  }
}
