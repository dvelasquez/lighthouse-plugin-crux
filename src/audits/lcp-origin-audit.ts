import { Audit } from 'lighthouse';

import {
  createErrorResult,
  createNotApplicableResult,
  createValueResult,
  getLoadingExperience,
  isResultsInField,
} from '../utils/audit-helpers';

module.exports = class LcpOriginAudit extends Audit {
  static get meta() {
    return {
      id: 'lcp-origin',
      title: 'Largest Contentful Paint (Origin)',
      description: `Largest Contentful Paint (LCP) marks the time in the page load timeline when the page's main content has likely loaded. The value is 75th percentile of the origin traffic. [Learn more about LCP](https://web.dev/lcp/)`,
      scoreDisplayMode: 'numeric',
      requiredArtifacts: ['URL', 'settings'],
    };
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    try {
      const cruxResponse = await getLoadingExperience(artifacts, context, false);
      if (!isResultsInField(cruxResponse.record)) return createNotApplicableResult(LcpOriginAudit.meta.title);
      return createValueResult(cruxResponse.record.metrics.largest_contentful_paint, 'lcp');
    } catch (err) {
      return createErrorResult(err);
    }
  }
};
