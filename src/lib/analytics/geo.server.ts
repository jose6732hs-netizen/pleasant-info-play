import { z } from "zod";

export const GeoInfoSchema = z.object({
  city: z.string().default("Desconhecida"),
  region: z.string().default("Desconhecido"),
  region_code: z.string().optional(),
  country: z.string().default("Desconhecido"),
  country_code: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  timezone: z.string().optional(),
  isp: z.string().optional(),
});

export type GeoInfo = z.infer<typeof GeoInfoSchema>;

/**
 * Fetches geolocation information based on the visitor's IP address.
 * Using ip-api.com as a reliable free (for non-commercial/testing) service.
 */
export async function getGeoInfo(request: Request): Promise<GeoInfo> {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || 
             request.headers.get("cf-connecting-ip") ||
             "";

  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.")) {
    return {
      city: "Desconhecida",
      region: "Desconhecido",
      country: "Desconhecido"
    };
  }

  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone,isp`);
    const data = await response.json();

    if (data.status === "fail") {
      return {
        city: "Desconhecida",
        region: "Desconhecido",
        country: "Desconhecido"
      };
    }

    return {
      city: data.city || "Desconhecida",
      region: data.regionName || "Desconhecido",
      region_code: data.region,
      country: data.country || "Desconhecido",
      country_code: data.countryCode,
      latitude: data.lat,
      longitude: data.lon,
      timezone: data.timezone,
      isp: data.isp,
    };
  } catch (error) {
    console.error("Geo lookup error:", error);
    return {
      city: "Desconhecida",
      region: "Desconhecido",
      country: "Desconhecido"
    };
  }
}
