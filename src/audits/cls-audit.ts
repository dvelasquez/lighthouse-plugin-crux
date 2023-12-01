import { Audit } from 'lighthouse';
import type { Artifacts } from 'lighthouse';
import type { ScoreDisplayMode } from 'lighthouse/types/lhr/audit-result.js';
import * as LH from 'lighthouse/types/lh.js';
import {
  createErrorResult,
  createNotApplicableResult,
  createValueResult,
  getLoadingExperience,
  isResultsInField,
} from '../utils/audit-helpers.js';

export default class CLSAudit extends Audit {
  
  static get meta() {
    const requiredArtifacts: Array<keyof Artifacts> = ['URL', 'settings'];
    return {
      id: 'crux-cls',
      title: 'Cumulative Layout Shift (Url)',
      description:
        'Cumulative Layout Shift (CLS) measures visual stability, and it helps quantify how often users experience unexpected layout shifts. The value is 75th percentile of the origin traffic. [Learn more about CLS](https://web.dev/cls/)',
      scoreDisplayMode: 'numeric' as ScoreDisplayMode,
      requiredArtifacts,
    };
  }

  static async audit(artifacts: Artifacts, context: LH.Audit.Context) {
    try {
      const cruxResponse = await getLoadingExperience(artifacts, context, true);
      if (!isResultsInField(cruxResponse.record)) return createNotApplicableResult(CLSAudit.meta.title);
      return createValueResult(cruxResponse.record.metrics.cumulative_layout_shift, 'cls');
    } catch (err) {
      return createErrorResult(err);
    }
  }
};
