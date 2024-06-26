/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
import * as LH from 'lighthouse/types/lh.js'
export default {
  audits: [
    { path: 'lighthouse-plugin-crux/lib/audits/cls-audit.js' },
    { path: 'lighthouse-plugin-crux/lib/audits/cls-origin-audit.js' },
    { path: 'lighthouse-plugin-crux/lib/audits/fcp-audit.js' },
    { path: 'lighthouse-plugin-crux/lib/audits/fcp-origin-audit.js' },
    { path: 'lighthouse-plugin-crux/lib/audits/lcp-audit.js' },
    { path: 'lighthouse-plugin-crux/lib/audits/lcp-origin-audit.js' },
    { path: 'lighthouse-plugin-crux/lib/audits/inp-audit.js' },
    { path: 'lighthouse-plugin-crux/lib/audits/inp-origin-audit.js' },
  ],
  groups: {
    page: {
      title: 'Page summary',
    },
    origin: {
      title: 'Origin summary',
    },
  },
  category: {
    title: 'CrUX Field Performance',
    description:
      'These metrics show the performance of the page over the past 28 days. Data is collected anonymously in for real-world Chrome users and provided by Chrome UX Report. [Learn More](https://developers.google.com/web/tools/chrome-user-experience-report/)',
    auditRefs: [
      // Now every metric is weighted equally, based on idea to pass all CWV.
      //
      // alternative weights (based on Lighthouse):
      // 15 (FCP)
      // 25 + 15 = 40 (SI + LCP)
      // 15 + 25 = 40 (TTI + TBT)
      // 5 (CLS)
      { id: 'crux-fcp', weight: 0, group: 'page' },
      { id: 'crux-lcp', weight: 1, group: 'page' },
      { id: 'crux-cls', weight: 1, group: 'page' },
      { id: 'crux-inp', weight: 1, group: 'page' },
      { id: 'crux-fcp-origin', weight: 0, group: 'origin' },
      { id: 'crux-lcp-origin', weight: 0, group: 'origin' },
      { id: 'crux-cls-origin', weight: 0, group: 'origin' },
      { id: 'crux-inp-origin', weight: 0, group: 'origin' },
    ],
  },
} as LH.Config.Plugin;
