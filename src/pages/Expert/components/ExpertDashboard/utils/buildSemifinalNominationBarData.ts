import type { ISemifinalParticipant, TNominationMap } from '../interface/interface';

import { knownUniversities } from './buildBarData';
import type { INominationBarItem } from './buildNominationBarData';
import { nominationBarTotal } from './buildNominationBarData';

export type TSemifinalBarMode = 'submitted' | 'in_progress';

export const buildSemifinalNominationBarData = (
  participants: ISemifinalParticipant[],
  mode: TSemifinalBarMode,
  nominationMap: TNominationMap,
): INominationBarItem[] => {
  const filtered = participants.filter((participant) => {
    if (participant.nomination == null) return false;
    if (mode === 'submitted') {
      return participant.secondStageStatus === 'submitted';
    }
    return participant.secondStageStatus === 'in_progress';
  });

  const shortNameFromOrg = (org: string): string => {
    const known = knownUniversities.find((item) => item.name === org);
    if (known) return known.shortName;
    if (org.length <= 16) return org;
    return `${org.slice(0, 14)}…`;
  };

  const byNomination = new Map<
    number,
    Map<string, { name: string; shortName: string; participants: ISemifinalParticipant[] }>
  >();

  Object.keys(nominationMap).forEach((idStr) => {
    byNomination.set(Number(idStr), new Map());
  });

  filtered.forEach((participant) => {
    const nominationId = Number(participant.nomination);
    if (!nominationMap[nominationId]) return;

    const org = (participant.educational_organization || '').trim() || 'Не указан';
    let uniMap = byNomination.get(nominationId);
    if (!uniMap) {
      uniMap = new Map();
      byNomination.set(nominationId, uniMap);
    }

    let bucket = uniMap.get(org);
    if (!bucket) {
      bucket = {
        name: org,
        shortName: shortNameFromOrg(org),
        participants: [],
      };
      uniMap.set(org, bucket);
    }
    bucket.participants.push(participant);
  });

  return Array.from(byNomination.entries())
    .map(([nominationId, uniMap]) => ({
      nominationId,
      nominationName: nominationMap[nominationId],
      universities: Array.from(uniMap.values()),
    }))
    .sort(
      (a, b) =>
        nominationBarTotal(a) - nominationBarTotal(b) ||
        a.nominationName.localeCompare(b.nominationName, 'ru'),
    );
};
