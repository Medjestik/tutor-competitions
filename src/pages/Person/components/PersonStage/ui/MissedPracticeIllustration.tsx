import type { FC } from 'react';

const MissedPracticeIllustration: FC<{ kind: 'hourglass' | 'sad' | 'stars' }> = ({ kind }) => (
  <svg className={`person-stage__missed-illustration person-stage__missed-illustration_${kind}`} viewBox='0 0 240 240' aria-hidden='true'>
    {kind === 'hourglass' ? (
      <g fill='none' stroke='#4098df' strokeWidth='7' strokeLinecap='round' strokeLinejoin='round'>
        <path d='M120 20a100 100 0 1 0 100 100' />
        <path d='M120 20a100 100 0 0 1 100 100' strokeDasharray='7 8' />
        <path d='m105 8 16 12-14 15' />
        <rect x='76' y='53' width='88' height='15' rx='3' fill='#bcdcff' />
        <rect x='76' y='172' width='88' height='15' rx='3' fill='#bcdcff' />
        <path d='M83 68v16c0 12 17 22 30 34 4 4 4 7 0 11-13 12-30 22-30 35v8h74v-8c0-13-17-23-30-35-4-4-4-7 0-11 13-12 30-22 30-34V68' />
        <path d='M99 94h42l-21 19zM98 157h44v15H98z' fill='#bcdcff' stroke='none' />
        <path d='M120 133v3m0 11v3' />
      </g>
    ) : kind === 'stars' ? (
      <g stroke='#000' strokeWidth='7' strokeLinecap='round' strokeLinejoin='round'>
        <path d='M120 150v65M95 215q-3-33-19-49M145 215q3-33 19-49' fill='none' />
        <path d='m120 24 8 17 19 3-14 13 3 19-16-9-17 9 4-19-14-13 19-3zM65 80l7 14 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2zM175 80l7 14 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z' fill='#ffe266' />
        <path d='M72 43h13m-6-6v12M174 32h13m-6-6v12' fill='none' />
      </g>
    ) : (
      <g fill='none' stroke='#000' strokeWidth='10' strokeLinecap='round'>
        <circle cx='120' cy='120' r='91' />
        <path d='M72 114q10 12 20 0M148 114q10 12 20 0M85 169c12-30 58-30 70 0' />
      </g>
    )}
  </svg>
);

export default MissedPracticeIllustration;
