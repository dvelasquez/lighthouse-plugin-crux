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

export default class INPAudit extends Audit {
  
  static get meta() {
    const requiredArtifacts: Array<keyof Artifacts> = ['URL', 'settings'];
    return {
      id: 'crux-inp',
      title: 'Interaction to Next Paint (Url)',
      description:
        'Interaction to Next Paint (INP) is a stable Core Web Vital metric that assesses page responsiveness using data from the Event Timing API. [Learn more about CLS](https://web.dev/inp/)',
      scoreDisplayMode: 'numeric' as ScoreDisplayMode,
      requiredArtifacts,
    };
  }

  static async audit(artifacts: Artifacts, context: LH.Audit.Context) {
    try {
      const cruxResponse = await getLoadingExperience(artifacts, context, true);
      if (!isResultsInField(cruxResponse.record)) return createNotApplicableResult(INPAudit.meta.title);
      return createValueResult(cruxResponse.record.metrics.interaction_to_next_paint, 'inp');
    } catch (err) {
      return createErrorResult(err);
    }
  }
};
