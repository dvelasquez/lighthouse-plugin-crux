const CRUX_API_TOKEN = process.env.CRUX_API_TOKEN || '';
const apiUrl = 'https://content-chromeuxreport.googleapis.com/v1/records:queryRecord?alt=json&key=';

export type FormFactor = 'ALL_FORM_FACTORS' | 'PHONE' | 'DESKTOP' | 'TABLET' | string;
export type EffectiveConnectionType = 'offline' | 'slow-2G' | '2G' | '3G' | '4G' | string;
export interface CrUXRequestApiBaseOptions {
  effectiveConnectionType?: EffectiveConnectionType;
  formFactor?: FormFactor;
  metrics?: Array<
    'first_contentful_paint' | 'largest_contentful_paint' | 'cumulative_layout_shift' | 'interaction_to_next_paint'
  >;
}
export interface CrUXRequestApiOriginOptions extends CrUXRequestApiBaseOptions {
  origin: string;
  url?: never;
}
export interface CrUXRequestApiUrlOptions extends CrUXRequestApiBaseOptions {
  origin?: never;
  url: string;
}

export enum MetricsOptions {
  CUMULATIVE_LAYOUT_SHIFT = 'cumulative_layout_shift',
  FIRST_CONTENTFUL_PAINT = 'first_contentful_paint',
  LARGEST_CONTENTFUL_PAINT = 'largest_contentful_paint',
  INTERACTION_TO_NEXT_PAINT = 'interaction_to_next_paint',
}
export interface CrUXMetricHistogram {
  start: number | string;
  end: number | string;
  density: number;
}
export interface CrUXMetric {
  histogram: CrUXMetricHistogram[];
  percentiles: {
    p75: number;
  };
}

export interface CrUXResponseApi {
  record: {
    key: CrUXRequestApiOriginOptions | CrUXRequestApiUrlOptions;
    metrics: {
      [key in MetricsOptions]: CrUXMetric;
    };
  };
}

export async function cruxRequest(
  opts: CrUXRequestApiOriginOptions | CrUXRequestApiUrlOptions,
  cruxToken: string,
): Promise<CrUXResponseApi> {
  try {
    if (cruxToken || CRUX_API_TOKEN) {
      cruxToken = cruxToken || CRUX_API_TOKEN;
      const response = await fetch(apiUrl + cruxToken, { method: 'POST', body: JSON.stringify(opts) });
      const responseAsJson =  await response.json() as CrUXResponseApi;
      return responseAsJson;
    } else {
      throw new Error('No CrUX API token provided');
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
