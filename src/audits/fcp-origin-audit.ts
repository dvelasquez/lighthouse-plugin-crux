import { Audit, Artifacts } from 'lighthouse';
import * as LH from 'lighthouse/types/lh.js';
import {
  createErrorResult,
  createNotApplicableResult,
  createValueResult,
  getLoadingExperience,
  isResultsInField,
} from '../utils/audit-helpers.js';

export default class FcpOriginAudit extends Audit {
  static get meta() {
    return {
      id: 'crux-fcp-origin',
      title: 'First Contentful Paint (Origin)',
      description:
        'First Contentful Paint (FCP) marks the first time in the page load timeline where the user can see anything on the screen. The value is 75th percentile of the origin traffic. [Learn more about FCP](https://web.dev/fcp/)',
      scoreDisplayMode: 'numeric' as LH.Audit.ScoreDisplayMode,
      requiredArtifacts: ['URL', 'settings'] as LH.Audit.Meta['requiredArtifacts'],
    };
  }

  static async audit(artifacts: Artifacts, context: LH.Audit.Context) {
    try {
      const cruxResponse = await getLoadingExperience(artifacts, context, false);
      if (!isResultsInField(cruxResponse.record)) return createNotApplicableResult(FcpOriginAudit.meta.title);
      return createValueResult(cruxResponse.record.metrics.first_contentful_paint, 'fcp');
    } catch (err) {
      return createErrorResult(err);
    }
  }
};
