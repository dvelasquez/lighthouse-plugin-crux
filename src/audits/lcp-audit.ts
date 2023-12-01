import { Audit, Artifacts } from 'lighthouse';
import * as LH from 'lighthouse/types/lh.js';
import {
  createErrorResult,
  createNotApplicableResult,
  createValueResult,
  getLoadingExperience,
  isResultsInField,
} from '../utils/audit-helpers.js';

export default class LcpAudit extends Audit {
  static get meta() {
    return {
      id: 'crux-lcp',
      title: 'Largest Contentful Paint (Origin)',
      description: `Largest Contentful Paint (LCP) marks the time in the page load timeline when the page's main content has likely loaded. The value is 75th percentile of the origin traffic. [Learn more about LCP](https://web.dev/lcp/)`,
      scoreDisplayMode: 'numeric' as LH.Audit.ScoreDisplayMode,
      requiredArtifacts: ['URL', 'settings'] as LH.Audit.Meta['requiredArtifacts'],
    };
  }

  static async audit(artifacts: Artifacts, context: LH.Audit.Context) {
    try {
      const cruxResponse = await getLoadingExperience(artifacts, context, true);
      if (!isResultsInField(cruxResponse.record)) return createNotApplicableResult(LcpAudit.meta.title);
      return createValueResult(cruxResponse.record.metrics.largest_contentful_paint, 'lcp');
    } catch (err) {
      return createErrorResult(err);
    }
  }
};
