import { round, isNumber } from 'lodash-es';
import { Audit, Artifacts } from 'lighthouse';
import * as LH from 'lighthouse/types/lh.js';
import {
  CrUXMetric,
  CrUXMetricHistogram,
  cruxRequest,
  CrUXRequestApiOriginOptions,
  CrUXRequestApiUrlOptions,
  CrUXResponseApi,
  FormFactor,
  MetricsOptions,
} from './crux-request.js';

const requests = new Map();

export const getLoadingExperience = async (
  artifacts: LH.Artifacts,
  context: LH.Audit.Context | any,
  isUrl = true,
): Promise<CrUXResponseApi> => {
  const cruxToken = context.settings.cruxToken || null;
  const formFactor: FormFactor = artifacts.settings.formFactor === 'desktop' ? 'DESKTOP' : 'PHONE';
  const prefix = isUrl ? 'url' : 'origin';
  const { href, origin } = new URL(artifacts.URL.finalDisplayedUrl);
  const url = `${prefix}:${href}`;
  const key = url + formFactor;
  if (!requests.has(key)) {
    const options = isUrl
      ? ({ url: href, formFactor } as CrUXRequestApiUrlOptions)
      : ({ origin, formFactor } as CrUXRequestApiOriginOptions);
    requests.set(key, await cruxRequest(options, cruxToken));
  }
  return requests.get(key);
};

export const createValueResult = (metricValue: any, metric: string): LH.Audit.Product => {
  const numericValue: number = normalizeMetricValue(metric, metricValue.percentiles.p75);
  return {
    numericValue,
    score: Audit.computeLogNormalScore(getMetricRange(metric), numericValue),
    numericUnit: getMetricNumericUnit(metric),
    displayValue: formatMetric(metric, numericValue),
    details: createDistributionsTable(metricValue, metric),
  };
};

export const createNotApplicableResult = (title: string) => {
  return {
    score: null,
    notApplicable: true,
    explanation: `The Chrome User Experience Report 
          does not have sufficient real-world ${title} data for this page.`,
  };
};

export const createErrorResult = (err: Error) => {
  console.log(err);
  return {
    score: null,
    errorMessage: err.toString(),
  };
};

export const isResultsInField = (le: {
  key: CrUXRequestApiOriginOptions | CrUXRequestApiUrlOptions;
  metrics: {
    [key in MetricsOptions]: CrUXMetric;
  };
}): boolean => {
  return !!le && Boolean(Object.values(le.metrics || {}).length);
};

function createDistributionsTable({ histogram }: { histogram: CrUXMetricHistogram[] }, metric): LH.Audit.Details.Table {
  const headings: LH.Audit.Details.TableColumnHeading[] = [
    { key: 'category', valueType: 'text', label: 'Category' },
    { key: 'distribution', valueType: 'text', label: 'Percent of traffic' },
  ];
  const items = histogram.map(({ start, end, density }, index) => {
    const item: any = {};
    const normMin = formatMetric(metric, normalizeMetricValue(metric, start));
    const normMax = formatMetric(metric, normalizeMetricValue(metric, end));

    if (start === 0 || start === '0.00') {
      item.category = `Good (faster than ${normMax})`;
    } else if (end && start === histogram[index - 1].end) {
      item.category = `Needs improvement (from ${normMin} to ${normMax})`;
    } else {
      item.category = `Poor (longer than ${normMin})`;
    }

    item.distribution = `${round(density * 100, 1)} %`;

    return item;
  });

  return Audit.makeTableDetails(headings, items);
}

/**
 * Recommended ranks (https://web.dev/metrics/):
 *
 * FCP: Fast < 1.0 s,   Slow > 3.0 s
 * LCP: Fast < 2.5 s,   Slow > 4.0 s
 * CLS: Fast < 0.10,    Slow > 0.25
 * INP: Fast < 200 ms,  Slow > 500 ms
 *
 * `p10` value is calibrated to return 0.9 for the fast value,
 * `median` value returns 0.5.
 *
 * The logic is taken from Lighthouse:
 * https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/metrics/largest-contentful-paint.js#L45
 *
 */

function getMetricRange(metric: string): { p10: number; median: number } {
  switch (metric) {
    case 'fcp':
      return { p10: 1000, median: 3000 };
    case 'lcp':
      return { p10: 2500, median: 4000 };  
    case 'cls':
      return { p10: 0.1, median: 0.25 };
    case 'inp':
      return { p10: 200, median: 500 };
    default:
      throw new Error(`Invalid metric range: ${metric}`);
  }
}

function formatMetric(metric: string, value: number): string {
  switch (metric) {
    case 'fcp':
      return round(value / 1000, 1).toFixed(1) + ' s';
    case 'lcp':
      return round(value / 1000, 1).toFixed(1) + ' s';
    case 'inp':
      return round(round(value / 10) * 10) + ' ms';
    case 'cls':
      return value === 0 ? '0' : value === 0.1 ? '0.10' : round(value, 3).toString();
    default:
      throw new Error(`Invalid metric format: ${metric}`);
  }
}

function normalizeMetricValue(metric: string, value: number | string | undefined): number | undefined {
  if (value) {
    const safeValue: number = isNumber(value) ? (value as number) : Number.parseFloat(value.toString());
    return safeValue; //metric === 'cls' ? safeValue / 100 : safeValue;
  } else {
    return undefined;
  }
}

function getMetricNumericUnit(metric: string): 'unitless' | 'millisecond' {
  return metric === 'cls' ? 'unitless' : 'millisecond';
}
