import type { APIRoute } from 'astro';
import { requirePortalIdentity } from '@/lib/portal/auth';
import { jsonResponse } from '@/lib/portal/security';

export const prerender = false;
type Weather = { temperature: number; condition: string };
let cached: { weather: Weather; expires: number } | undefined;
let pending: Promise<Weather> | undefined;

async function fetchWeather(): Promise<Weather> {
  const response = await fetch(
    'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=56.95&lon=24.11',
    {
      headers: { 'User-Agent': 'ROMADI CMS/1.0 (+https://romadi.lv)' },
      signal: AbortSignal.timeout(5000),
    },
  );
  if (!response.ok) throw new Error('Forecast unavailable');
  const data = await response.json();
  const latest = data.properties?.timeseries?.[0]?.data;
  const temperature = latest?.instant?.details?.air_temperature;
  if (typeof temperature !== 'number' || !Number.isFinite(temperature))
    throw new Error('Temperature unavailable');
  const symbol = String(latest?.next_1_hours?.summary?.symbol_code ?? '');
  let condition = 'Vietējā prognoze';
  if (symbol.includes('thunder')) condition = 'Pērkona negaiss';
  else if (symbol.includes('sleet')) condition = 'Slapjš sniegs';
  else if (symbol.includes('snow')) condition = 'Sniegs';
  else if (symbol.includes('rain')) condition = 'Lietus';
  else if (symbol.includes('fog')) condition = 'Migla';
  else if (symbol.includes('cloud')) condition = 'Mākoņains';
  else if (symbol.includes('clear')) condition = 'Skaidrs';
  const weather = { temperature, condition };
  cached = {
    weather,
    expires: Math.max(
      Date.now() + 30 * 60_000,
      Date.parse(response.headers.get('expires') ?? '') || 0,
    ),
  };
  return weather;
}

export const GET: APIRoute = async ({ locals }) => {
  try {
    await requirePortalIdentity(locals.supabase);
  } catch {
    return jsonResponse({ error: 'Piesakies, lai skatītu laikapstākļus.' }, 401);
  }
  try {
    if (cached && cached.expires > Date.now()) return jsonResponse(cached.weather);
    pending ??= fetchWeather().finally(() => {
      pending = undefined;
    });
    return jsonResponse(await pending);
  } catch {
    return jsonResponse({ error: 'Laikapstākļi nav pieejami.' }, 503);
  }
};
