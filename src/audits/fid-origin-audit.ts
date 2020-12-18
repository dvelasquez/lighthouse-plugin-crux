import {
  createErrorResult,
  createNotApplicableResult,
  createValueResult,
  getLoadingExperience,
  isResultsInField,
} from '../utils/audit-helpers';

import { Audit } from 'lighthouse';

module.exports = class FidOriginAudit extends Audit {
  static get meta() {
    return {
      id: 'fid-origin',
      title: 'First Input Delay (Origin)',
      description: `First Input Delay (FID) quantifies the experience users feel when trying to interact with unresponsive pages. The value is 75th percentile of the origin traffic. [Learn more about FID](https://web.dev/fid/)`,
      scoreDisplayMode: 'numeric',
      requiredArtifacts: ['URL', 'settings'],
    };
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    try {
      const cruxResponse = await getLoadingExperience(artifacts, context, false);
      if (!isResultsInField(cruxResponse.record)) return createNotApplicableResult(FidOriginAudit.meta.title);
      return createValueResult(cruxResponse.record.metrics.first_input_delay, 'fid');
    } catch (err) {
      return createErrorResult(err);
    }
  }
};
