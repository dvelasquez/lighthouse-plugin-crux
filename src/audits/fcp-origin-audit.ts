import { Audit } from 'lighthouse';

import {
  createErrorResult,
  createNotApplicableResult,
  createValueResult,
  getLoadingExperience,
  isResultsInField,
} from '../utils/audit-helpers';

module.exports = class FcpOriginAudit extends Audit {
  static get meta() {
    return {
      id: 'crux-fcp-origin',
      title: 'First Contentful Paint (Origin)',
      description:
        'First Contentful Paint (FCP) marks the first time in the page load timeline where the user can see anything on the screen. The value is 75th percentile of the origin traffic. [Learn more about FCP](https://web.dev/fcp/)',
      scoreDisplayMode: 'numeric',
      requiredArtifacts: ['URL', 'settings'],
    };
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    try {
      const cruxResponse = await getLoadingExperience(artifacts, context, false);
      if (!isResultsInField(cruxResponse.record)) return createNotApplicableResult(FcpOriginAudit.meta.title);
      return createValueResult(cruxResponse.record.metrics.first_contentful_paint, 'fcp');
    } catch (err) {
      return createErrorResult(err);
    }
  }
};
