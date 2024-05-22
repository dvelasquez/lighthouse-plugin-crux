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

export default class INPOriginAudit extends Audit {
  
  static get meta() {
    return {
      id: 'crux-inp-origin',
      title: 'Interaction to Next Paint (Origin)',
      description:
        'Interaction to Next Paint (INP) is a stable Core Web Vital metric that assesses page responsiveness using data from the Event Timing API. [Learn more about CLS](https://web.dev/inp/)',
      scoreDisplayMode: 'numeric' as ScoreDisplayMode,
      requiredArtifacts: ['URL', 'settings'] as LH.Audit.Meta['requiredArtifacts'],
    };
  }

  static async audit(artifacts: Artifacts, context: LH.Audit.Context) {
    try {
      const cruxResponse = await getLoadingExperience(artifacts, context, false);
      if (!isResultsInField(cruxResponse.record)) return createNotApplicableResult(INPOriginAudit.meta.title);
      return createValueResult(cruxResponse.record.metrics.interaction_to_next_paint, 'inp');
    } catch (err) {
      return createErrorResult(err);
    }
  }
};
