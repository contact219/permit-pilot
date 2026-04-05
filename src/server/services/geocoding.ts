// DFW jurisdiction boundaries - city name patterns to match against Google geocoding results
const DFW_CITY_MAP: Record<string, string> = {
  'allen': 'Allen, TX',
  'frisco': 'Frisco, TX',
  'mckinney': 'McKinney, TX',
  'plano': 'Plano, TX',
  'wylie': 'Wylie, TX',
  'fort worth': 'Fort Worth, TX',
  'dallas': 'Dallas, TX',
  'arlington': 'Arlington, TX',
  'denton': 'Denton, TX',
  'north richland hills': 'North Richland Hills, TX',
  'hurst': 'Hurst, TX',
  'euless': 'Euless, TX',
  'bedford': 'Bedford, TX',
  'grand prairie': 'Grand Prairie, TX',
  'coppell': 'Coppell, TX',
  'richland hills': 'Richland Hills, TX',
  'haltom city': 'Haltom City, TX',
  'watauga': 'Watauga, TX',
  'mansfield': 'Mansfield, TX',
  'grapevine': 'Grapevine, TX',
  'flower mound': 'Flower Mound, TX',
  'westlake': 'Westlake, TX',
  'dalworthington gardens': 'Dalworthington Gardens, TX',
  'pantego': 'Pantego, TX',
};

export interface GeocodeResult {
  formattedAddress: string;
  city: string;
  state: string;
  county: string;
  zipCode: string;
  lat: number;
  lng: number;
  jurisdictionName: string | null;
  inFloodZone: boolean;
  components: Record<string, string>;
}

export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  const apiKey = process.env.GOOGLE_GEOCODING_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_GEOCODING_API_KEY not configured');

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&region=us&key=${apiKey}`;

  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error('Geocoding API error: ' + res.status);

  const data = await res.json();
  if (data.status !== 'OK' || !data.results?.length) return null;

  const result = data.results[0];
  const components: Record<string, string> = {};

  for (const comp of result.address_components) {
    for (const type of comp.types) {
      components[type] = comp.long_name;
      components[type + '_short'] = comp.short_name;
    }
  }

  const city = components.locality || components.sublocality || components.neighborhood || '';
  const state = components.administrative_area_level_1_short || '';
  const county = components.administrative_area_level_2 || '';
  const zipCode = components.postal_code || '';
  const lat = result.geometry.location.lat;
  const lng = result.geometry.location.lng;

  // Match to DFW jurisdiction
  const cityLower = city.toLowerCase();
  const jurisdictionName = DFW_CITY_MAP[cityLower] || null;

  return {
    formattedAddress: result.formatted_address,
    city,
    state,
    county,
    zipCode,
    lat,
    lng,
    jurisdictionName,
    inFloodZone: false, // Could integrate FEMA flood map API later
    components,
  };
}

export async function getPlacesAutocomplete(input: string): Promise<Array<{
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}>> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_PLACES_API_KEY not configured');

  // Bias results to DFW area (lat/lng center of DFW)
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json` +
    `?input=${encodeURIComponent(input)}` +
    `&types=address` +
    `&components=country:us` +
    `&location=32.7767,-96.7970` +
    `&radius=80000` +
    `&key=${apiKey}`;

  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error('Places API error: ' + res.status);

  const data = await res.json();
  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    console.error('Places API status:', data.status, data.error_message);
    return [];
  }

  return (data.predictions || []).map((p: any) => ({
    placeId: p.place_id,
    description: p.description,
    mainText: p.structured_formatting?.main_text || p.description,
    secondaryText: p.structured_formatting?.secondary_text || '',
  }));
}
