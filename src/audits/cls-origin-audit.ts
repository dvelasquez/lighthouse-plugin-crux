import { Audit, Artifacts } from 'lighthouse';
import * as LH from 'lighthouse/types/lh.js';
import {
  createErrorResult,
  createNotApplicableResult,
  createValueResult,
  getLoadingExperience,
  isResultsInField,
} from '../utils/audit-helpers.js';
export default class CLSOriginAudit extends Audit {
  static get meta() {
    return {
      id: 'crux-cls-origin',
      title: 'Cumulative Layout Shift (Origin)',
      description:
        'Cumulative Layout Shift (CLS) measures visual stability, and it helps quantify how often users experience unexpected layout shifts. The value is 75th percentile of the origin traffic. [Learn more about CLS](https://web.dev/cls/)',
      scoreDisplayMode: 'numeric' as LH.Audit.ScoreDisplayMode,
      requiredArtifacts: ['URL', 'settings'] as LH.Audit.Meta['requiredArtifacts'],
    };
  }

  static async audit(artifacts: Artifacts, context: LH.Audit.Context) {
    try {
      const cruxResponse = await getLoadingExperience(artifacts, context, false);
      if (!isResultsInField(cruxResponse.record)) return createNotApplicableResult(CLSOriginAudit.meta.title);
      return createValueResult(cruxResponse.record.metrics.cumulative_layout_shift, 'cls');
    } catch (err) {
      return createErrorResult(err);
    }
  }
};
