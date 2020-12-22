import { Audit } from 'lighthouse';
import {
  createErrorResult,
  createNotApplicableResult,
  createValueResult,
  getLoadingExperience,
  isResultsInField,
} from '../utils/audit-helpers';

module.exports = class CLSOriginAudit extends Audit {
  static get meta() {
    return {
      id: 'crux-cls-origin',
      title: 'Cumulative Layout Shift (Origin)',
      description:
        'Cumulative Layout Shift (CLS) measures visual stability, and it helps quantify how often users experience unexpected layout shifts. The value is 75th percentile of the origin traffic. [Learn more about CLS](https://web.dev/cls/)',
      scoreDisplayMode: 'numeric',
      requiredArtifacts: ['URL', 'settings'],
    };
  }

  static async audit(artifacts: LH.Artifacts, context: LH.Audit.Context) {
    try {
      const cruxResponse = await getLoadingExperience(artifacts, context, false);
      if (!isResultsInField(cruxResponse.record)) return createNotApplicableResult(CLSOriginAudit.meta.title);
      return createValueResult(cruxResponse.record.metrics.cumulative_layout_shift, 'cls');
    } catch (err) {
      return createErrorResult(err);
    }
  }
};
