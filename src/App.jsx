import React, { useEffect, useMemo, useRef, useState } from 'react';

const STORAGE_KEY = 'bio-ai-courseware-state-v2';
const API_URL = '/.netlify/functions/save-answer';

const topTabs = [
  { id: 'home', label: '홈' },
  { id: 'pretest', label: '사전 검사' },
  { id: 'lesson1', label: '1차시' },
  { id: 'lesson2', label: '2차시' },
  { id: 'lesson3', label: '3차시' },
  { id: 'posttest', label: '사후 검사' },
  { id: 'progress', label: '학습 변화 확인' }
];

const lessonSubTabsMap = {
  lesson1: [
    { id: 'ai', label: 'AI 보조교사' },
    { id: 'goal', label: '학습목표' },
    { id: 'video', label: '영상' },
    { id: 'icebreak', label: '생각열기' },
    { id: 'experiment', label: '실험안내' },
    { id: 'predict', label: '예상하기' },
    { id: 'observe', label: '관찰하기' },
    { id: 'explain', label: '설명하기' },
    { id: 'summary', label: '정리하기' }
  ],
  lesson2: [
    { id: 'ai', label: 'AI 보조교사' },
    { id: 'review', label: '이전 차시 학습 확인' },
    { id: 'goal', label: '학습목표' },
    { id: 'icebreak', label: '생각열기' },
    { id: 'experiment', label: '실험안내' },
    { id: 'predict', label: '예상하기' },
    { id: 'observe', label: '관찰하기' },
    { id: 'explain', label: '설명하기' },
    { id: 'summary', label: '정리하기' }
  ],
  lesson3: [
    { id: 'ai', label: 'AI 보조교사' },
    { id: 'review', label: '이전 차시 학습 확인' },
    { id: 'goal', label: '학습목표' },
    { id: 'icebreak', label: '생각열기' },
    { id: 'experiment', label: '실험안내' },
    { id: 'predict', label: '예상하기' },
    { id: 'observe', label: '관찰하기' },
    { id: 'explain', label: '설명하기' },
    { id: 'summary', label: '정리하기' }
  ]
};

const GPT_LINKS = {
  lesson1: 'https://chatgpt.com/g/g-699e765567a48191b4ecb5464b129c6e-gigwangyeyi-tonghabjeog-jagyong-1casi-sohwagye-ai-bojo-gyosa',
  lesson2: 'https://chatgpt.com/g/g-699e8d3707c88191966a6b874d9a9680-gigwangyeyi-tonghabjeog-jagyong-2casi-sunhwangyewa-hoheubgye-ai-bojo-gyosa',
  lesson3: 'https://chatgpt.com/g/g-699e998e40b8819198ca1669c3f11c05-gigwangyeyi-tonghabjeog-jagyong-3casi-baeseolgye-ai-bojo-gyosa'
};

const teacherSectionOptions = [
  { id: 'icebreak', label: '생각열기' },
  { id: 'predict', label: '예상하기' },
  { id: 'observe', label: '관찰하기' },
  { id: 'explain', label: '설명하기' },
  { id: 'summary', label: '정리하기' }
];

const preSurveyForms = [
  {
    key: 'conceptPre',
    title: '기관계 개념 사전 검사',
    description: '1차시 수업 전 기관계 관련 사전 개념 검사를 실시하는 영역입니다.',
    openUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeOZ6vmd6q3VrnmjTpkJ4xJTUaIJx_qhkBLdVLvS1CnHpWBOg/viewform',
    embedUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeOZ6vmd6q3VrnmjTpkJ4xJTUaIJx_qhkBLdVLvS1CnHpWBOg/viewform?embedded=true'
  },
  {
    key: 'motivationPre',
    title: '과학 활동 동기 사전 검사',
    description: 'AI 코스웨어 활용 전 과학 활동에 대한 동기 수준을 확인하는 검사입니다.',
    openUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc_eqGWHYL4Ia947Sjl7DBW-wxaAOwoYHGT5eOTeY65aVlKGg/viewform',
    embedUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc_eqGWHYL4Ia947Sjl7DBW-wxaAOwoYHGT5eOTeY65aVlKGg/viewform?embedded=true'
  },
  {
    key: 'taskPre',
    title: '과제집착 사전 검사',
    description: 'AI 코스웨어 활용 전 과제 수행 과정에서의 집착 및 지속성을 확인하는 검사입니다.',
    openUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScgSrR6uZPNR_LVf2jmOQA3haEI4KSrkLYKGkyuQz2uxn7UhQ/viewform',
    embedUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScgSrR6uZPNR_LVf2jmOQA3haEI4KSrkLYKGkyuQz2uxn7UhQ/viewform?embedded=true'
  }
];

const postSurveyForms = [
  {
    key: 'conceptPost',
    title: '기관계 개념 사후 검사',
    description: '3차시 수업 후 기관계 관련 사후 개념 검사를 실시하는 영역입니다.',
    openUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdt9GfLprmm4oTSS-7PdsxT34bx4o5UlUSz-Xi5TJb0ocQUjA/viewform',
    embedUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdt9GfLprmm4oTSS-7PdsxT34bx4o5UlUSz-Xi5TJb0ocQUjA/viewform?embedded=true'
  },
  {
    key: 'motivationPost',
    title: '과학 활동 동기 사후 검사',
    description: 'AI 코스웨어 활용 후 과학 활동에 대한 동기 변화를 확인하는 검사입니다.',
    openUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScGZSFcyAzUNhffsPcVFkBqG49UX3Ap8oKMM8nwGkHmyNQnRQ/viewform',
    embedUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScGZSFcyAzUNhffsPcVFkBqG49UX3Ap8oKMM8nwGkHmyNQnRQ/viewform?embedded=true'
  },
  {
    key: 'taskPost',
    title: '과제집착 사후 검사',
    description: 'AI 코스웨어 활용 후 과제 수행 과정에서의 집착 및 지속성 변화를 확인하는 검사입니다.',
    openUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc324hyh92jaYiQ3srwrCGi80MvOGmnEuKLOcnNLsDsmtn8Eg/viewform',
    embedUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc324hyh92jaYiQ3srwrCGi80MvOGmnEuKLOcnNLsDsmtn8Eg/viewform?embedded=true'
  }
];

const EMPTY_DATASET_PAYLOAD = { dataset: '', sheetName: '', count: 0, data: [] };

const SCIENTIFIC_CONCEPT_QUESTIONS = [
  '소화 기관에는 입, 식도, 위, 작은 창자, 큰 창자, 항문 등이 있다.',
  '심장은 우리 몸에 필요한 영양소, 산소를 온몸으로 운반한다.',
  "몸 밖에서 들어온 산소를 받아들이고 몸속에서 생긴 이산화탄소를 몸 밖으로 내보내는 기관은 폐이다.",
  '노폐물을 몸 밖으로 내보내는 과정을 배설이라고 한다.'
];

const QUESTION_TO_LESSON_RAW = {
  '소화는 음식으로부터 에너지를 방출하는 과정이다.': 'lesson1',
  '소화 효소는 세포로 구성되어 있다.': 'lesson1',
  '이자액에 의해 음식물이 소화되는 곳은 이자이다.': 'lesson1',
  '소화 기관에는 입, 식도, 위, 작은 창자, 큰 창자, 항문 등이 있다.': 'lesson1',
  '소화기관에는 입, 식도, 위, 작은 창자, 큰 창자, 항문 등이 있다.': 'lesson1',

  '혈액은 단순히 빨간 액체이다.': 'lesson2',
  '심장은 우리 몸에 필요한 영양소, 산소를 온몸으로 운반한다.': 'lesson2',
  '심장은 몸의 왼쪽에 있다.': 'lesson2',
  '모든 동맥에서는 산소를 많이 포함한 혈액만 흐른다.': 'lesson2',
  '심장은 공기를 펌프질한다.': 'lesson2',
  '심장은 필요한 혈액량을 판단하여 박동수를 조절한다.': 'lesson2',
  '심장이 피를 정화한다.': 'lesson2',
  '몸 전체에 공기 튜브가 있다.': 'lesson2',
  "몸 밖에서 들어온 산소를 받아들이고 몸속에서 생긴 이산화탄소를 몸 밖으로 내보내는 기관은 폐이다.": 'lesson2',
  "몸 밖에서 들어온 산소를 받아들이고 몸속에서 생긴 이산화탄소를 몸 밖으로 내보내는 기관은 '폐'이다.": 'lesson2',
  '호흡은 폐에서만 일어난다.': 'lesson2',
  '들이마신 공기의 성분은 대부분 산소이고, 내쉰 공기의 성분은 대부분 이산화탄소이다.': 'lesson2',
  '들숨의 성분은 대부분 산소이고, 날숨의 성분은 대부분 이산화탄소이다.': 'lesson2',
  '공기는 폐에서 바로 심장으로 들어간다.': 'lesson2',

  '노폐물을 몸 밖으로 내보내는 과정을 배설이라고 한다.': 'lesson3',
  '배설은 대변을 배출하는 것이다.': 'lesson3',
  '오줌을 형성하는 곳은 방광이다.': 'lesson3',
  '방광은 오줌을 걸러내는 기관이다.': 'lesson3'
};

function normalizeQuestionName(value) {
  return String(value ?? '')
    .trim()
    .replace(/["'“”‘’]/g, '')
    .replace(/[\.。,，]/g, '')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

const QUESTION_TO_LESSON = Object.fromEntries(
  Object.entries(QUESTION_TO_LESSON_RAW).map(([question, lessonKey]) => [normalizeQuestionName(question), lessonKey])
);

function isScientificConceptQuestion(questionName) {
  const normalized = normalizeQuestionName(questionName);
  return SCIENTIFIC_CONCEPT_QUESTIONS.some((question) => normalizeQuestionName(question) === normalized);
}

function isIncreaseBetterQuestion(questionName) {
  return isScientificConceptQuestion(questionName);
}

function getLessonKeyFromQuestion(questionName) {
  return QUESTION_TO_LESSON[normalizeQuestionName(questionName)] || null;
}

function parseScore(value) {
  if (value == null || value === '') return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const match = String(value).replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function parseDate(value) {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;

  const raw = String(value).trim();
  if (!raw) return null;

  const normalized = raw
    .replace(/\.\s*/g, '-')
    .replace(/\//g, '-')
    .replace(/\s+/g, ' ');

  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value) {
  const date = parseDate(value);
  return date ? date.toLocaleString('ko-KR') : '-';
}

function extractRows(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.rows)) return payload.rows;
  if (Array.isArray(payload.items)) return payload.items;
  return [];
}

function normalizePayload(payload, dataset) {
  const data = extractRows(payload);
  return {
    dataset: payload?.dataset || dataset,
    sheetName: payload?.sheetName || payload?.sheet || '',
    count: typeof payload?.count === 'number' ? payload.count : data.length,
    data
  };
}

function findColumn(row, keywords = []) {
  const keys = Object.keys(row || {});
  return (
    keys.find((key) => keywords.some((keyword) => normalizeQuestionName(key).includes(normalizeQuestionName(keyword)))) ||
    null
  );
}

function pickLatestMatch(rows, nameCol, studentCol, inputName, inputStudentId, timestampCol = '타임스탬프') {
  const matches = rows.filter((row) => {
    const rowName = String(row?.[nameCol] ?? '').trim();
    const rowStudentId = String(row?.[studentCol] ?? '').trim();
    return rowName === inputName && rowStudentId === inputStudentId;
  });

  if (!matches.length) return null;

  return [...matches].sort((a, b) => {
    const ad = parseDate(a?.[timestampCol] ?? a?.['타임스탬프']);
    const bd = parseDate(b?.[timestampCol] ?? b?.['타임스탬프']);
    if (!ad && !bd) return 0;
    if (!ad) return 1;
    if (!bd) return -1;
    return bd - ad;
  })[0];
}

function average(values) {
  if (!values.length) return 0;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
}

function classifyChange(questionName, preScore, postScore) {
  if (preScore === null || postScore === null) return '동일';
  if (postScore === preScore) return '동일';
  const increaseIsBetter = isIncreaseBetterQuestion(questionName);
  const improved = increaseIsBetter ? postScore > preScore : postScore < preScore;
  return improved ? '개선' : '심화';
}

function getJudgementTone(change) {
  if (change === '개선') return 'tone-up';
  if (change === '심화') return 'tone-down';
  return 'tone-neutral';
}

function getCategoryStatusLabel(category, status) {
  if (status === '동일') return '동일';

  if (category === '과학적 개념') {
    if (status === '개선') return '과학적 개념 확신도 증가';
    if (status === '심화') return '과학적 개념 확신도 감소';
  }

  if (category === '오개념') {
    if (status === '개선') return '오개념 확신도 감소';
    if (status === '심화') return '오개념 확신도 증가';
  }

  return status;
}

function getSimpleStatusLabel(status) {
  if (status === '개선') return '증가';
  if (status === '심화') return '감소';
  return '동일';
}

function getMisconceptionMeaningLabel(statusKey) {
  if (statusKey === 'decrease') return '오개념 확신도 감소';
  if (statusKey === 'increase') return '오개념 확신도 증가';
  return '동일';
}

function getDirectionScore(questionName, preScore, postScore) {
  if (preScore === null || postScore === null) return 0;
  const delta = Number((postScore - preScore).toFixed(2));
  return isIncreaseBetterQuestion(questionName) ? delta : -delta;
}

function buildCategorySummary(items = [], category) {
  const filteredItems = items.filter((item) => item.category === category);
  const preScores = filteredItems.map((item) => item.preScore).filter((score) => score !== null);
  const postScores = filteredItems.map((item) => item.postScore).filter((score) => score !== null);
  const preAvg = average(preScores);
  const postAvg = average(postScores);

  return {
    key: category,
    label: category,
    questionCount: filteredItems.length,
    preAvg,
    postAvg,
    deltaAvg: Number((postAvg - preAvg).toFixed(2)),
    improved: filteredItems.filter((item) => item.judgement === '개선').length,
    same: filteredItems.filter((item) => item.judgement === '동일').length,
    deepened: filteredItems.filter((item) => item.judgement === '심화').length,
    items: filteredItems
  };
}

function buildWeaknessByLesson(items = []) {
  const result = {
    lesson1: [],
    lesson2: [],
    lesson3: []
  };

  items.forEach((item) => {
    if (item.preScore === null || item.postScore === null) return;

    const isScientific = isScientificConceptQuestion(item.question);
    const isWeak = isScientific ? item.postScore < item.preScore || item.postScore <= 2 : item.postScore > item.preScore;

    if (!isWeak) return;

    const lessonKey = item.lessonKey || getLessonKeyFromQuestion(item.question);
    if (!lessonKey || !result[lessonKey]) return;

    result[lessonKey].push({
      question: item.question,
      pre: item.preScore,
      post: item.postScore,
      type: isScientific ? '과학적 개념' : '오개념'
    });
  });

  return result;
}

function getRecommendedLessons(weaknessByLesson) {
  return Object.entries(weaknessByLesson)
    .map(([lessonKey, items]) => ({ lessonKey, count: items.length }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count || a.lessonKey.localeCompare(b.lessonKey));
}

function drawArrow(ctx, fromX, fromY, toX, toY) {
  const headlen = 10;
  const angle = Math.atan2(toY - fromY, toX - fromX);

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.lineTo(
    toX - headlen * Math.cos(angle - Math.PI / 6),
    toY - headlen * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headlen * Math.cos(angle + Math.PI / 6),
    toY - headlen * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();
}

const detailedLessonData = {
  lesson1: {
    title: '1차시: 소화계',
    summary:
      '소화계의 구조와 기능을 관찰하고, 세포 호흡의 관점에서 소화계의 역할을 이해하는 POE 기반 학습 영역입니다.',
    goalBadge: '1차시 학습목표',
    goals: [
      '침에 있는 소화 효소에 의해 영양소가 분해되는 것을 확인하고 소화계의 작용을 설명할 수 있다.',
      '세포 호흡의 관점에서 소화계의 역할을 이해하고 설명할 수 있다.'
    ],
    videoTitle: '수업 도입 영상',
    videoDescription: '다음 두 영상을 순서대로 시청해 봅시다.',
    videos: [
      {
        title: '영상 1',
        prompt: '마라톤을 하는 선수가 바나나를 보면 어떤 반응을 보일까요? 아래 영상을 통해 확인해봅시다.',
        embedUrl: 'https://www.youtube.com/embed/6_dwzfdbgNk'
      },
      {
        title: '영상 2',
        prompt: '마라톤 선수가 경기 중 바나나를 먹는 것은 어떤 도움이 될까요? 아래 영상을 시청한 후, 생각 열기 단계로 넘어가 봅시다.',
        embedUrl: 'https://www.youtube.com/embed/CAVuRsz3fxw'
      }
    ],
    icebreakQuestions: [
      '마라톤 선수가 먹은 바나나가 어떻게 근육을 움직이는 에너지가 될까요?',
      '소화되고 남은 물질은 어떻게 우리 몸을 빠져나올까요?'
    ],
    summaryQuestions: [
      '세포 호흡의 관점에서 소화계가 하는 역할은?',
      '세포 호흡 공장이 멈추지 않고 계속 돌아가려면 소화계는 어떤 도움을 주어야 할지 적어봅시다.',
      '오늘 수업을 통해 생각이 변화된 것이 있다면 자유롭게 적어주세요.'
    ],
    experimentBanner: '실험 과정 영상이 추후 연결될 예정입니다.',
    experiments: [
      {
        name: '소화의 필요성',
        materials: [
          '비커',
          '시험관',
          '스포이트',
          '셀로판 튜브',
          '집게',
          '증류수',
          '포도당 용액',
          '녹말 용액',
          '침 용액',
          '아이오딘-아이오딘화 칼륨 용액',
          '베네딕트 용액',
          '핫플레이트',
          '온도계'
        ],
        steps: [
          '물 10mL를 2분 동안 입에 물고 있다가 비커에 뱉어 침 용액을 만든다.',
          '셀로판 튜브에 각각 포도당 용액, 녹말 용액, 녹말 용액과 침 용액을 섞은 용액을 넣고 양 끝을 막은 뒤 증류수가 든 비커에 담근다.',
          '비커 속 증류수의 온도를 37℃ 정도로 유지한 채 20~30분간 기다린다.',
          '녹말 튜브를 담가둔 용액을 작은 비커에 옮겨 담는다.',
          '비커에 아이오딘-아이오딘화 칼륨 용액을 넣고 변화를 관찰한다.',
          '포도당 튜브를 담가둔 용액을 시험관에 옮겨 담는다.',
          '시험관에 베네딕트 용액을 넣는다.',
          '물중탕으로 시험관을 가열하고 변화를 관찰한다.',
          '녹말+침 용액 튜브를 담가둔 용액을 각각 비커와 시험관에 옮겨 담는다.',
          '아이오딘 반응과 베네딕트 반응을 각각 수행한다.'
        ]
      }
    ],
    reviewCards: [],
    responseSections: {
      icebreak: {
        title: '생각열기',
        description: '질문에 대해 자신의 생각을 정리해 입력해 봅시다.',
        groups: [
          {
            title: '생각열기 질문',
            badgePrefix: '질문',
            prompts: [
              '마라톤 선수가 먹은 바나나가 어떻게 근육을 움직이는 에너지가 될까요?',
              '소화되고 남은 물질은 어떻게 우리 몸을 빠져나올까요?'
            ]
          }
        ],
        saveLabel: '생각열기 저장'
      },
      predict: {
        title: '예상하기',
        description: '실험을 수행하기 전에 아래 질문에 대한 자신의 예상을 적어 봅시다.',
        groups: [
          {
            title: '예상 질문',
            badgePrefix: '예상 질문',
            prompts: [
              '녹말-셀로판 튜브를 담근 비커의 아이오딘-아이오딘화 칼륨 용액과의 반응 결과는 어떠할까요? 그렇게 생각한 이유도 함께 적어봅시다.',
              '포도당-셀로판 튜브를 담근 비커의 베네딕트 반응 결과는 어떠할까요? 그렇게 생각한 이유도 함께 적어봅시다.',
              '녹말 + 침 용액 셀로판 튜브를 담가둔 비커의 아이오딘-아이오딘화 칼륨 용액과 베네딕트 반응 결과는 각각 어떠할까요? 그렇게 생각한 이유도 함께 적어봅시다.',
              '소화 과정은 에너지 생성 과정일까요? 여러분의 생각을 자유롭게 적어봅시다.'
            ]
          }
        ],
        saveLabel: '예상하기 저장'
      },
      observe: {
        title: '관찰하기',
        description: '실험 과정에서 관찰한 결과를 차례대로 기록해 봅시다.',
        groups: [
          {
            title: '관찰 기록',
            badgePrefix: '관찰',
            prompts: [
              '녹말-셀로판 튜브를 담근 비커의 아이오딘-아이오딘화 칼륨 용액과의 반응 결과',
              '포도당-셀로판 튜브를 담근 비커의 베네딕트 반응 결과',
              '녹말 + 침 용액 셀로판 튜브를 담가둔 비커의 아이오딘-아이오딘화 칼륨 용액과 베네딕트 반응 결과',
              '소화 과정에서 에너지가 발생하였나요?'
            ]
          }
        ],
        saveLabel: '관찰하기 저장'
      },
      explain: {
        title: '설명하기',
        description: '실험 결과를 바탕으로 자신의 설명을 정리해 봅시다.',
        groups: [
          {
            title: '설명 질문',
            badgePrefix: '설명 질문',
            prompts: [
              '각각의 튜브에서 나타난 색 변화가 어떤 물질의 이동 때문인지 설명해 봅시다.',
              '이번 실험에서 관찰된 과정이 에너지를 생성하는 과정이라고 볼 수 있을까요?',
              '실험 과정에서 녹말 용액과 침을 함께 넣은 용액에서 검출된 물질은 무엇인가요? 침의 어떤 성분에 의해 이러한 결과가 나타났을까요? 그리고 그 성분이 생물체의 ‘세포’ 혹은 ‘물질’인가요?',
              '셀로판 튜브는 우리 몸의 기관 중 어느 것에 해당할지 적어보고, 셀로판 튜브를 통과한 영양소는 우리 몸에서 어느 곳으로 이동할지, 또, 셀로판 튜브 안에 남아서 통과하지 못한 물질은 우리 몸 안으로 들어왔다고 할 수 있는지 적어봅시다.',
              '우리 몸에서 침과 같이 소화를 도와주는 물질이 분비되는 곳은 어느 기관이 있나요? 그리고 그 기관에서 직접적으로 소화 과정을 수행하는지 적어봅시다.'
            ]
          }
        ],
        saveLabel: '설명하기 저장'
      },
      summary: {
        title: '정리하기',
        description: '이번 차시에서 배운 핵심 내용을 정리하고, 세포 호흡의 관점에서 기관계의 역할을 정리해 봅시다.',
        groups: [
          {
            title: '정리하기',
            badgePrefix: '정리',
            prompts: [
              '세포 호흡의 관점에서 소화계가 하는 역할은?',
              '세포 호흡 공장이 멈추지 않고 계속 돌아가려면 소화계는 어떤 도움을 주어야 할지 적어봅시다.',
              '오늘 수업을 통해 생각이 변화된 것이 있다면 자유롭게 적어주세요.'
            ]
          }
        ],
        saveLabel: '정리하기 저장'
      }
    },
    aiTitle: '1차시 AI 보조교사',
    aiDescription: '1차시 소화계 학습을 도와주는 AI 보조교사 영역입니다.'
  },
  lesson2: {
    title: '2차시: 순환계·호흡계',
    summary:
      '순환계와 호흡계의 통합적 작용을 관찰하고, 세포 호흡의 관점에서 두 기관계의 역할을 이해하는 POE 기반 학습 영역입니다.',
    goalBadge: '2차시 학습목표',
    goals: [
      '운동 전후 심박수 변화를 통해 순환계가 신체 활동 수준에 따라 조절됨을 이해하고 세포 호흡의 관점에서 순환계의 역할을 설명할 수 있다.',
      '운동 전후 날숨 속 이산화탄소 배출량의 차이를 관찰하여 세포호흡과 기체 교환의 관계를 이해하고 설명할 수 있다.'
    ],
    reviewCards: [
      '1차시에서 학습한 소화계의 핵심 내용을 확인하는 영역입니다.',
      '소화 효소에 의해 영양소가 분해되는 과정과 물질 이동을 다시 떠올려 봅시다.',
      '소화계가 세포 호흡에 필요한 영양소 공급과 어떻게 연결되는지 복습해 봅시다.'
    ],
    icebreakQuestions: [
      '마라톤 선수들은 어떻게 지치지 않고 계속해서 달릴 수 있을까요?',
      '위 그림을 보고, 경기 중인 마라톤 선수의 몸속에서 혈액이 어떻게 이동할지 화살표 방향을 떠올려 설명해 보세요.',
      '모식도에 나와 있는 각 혈관의 명칭과 그 혈관을 지나는 혈액의 산소의 양도 함께 표시해 봅시다.'
    ],
    summaryQuestions: [
      '세포 호흡의 관점에서 순환계가 하는 역할은?',
      '세포 호흡의 관점에서 호흡계가 하는 역할은?',
      '세포 호흡 공장이 멈추지 않고 계속 돌아가려면 순환계와 호흡계는 각각 어떤 도움을 주어야 할지 적어봅시다.',
      '오늘 수업을 통해 생각이 변화된 것이 있다면 자유롭게 적어주세요.'
    ],
    experimentBanner: '실험 과정 카드뉴스 또는 영상이 추후 연결될 예정입니다.',
    experiments: [
      {
        name: '실험 1. 신체 활동에 따른 심박수 변화 측정',
        materials: ['스마트폰(심박수 측정 앱 설치)', '초시계'],
        steps: [
          '의자에 편안히 앉아 2~3분간 휴식한 뒤 스마트폰 앱으로 안정 시 BPM을 3회 측정하고 평균을 기록한다.',
          '1분간 격렬한 운동(제자리 뛰기 또는 팔굽혀펴기 등)을 실시한다.',
          '운동 직후 즉시 BPM을 측정하여 기록한다.',
          '운동 종료 3분 후 다시 심박수를 측정하여 기록한다.'
        ],
        notes: ['손가락을 카메라 렌즈에 너무 세게 누르지 않는다.', '측정 중에는 손가락을 움직이지 않는다.']
      },
      {
        name: '실험 2. 운동 전후 들숨과 날숨 속 이산화탄소(CO2) 농도 비교',
        materials: ['BTB 용액', '수산화나트륨(NaOH) 용액', '스포이트', '증류수', '비커', '빨대', '초시계'],
        steps: [
          '두 개의 비커에 증류수 100mL씩 담고 BTB 용액을 3~4방울 떨어뜨린다.',
          'BTB 용액이 파란색이 될 때까지 수산화나트륨 용액을 넣는다.',
          '빨대로 일정한 세기로 숨을 불어넣고 노란색으로 완전히 변할 때까지 시간을 측정한다.',
          '1분간 격렬한 운동 후 다른 비커에서도 동일하게 측정한다.'
        ],
        notes: ['평상시와 운동 후 모두 일정한 세기로 숨을 불어넣는다.', '빨대로 숨을 들이마시지 않도록 주의한다.']
      }
    ],
    responseSections: {
      icebreak: {
        title: '생각열기',
        description: '2차시 학습의 출발점이 되는 질문에 답해 봅시다.',
        groups: [
          {
            title: '생각열기 질문',
            badgePrefix: '질문',
            prompts: [
              '마라톤 선수들은 어떻게 지치지 않고 계속해서 달릴 수 있을까요?',
              '위 그림을 보고, 경기 중인 마라톤 선수의 몸속에서 혈액이 어떻게 이동할지 화살표 방향을 떠올려 설명해 보세요.',
              '모식도에 나와 있는 각 혈관의 명칭과 그 혈관을 지나는 혈액의 산소의 양도 함께 표시해 봅시다.'
            ]
          }
        ],
        saveLabel: '생각열기 저장'
      },
      predict: {
        title: '예상하기',
        description: '순환계와 호흡계 실험 전에 예상한 결과를 기록해 봅시다.',
        groups: [
          {
            title: '순환계 실험',
            badgePrefix: '순환계 질문',
            prompts: [
              '심장 박동이 느껴지는 곳에 손을 대봅시다. 심장은 우리 몸의 어느 부분에 위치하고 있나요?',
              '1분간 격렬하게 운동을 한 직후, 자신의 심박수(BPM)는 안정 시 심박수와 비교하여 얼마나 달라질지 적어봅시다. 그리고 심박수 조절은 어느 기관에서 할지 적어봅시다.',
              '운동을 할 때, 심장 박동의 변화에 따라 혈관에서 흐르는 혈액의 양은 어떻게 변화할까요?',
              '심장에서 폐로 흐르는 혈관에는 산소가 (많은 / 적은) 혈액이 흐를 것이다. 여러분이 생각하는 답을 선택해 보세요.'
            ]
          },
          {
            title: '호흡계 실험',
            badgePrefix: '호흡계 질문',
            prompts: [
              '평상시와 운동 직후, 어느 때에 불어넣은 날숨이 BTB 용액을 더 빨리 노란색으로 변화시킬지, 그 이유와 함께 적어봅시다.',
              '우리 몸에서 호흡은 어디에서 일어날까요?',
              '들숨과 날숨에서 각각 산소와 이산화탄소의 비율은 각각 어떻게 될까요?'
            ]
          }
        ],
        saveLabel: '예상하기 저장'
      },
      observe: {
        title: '관찰하기',
        description: '각 실험에서 측정하거나 관찰한 값을 기록해 봅시다.',
        groups: [
          {
            title: '순환계 실험 결과 관찰',
            badgePrefix: '관찰',
            prompts: [
              '안정 시 심박수 1회',
              '안정 시 심박수 2회',
              '안정 시 심박수 3회',
              '안정 시 평균 심박수',
              '운동 직후 심박수',
              '회복 후 심박수'
            ]
          },
          {
            title: '호흡계 실험 결과 관찰',
            badgePrefix: '관찰',
            prompts: ['평상시 BTB 변색 시간', '운동 직후 BTB 변색 시간']
          }
        ],
        saveLabel: '관찰하기 저장'
      },
      explain: {
        title: '설명하기',
        description: '실험 결과를 토대로 순환계와 호흡계의 역할을 설명해 봅시다.',
        groups: [
          {
            title: '순환계 실험 후',
            badgePrefix: '순환계 설명',
            prompts: [
              '심장 박동이 느껴지는 곳에 손을 대봅시다. 심장은 우리 몸의 어느 부분에 위치하고 있나요?',
              '운동을 하는 과정에서 심박수가 빨라졌을 때, 혈액이 흐르는 속도와 우리 몸 혈액의 전체 양은 각각 어떻게 될까요?',
              '심장에서 폐로 이산화탄소를 운반하는 혈관은 어디일까요? 그리고 그 혈관에 흐르는 산소의 양은 어떠할까요? 그 혈관의 명칭과 함께 생각해 봅시다.',
              '실험 결과를 토대로 안정 시 심박수와 운동 후 심박수, 회복 후 심박수의 변화를 세포 호흡의 관점에서 설명해 봅시다.'
            ]
          },
          {
            title: '호흡계 실험 후',
            badgePrefix: '호흡계 설명',
            prompts: [
              '실험 결과, 어느 비커에서 BTB 용액이 노란색으로 더 빠르게 변하였나요?',
              '우리 몸에서 호흡은 어디에서 일어나는 활동인가요? 호흡이 일어나는 장소에 대해서 적어봅시다.',
              '안정된 상태에서와 운동 후 들숨과 날숨에서 각각 산소와 이산화탄소의 비율은 각각 어떻게 될까요?',
              '우리가 들이마신 공기는 어떤 경로를 통해서 우리 몸 내부로 이동하는 것인지 적어봅시다.'
            ]
          }
        ],
        saveLabel: '설명하기 저장'
      },
      summary: {
        title: '정리하기',
        description: '이번 차시에서 배운 핵심 내용을 정리하고, 세포 호흡의 관점에서 기관계의 역할을 정리해 봅시다.',
        groups: [
          {
            title: '정리하기',
            badgePrefix: '정리',
            prompts: [
              '세포 호흡의 관점에서 순환계가 하는 역할은?',
              '세포 호흡의 관점에서 호흡계가 하는 역할은?',
              '세포 호흡 공장이 멈추지 않고 계속 돌아가려면 순환계와 호흡계는 각각 어떤 도움을 주어야 할지 적어봅시다.',
              '오늘 수업을 통해 생각이 변화된 것이 있다면 자유롭게 적어주세요.'
            ]
          }
        ],
        saveLabel: '정리하기 저장'
      }
    },
    aiTitle: '2차시 AI 보조교사',
    aiDescription: '2차시 순환계·호흡계 학습을 도와주는 AI 보조교사 영역입니다.'
  },
  lesson3: {
    title: '3차시: 배설계',
    summary:
      '배설계의 구조와 역할을 인공 신장 모형 실험으로 탐구하고, 세포 호흡의 관점에서 배설계의 기능을 이해하는 POE 기반 학습 영역입니다.',
    goalBadge: '3차시 학습목표',
    goals: [
      '콩팥의 사구체 여과 과정을 모형화하고, 분자 크기에 따른 선택적 여과 원리를 이해하여 배설 과정을 설명할 수 있다.',
      '세포 호흡의 관점에서 배설계의 역할을 이해하고 설명할 수 있다.'
    ],
    reviewCards: [
      '2차시에서 학습한 순환계와 호흡계의 핵심 내용을 확인하는 영역입니다.',
      '순환계는 세포에 필요한 물질을 운반하고, 호흡계는 기체 교환을 통해 산소와 이산화탄소 이동을 돕습니다.',
      '세포 호흡 결과 생성된 물질이 몸 밖으로 나가기 위해 어떤 기관계가 더 필요할지 떠올려 봅시다.'
    ],
    icebreakQuestions: [
      '마라톤 선수의 오줌에서 요소 농도가 높아지는 현상을 세포 호흡 및 물질의 이동 경로와 관련지어 설명해 봅시다.',
      '세포 호흡의 결과물인 ‘요소’와 같은 노폐물이 혈액에 계속 쌓인다면, 우리 몸 전체에 어떤 문제가 생길까요?',
      '마라톤 선수가 바나나를 먹고 소화 과정을 통해 우리 몸으로 흡수된 영양소가 세포에서 사용되고 생성된 물질은 어떻게 우리 몸을 빠져나올까요?'
    ],
    summaryQuestions: [
      '세포 호흡의 관점에서 배설계가 하는 역할은?',
      '세포 호흡 공장이 멈추지 않고 계속 돌아가려면 배설계는 어떤 도움을 주어야 할지 적어봅시다.',
      '오늘 수업을 통해 생각이 변화된 것이 있다면 자유롭게 적어주세요.'
    ],
    extraInfoItems: [
      '호흡 속도와 심장박동 속도가 빨라져 근육에서 에너지를 효율적으로 얻을 수 있다.',
      '많은 에너지가 소비되므로 일정 지점마다 제공되는 음식물(바나나 등)을 먹고 소화한다.',
      '몸 속에 요소 생성량이 많아진다.'
    ],
    experimentBanner: '실험 과정 카드뉴스 또는 영상이 추후 연결될 예정입니다.',
    experiments: [
      {
        name: '인공 신장 모형을 이용한 노폐물 여과 실험',
        materials: [
          '셀로판 튜브',
          '가상 혈액(1% 녹말 수용액 + 1% 포도당 수용액)',
          '증류수',
          '500mL 비커',
          '100mL 비커',
          '시험관',
          '시험관대',
          '스포이트',
          '유리 막대',
          '실(또는 고무줄)',
          '가위',
          '핫플레이트',
          '아이오딘-아이오딘화 칼륨 용액',
          '베네딕트 용액'
        ],
        steps: [
          '셀로판 튜브를 물에 5분 정도 담가 부드럽게 만든 후 원통형으로 벌린다.',
          '튜브 한쪽 끝을 묶어 액체가 새지 않게 한다.',
          '스포이트로 튜브 안에 가상 혈액을 절반 정도 채운다.',
          '공기를 최대한 빼고 반대쪽 끝도 묶어 주머니 형태를 만든다.',
          '완성된 주머니의 겉면을 물로 씻어낸다.',
          '500mL 비커에 증류수 300mL를 채운다.',
          '유리 막대에 셀로판 튜브를 매달아 비커 속에 완전히 잠기게 한 후 20~30분간 둔다.',
          '셀로판 튜브를 건져내고 비커의 물을 채취한다.',
          '첫 번째 시험관에 비커의 물 5mL를 넣고 아이오딘-아이오딘화 칼륨 용액을 1~2방울 떨어뜨린다.',
          '두 번째 시험관에 비커의 물 5mL를 넣고 베네딕트 용액을 1~2mL 떨어뜨린 뒤 뜨거운 물로 가열한다.'
        ]
      }
    ],
    responseSections: {
      icebreak: {
        title: '생각열기',
        description: '배설계의 필요성을 떠올리며 자신의 생각을 입력해 봅시다.',
        groups: [
          {
            title: '생각열기 질문',
            badgePrefix: '질문',
            prompts: [
              '마라톤 선수의 오줌에서 요소 농도가 높아지는 현상을 세포 호흡 및 물질의 이동 경로와 관련지어 설명해 봅시다.',
              '세포 호흡의 결과물인 ‘요소’와 같은 노폐물이 혈액에 계속 쌓인다면, 우리 몸 전체에 어떤 문제가 생길까요?',
              '마라톤 선수가 바나나를 먹고 소화 과정을 통해 우리 몸으로 흡수된 영양소가 세포에서 사용되고 생성된 물질은 어떻게 우리 몸을 빠져나올까요?'
            ]
          }
        ],
        saveLabel: '생각열기 저장'
      },
      predict: {
        title: '예상하기',
        description: '인공 신장 모형 실험 전에 예상한 결과를 적어 봅시다.',
        groups: [
          {
            title: '예상 질문',
            badgePrefix: '예상 질문',
            prompts: [
              '30분 뒤, 튜브 밖 비커의 물(증류수) 속으로 빠져나오는 물질은 무엇일까요? 그렇게 생각한 이유도 함께 적어봅시다.',
              '실험에서 사용한 셀로판 튜브와 비커는 우리 몸의 어느 기관에 해당할까요? 자유롭게 적어봅시다.'
            ]
          }
        ],
        saveLabel: '예상하기 저장'
      },
      observe: {
        title: '관찰하기',
        description: '실험 결과에서 관찰된 색 변화를 기록해 봅시다.',
        groups: [
          {
            title: '관찰 기록',
            badgePrefix: '관찰',
            prompts: ['첫 번째 시험관에서 색 변화', '두 번째 시험관에서 색 변화']
          }
        ],
        saveLabel: '관찰하기 저장'
      },
      explain: {
        title: '설명하기',
        description: '실험 결과와 세포 호흡의 관점을 연결해 설명을 정리해 봅시다.',
        groups: [
          {
            title: '설명 질문',
            badgePrefix: '설명 질문',
            prompts: [
              '실험에서 셀로판 튜브와 비커는 우리 몸의 배설계를 이루는 기관 중 각각 무엇에 해당하고 어떤 역할을 하는 것일까요?',
              '셀로판 튜브에 남은 물질은 우리 몸에서 무엇을 의미할까요?',
              '비커에 모인 액체는 우리 몸에서 생성되는 물질 중 무엇에 해당하는지 쓰고, 이 액체가 생성되는 과정을 우리 몸의 배설계를 이루는 기관을 포함하여 설명해 봅시다.',
              '소화계에서 소화 과정을 마치고 나온 찌꺼기와 배설계에서 배설 경로를 거쳐 우리 몸에서 빠져나가는 노폐물은 같은 것인가요?',
              '이 모형에서는 배설계에서 일어나는 과정 중 드러나지 않는 과정이 있습니다. 어떤 과정일까요?'
            ]
          }
        ],
        saveLabel: '설명하기 저장'
      },
      summary: {
        title: '정리하기',
        description: '이번 차시에서 배운 핵심 내용을 정리하고, 세포 호흡의 관점에서 기관계의 역할을 정리해 봅시다.',
        groups: [
          {
            title: '정리하기',
            badgePrefix: '정리',
            prompts: [
              '세포 호흡의 관점에서 배설계가 하는 역할은?',
              '세포 호흡 공장이 멈추지 않고 계속 돌아가려면 배설계는 어떤 도움을 주어야 할지 적어봅시다.',
              '오늘 수업을 통해 생각이 변화된 것이 있다면 자유롭게 적어주세요.'
            ]
          }
        ],
        saveLabel: '정리하기 저장'
      }
    },
    aiTitle: '3차시 AI 보조교사',
    aiDescription: '3차시 배설계 학습을 도와주는 AI 보조교사 영역입니다.'
  }
};

const STUDENT_QUESTION_GROUPS = {
  lesson1: {
    icebreak: [
      {
        title: '생각열기 질문',
        badgePrefix: '질문',
        questions: [
          { questionId: 'L1_Open_Q1', sectionLabel: '생각열기', questionText: '마라톤 선수가 먹은 바나나가 어떻게 근육을 움직이는 에너지가 될까요?' },
          { questionId: 'L1_Open_Q2', sectionLabel: '생각열기', questionText: '소화되고 남은 물질은 어떻게 우리 몸을 빠져나올까요?' }
        ]
      }
    ],
    predict: [
      {
        title: '예상 질문',
        badgePrefix: '예상 질문',
        questions: [
          { questionId: 'L1_Predict_Q1', sectionLabel: '예상하기', questionText: '녹말-셀로판 튜브를 담근 비커의 아이오딘-아이오딘화 칼륨 용액과의 반응 결과는 어떠할까요? 그렇게 생각한 이유도 함께 적어봅시다.' },
          { questionId: 'L1_Predict_Q2', sectionLabel: '예상하기', questionText: '포도당-셀로판 튜브를 담근 비커의 베네딕트 반응 결과는 어떠할까요? 그렇게 생각한 이유도 함께 적어봅시다.' },
          { questionId: 'L1_Predict_Q3', sectionLabel: '예상하기', questionText: '녹말 + 침 용액 셀로판 튜브를 담가둔 비커의 아이오딘-아이오딘화 칼륨 용액과 베네딕트 반응 결과는 각각 어떠할까요? 그렇게 생각한 이유도 함께 적어봅시다.' },
          { questionId: 'L1_Predict_Q4', sectionLabel: '예상하기', questionText: '소화 과정은 에너지 생성 과정일까요? 여러분의 생각을 자유롭게 적어봅시다.' }
        ]
      }
    ],
    observe: [
      {
        title: '관찰 기록',
        badgePrefix: '관찰',
        questions: [
          { questionId: 'L1_Observe_Q1', sectionLabel: '관찰하기', questionText: '녹말-셀로판 튜브를 담근 비커의 아이오딘-아이오딘화 칼륨 용액과의 반응 결과' },
          { questionId: 'L1_Observe_Q2', sectionLabel: '관찰하기', questionText: '포도당-셀로판 튜브를 담근 비커의 베네딕트 반응 결과' },
          { questionId: 'L1_Observe_Q3', sectionLabel: '관찰하기', questionText: '녹말 + 침 용액 셀로판 튜브를 담가둔 비커의 아이오딘-아이오딘화 칼륨 용액과 베네딕트 반응 결과' },
          { questionId: 'L1_Observe_Q4', sectionLabel: '관찰하기', questionText: '소화 과정에서 에너지가 발생하였나요?' }
        ]
      }
    ],
    explain: [
      {
        title: '설명 질문',
        badgePrefix: '설명 질문',
        questions: [
          { questionId: 'L1_Explain_Q1', sectionLabel: '설명하기', questionText: '각각의 튜브에서 나타난 색 변화가 어떤 물질의 이동 때문인지 설명해 봅시다.' },
          { questionId: 'L1_Explain_Q2', sectionLabel: '설명하기', questionText: '이번 실험에서 관찰된 과정이 에너지를 생성하는 과정이라고 볼 수 있을까요?' },
          { questionId: 'L1_Explain_Q3', sectionLabel: '설명하기', questionText: '실험 과정에서 녹말 용액과 침을 함께 넣은 용액에서 검출된 물질은 무엇인가요? 침의 어떤 성분에 의해 이러한 결과가 나타났을까요? 그리고 그 성분이 생물체의 ‘세포’ 혹은 ‘물질’인가요?' },
          { questionId: 'L1_Explain_Q4', sectionLabel: '설명하기', questionText: '셀로판 튜브는 우리 몸의 기관 중 어느 것에 해당할지 적어보고, 셀로판 튜브를 통과한 영양소는 우리 몸에서 어느 곳으로 이동할지, 또, 셀로판 튜브 안에 남아서 통과하지 못한 물질은 우리 몸 안으로 들어왔다고 할 수 있는지 적어봅시다.' },
          { questionId: 'L1_Explain_Q5', sectionLabel: '설명하기', questionText: '우리 몸에서 침과 같이 소화를 도와주는 물질이 분비되는 곳은 어느 기관이 있나요? 그리고 그 기관에서 직접적으로 소화 과정을 수행하는지 적어봅시다.' }
        ]
      }
    ],
    summary: [
      {
        title: '정리하기',
        badgePrefix: '정리',
        questions: [
          { questionId: 'L1_Summary_Q1', sectionLabel: '정리하기', questionText: '세포 호흡의 관점에서 소화계가 하는 역할은?' },
          { questionId: 'L1_Summary_Q2', sectionLabel: '정리하기', questionText: '세포 호흡 공장이 멈추지 않고 계속 돌아가려면 소화계는 어떤 도움을 주어야 할지 적어봅시다.' },
          { questionId: 'L1_Reflection_Q3', sectionLabel: '생각변화', questionText: '오늘 수업을 통해 여러분의 생각이 변화된 것이 있다면 자유롭게 적어주세요.' }
        ]
      }
    ]
  },
  lesson2: {
    icebreak: [
      {
        title: '생각열기 질문',
        badgePrefix: '질문',
        questions: [{ questionId: 'L2_Open_Q1', sectionLabel: '생각열기', questionText: '마라톤 선수들은 어떻게 지치지 않고 계속해서 달릴 수 있을까요?' }]
      }
    ],
    predict: [
      {
        title: '순환계 예상하기',
        badgePrefix: '순환계 질문',
        questions: [
          { questionId: 'L2_Circulation_Predict_Q1', sectionLabel: '순환계 예상하기', questionText: '심장 박동이 느껴지는 곳에 손을 대봅시다. 심장은 우리 몸의 어느 부분에 위치하고 있나요?' },
          { questionId: 'L2_Circulation_Predict_Q2', sectionLabel: '순환계 예상하기', questionText: '1분간 격렬하게 운동을 한 직후, 자신의 심박수(BPM)는 안정 시 심박수와 비교하여 얼마나 달라질지 적어봅시다. 그리고 심박수 조절은 어느 기관에서 할지 적어봅시다.' },
          { questionId: 'L2_Circulation_Predict_Q3', sectionLabel: '순환계 예상하기', questionText: '운동을 할 때, 심장 박동의 변화에 따라 혈관에서 흐르는 혈액의 양은 어떻게 변화할까요?' },
          { questionId: 'L2_Circulation_Predict_Q4', sectionLabel: '순환계 예상하기', questionText: '심장에서 폐로 흐르는 혈관에는 산소가 (많은 / 적은) 혈액이 흐를 것이다. 여러분이 생각하는 답을 선택해 보세요.' }
        ]
      },
      {
        title: '호흡계 예상하기',
        badgePrefix: '호흡계 질문',
        questions: [
          { questionId: 'L2_Respiration_Predict_Q1', sectionLabel: '호흡계 예상하기', questionText: '평상시와 운동 직후, 어느 때에 불어넣은 날숨이 BTB 용액을 더 빨리 노란색으로 변화시킬지, 그 이유와 함께 적어봅시다.' },
          { questionId: 'L2_Respiration_Predict_Q2', sectionLabel: '호흡계 예상하기', questionText: '우리 몸에서 호흡은 어디에서 일어날까요?' },
          { questionId: 'L2_Respiration_Predict_Q3', sectionLabel: '호흡계 예상하기', questionText: '들숨과 날숨에서 각각 산소와 이산화탄소의 비율은 각각 어떻게 될까요?' }
        ]
      }
    ],
    observe: [
      {
        title: '순환계 관찰하기',
        badgePrefix: '순환계 관찰',
        questions: [
          { questionId: 'L2_Circulation_Observe_Q1', sectionLabel: '순환계 관찰하기', questionText: '안정 시 심박수 1회' },
          { questionId: 'L2_Circulation_Observe_Q2', sectionLabel: '순환계 관찰하기', questionText: '안정 시 심박수 2회' },
          { questionId: 'L2_Circulation_Observe_Q3', sectionLabel: '순환계 관찰하기', questionText: '안정 시 심박수 3회' },
          { questionId: 'L2_Circulation_Observe_Q4', sectionLabel: '순환계 관찰하기', questionText: '운동 직후 심박수' },
          { questionId: 'L2_Circulation_Observe_Q5', sectionLabel: '순환계 관찰하기', questionText: '회복 후 심박수' }
        ]
      },
      {
        title: '호흡계 관찰하기',
        badgePrefix: '호흡계 관찰',
        questions: [
          { questionId: 'L2_Respiration_Observe_Q1', sectionLabel: '호흡계 관찰하기', questionText: '평상시 BTB 용액이 노란색으로 완전히 변할 때까지 걸린 시간' },
          { questionId: 'L2_Respiration_Observe_Q2', sectionLabel: '호흡계 관찰하기', questionText: '운동 직후 BTB 용액이 노란색으로 완전히 변할 때까지 걸린 시간' }
        ]
      }
    ],
    explain: [
      {
        title: '순환계 설명하기',
        badgePrefix: '순환계 설명',
        questions: [
          { questionId: 'L2_Circulation_Explain_Q1', sectionLabel: '순환계 설명하기', questionText: '심장 박동이 느껴지는 곳에 손을 대봅시다. 심장은 우리 몸의 어느 부분에 위치하고 있나요?' },
          { questionId: 'L2_Circulation_Explain_Q2', sectionLabel: '순환계 설명하기', questionText: '운동을 하는 과정에서 심박수가 빨라졌을 때, 혈액이 흐르는 속도와 우리 몸 혈액의 전체 양은 각각 어떻게 될까요?' },
          { questionId: 'L2_Circulation_Explain_Q3', sectionLabel: '순환계 설명하기', questionText: '심장에서 폐로 이산화탄소를 운반하는 혈관은 어디일까요? 그리고 그 혈관에 흐르는 산소의 양은 어떠할까요? 그 혈관의 명칭과 함께 생각해 봅시다.' },
          { questionId: 'L2_Circulation_Explain_Q4', sectionLabel: '순환계 설명하기', questionText: '실험 결과를 토대로 안정 시 심박수와 운동 후 심박수, 회복 후 심박수의 변화를 세포 호흡의 관점에서 설명해 봅시다.' }
        ]
      },
      {
        title: '호흡계 설명하기',
        badgePrefix: '호흡계 설명',
        questions: [
          { questionId: 'L2_Respiration_Explain_Q1', sectionLabel: '호흡계 설명하기', questionText: '실험 결과, 어느 비커에서 BTB 용액이 노란색으로 더 빠르게 변하였나요?' },
          { questionId: 'L2_Respiration_Explain_Q2', sectionLabel: '호흡계 설명하기', questionText: '우리 몸에서 호흡은 어디에서 일어나는 활동인가요? 호흡이 일어나는 장소에 대해서 적어봅시다.' },
          { questionId: 'L2_Respiration_Explain_Q3', sectionLabel: '호흡계 설명하기', questionText: '안정된 상태에서와 운동 후 들숨과 날숨에서 각각 산소와 이산화탄소의 비율은 각각 어떻게 될까요?' },
          { questionId: 'L2_Respiration_Explain_Q4', sectionLabel: '호흡계 설명하기', questionText: '우리가 들이마신 공기는 어떤 경로를 통해서 우리 몸 내부로 이동하는 것인지 적어봅시다.' }
        ]
      }
    ],
    summary: [
      {
        title: '정리하기',
        badgePrefix: '정리',
        questions: [
          { questionId: 'L2_Summary_Q1', sectionLabel: '정리하기', questionText: '세포 호흡의 관점에서 순환계가 하는 역할은?' },
          { questionId: 'L2_Summary_Q2', sectionLabel: '정리하기', questionText: '세포 호흡의 관점에서 호흡계가 하는 역할은?' },
          { questionId: 'L2_Summary_Q3', sectionLabel: '정리하기', questionText: '세포 호흡 공장이 멈추지 않고 계속 돌아가려면 순환계와 호흡계는 각각 어떤 도움을 주어야 할지 적어봅시다.' },
          { questionId: 'L2_Reflection_Q1', sectionLabel: '생각변화', questionText: '오늘 수업을 통해 여러분의 생각이 변화된 것이 있다면 자유롭게 적어주세요.' }
        ]
      }
    ]
  },
  lesson3: {
    icebreak: [
      {
        title: '생각열기 질문',
        badgePrefix: '질문',
        questions: [
          { questionId: 'L3_Open_Q1', sectionLabel: '생각열기', questionText: '마라톤 선수의 오줌에서 요소 농도가 높아지는 현상을 세포 호흡 및 물질의 이동 경로와 관련지어 설명해 봅시다.' },
          { questionId: 'L3_Open_Q2', sectionLabel: '생각열기', questionText: '세포 호흡의 결과물인 ‘요소’와 같은 노폐물이 혈액에 계속 쌓인다면, 우리 몸 전체에 어떤 문제가 생길까요?' },
          { questionId: 'L3_Open_Q3', sectionLabel: '생각열기', questionText: '마라톤 선수가 바나나를 먹고 소화 과정을 통해 우리 몸으로 흡수된 영양소가 세포에서 사용되고 생성된 물질은 어떻게 우리 몸을 빠져나올까요?' }
        ]
      }
    ],
    predict: [
      {
        title: '예상 질문',
        badgePrefix: '예상 질문',
        questions: [
          { questionId: 'L3_Predict_Q1', sectionLabel: '예상하기', questionText: '30분 뒤, 튜브 밖 비커의 물(증류수) 속으로 빠져나오는 물질은 무엇일까요? 그렇게 생각한 이유도 함께 적어봅시다.' },
          { questionId: 'L3_Predict_Q2', sectionLabel: '예상하기', questionText: '실험에서 사용한 셀로판 튜브와 비커는 우리 몸의 어느 기관에 해당할까요? 자유롭게 적어봅시다.' }
        ]
      }
    ],
    observe: [
      {
        title: '관찰 기록',
        badgePrefix: '관찰',
        questions: [
          { questionId: 'L3_Observe_Q1', sectionLabel: '관찰하기', questionText: '첫 번째 시험관에서 색 변화' },
          { questionId: 'L3_Observe_Q2', sectionLabel: '관찰하기', questionText: '두 번째 시험관에서 색 변화' }
        ]
      }
    ],
    explain: [
      {
        title: '설명 질문',
        badgePrefix: '설명 질문',
        questions: [
          { questionId: 'L3_Explain_Q1', sectionLabel: '설명하기', questionText: '실험에서 셀로판 튜브와 비커는 우리 몸의 배설계를 이루는 기관 중 각각 무엇에 해당하고 어떤 역할을 하는 것일까요?' },
          { questionId: 'L3_Explain_Q2', sectionLabel: '설명하기', questionText: '셀로판 튜브에 남은 물질은 우리 몸에서 무엇을 의미할까요?' },
          { questionId: 'L3_Explain_Q3', sectionLabel: '설명하기', questionText: '비커에 모인 액체는 우리 몸에서 생성되는 물질 중 무엇에 해당하는지 쓰고, 이 액체가 생성되는 과정을 우리 몸의 배설계를 이루는 기관을 포함하여 설명해 봅시다.' },
          { questionId: 'L3_Explain_Q4', sectionLabel: '설명하기', questionText: '소화계에서 소화 과정을 마치고 나온 찌꺼기와 배설계에서 배설 경로를 거쳐 우리 몸에서 빠져나가는 노폐물은 같은 것인가요?' },
          { questionId: 'L3_Explain_Q5', sectionLabel: '설명하기', questionText: '이 모형에서는 배설계에서 일어나는 과정 중 드러나지 않는 과정이 있습니다. 어떤 과정일까요?' }
        ]
      }
    ],
    summary: [
      {
        title: '정리하기',
        badgePrefix: '정리',
        questions: [
          { questionId: 'L3_Summary_Q1', sectionLabel: '정리하기', questionText: '세포 호흡의 관점에서 배설계가 하는 역할은?' },
          { questionId: 'L3_Summary_Q2', sectionLabel: '정리하기', questionText: '세포 호흡 공장이 멈추지 않고 계속 돌아가려면 배설계는 어떤 도움을 주어야 할지 적어봅시다.' },
          { questionId: 'L3_Reflection_Q1', sectionLabel: '생각변화', questionText: '오늘 수업을 통해 여러분의 생각이 변화된 것이 있다면 자유롭게 적어주세요.' }
        ]
      }
    ]
  }
};

function getSectionQuestionGroups(lessonKey, sectionKey, section) {
  return STUDENT_QUESTION_GROUPS?.[lessonKey]?.[sectionKey] || section?.groups || [];
}

const QUESTION_MAP = Object.values(STUDENT_QUESTION_GROUPS).reduce((acc, sectionMap) => {
  Object.values(sectionMap).forEach((groups) => {
    groups.forEach((group) => {
      group.questions.forEach((question) => {
        acc[question.questionId] = {
          lesson: question.questionId.startsWith('L1_') ? 'lesson1' : question.questionId.startsWith('L2_') ? 'lesson2' : 'lesson3',
          section: question.sectionLabel,
          text: question.questionText
        };
      });
    });
  });
  return acc;
}, {});

const lessonContent = {
  lesson1: { title: detailedLessonData.lesson1.title, summary: detailedLessonData.lesson1.summary },
  lesson2: { title: detailedLessonData.lesson2.title, summary: detailedLessonData.lesson2.summary },
  lesson3: { title: detailedLessonData.lesson3.title, summary: detailedLessonData.lesson3.summary }
};

const initialLessonTabState = Object.fromEntries(
  Object.entries(lessonSubTabsMap).map(([lessonKey, tabs]) => [lessonKey, tabs[0].id])
);

const createEmptyResponses = () => {
  const entries = {};

  Object.entries(detailedLessonData).forEach(([lessonKey, lesson]) => {
    entries[lessonKey] = { studentName: '', studentId: '', sections: {} };

    Object.entries(lesson.responseSections || {}).forEach(([sectionKey, section]) => {
      const groups = getSectionQuestionGroups(lessonKey, sectionKey, section);
      if (!groups?.length) return;

      const answers = {};
      groups.forEach((group, groupIndex) => {
        const questions = group.questions || group.prompts || [];
        questions.forEach((_, promptIndex) => {
          answers[`g${groupIndex + 1}_q${promptIndex + 1}`] = '';
        });
      });

      entries[lessonKey].sections[sectionKey] = answers;
    });
  });

  return entries;
};

const quickLinks = [
  { id: 'pretest', title: '사전 검사 바로가기', caption: '수업 전 개념 검사를 먼저 진행합니다.' },
  { id: 'lesson1', title: '1차시 바로가기', caption: '소화계 학습과 입력 영역을 확인합니다.' },
  { id: 'lesson2', title: '2차시 바로가기', caption: '순환계·호흡계 입력과 저장 흐름을 확인합니다.' },
  { id: 'lesson3', title: '3차시 바로가기', caption: '배설계 입력과 저장 흐름을 확인합니다.' },
  { id: 'progress', title: '학습 변화 확인 바로가기', caption: '사전/사후 검사 결과 비교 대시보드를 확인합니다.' }
];

const usageSteps = [
  '1) 사전 검사를 실시합니다.',
  '2) 1~3차시 학습을 진행하며 답변을 저장합니다.',
  '3) 사후 검사를 실시합니다.',
  '4) 학습 변화 확인과 교사용 보기에서 결과를 확인합니다.'
];

function App() {
  const [activeTopTab, setActiveTopTab] = useState('home');
  const [lessonTabState, setLessonTabState] = useState(initialLessonTabState);
  const [responseState, setResponseState] = useState(() => createEmptyResponses());
  const [saveStatus, setSaveStatus] = useState({});
  const [searchName, setSearchName] = useState('');
  const [searchStudentId, setSearchStudentId] = useState('');
  const [prePayload, setPrePayload] = useState(EMPTY_DATASET_PAYLOAD);
  const [postPayload, setPostPayload] = useState(EMPTY_DATASET_PAYLOAD);
  const [posttestName, setPosttestName] = useState('');
  const [posttestStudentId, setPosttestStudentId] = useState('');
  const [posttestVerified, setPosttestVerified] = useState(false);
  const [posttestVerifying, setPosttestVerifying] = useState(false);
  const [posttestVerificationMessage, setPosttestVerificationMessage] = useState({ type: '', text: '' });
  const [compareResult, setCompareResult] = useState(null);
  const [compareError, setCompareError] = useState('');
  const [compareLoading, setCompareLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [showRecommendationLinks, setShowRecommendationLinks] = useState(false);
  const [aiRecommendationChecked, setAiRecommendationChecked] = useState(false);
  const [sortMode, setSortMode] = useState('original');
  const [teacherFilter, setTeacherFilter] = useState({ lesson: 'lesson1', section: 'icebreak' });
  const [teacherResponses, setTeacherResponses] = useState([]);
  const [teacherMeta, setTeacherMeta] = useState({ loading: false, error: '', fetched: false });
  const lesson2CanvasRef = useRef(null);
  const lesson2ImageRef = useRef(null);
  const lesson2ArrowsRef = useRef([]);
  const [lesson2IsDrawing, setLesson2IsDrawing] = useState(false);
  const [lesson2StartPoint, setLesson2StartPoint] = useState(null);

  const isLessonTab = ['lesson1', 'lesson2', 'lesson3'].includes(activeTopTab);
  const activeLesson = lessonContent[activeTopTab];
  const lessonTabs = lessonSubTabsMap[activeTopTab] ?? [];
  const activeSubTab = lessonTabState[activeTopTab];
  const activeSubTabLabel = useMemo(
    () => lessonTabs.find((tab) => tab.id === activeSubTab)?.label ?? '',
    [lessonTabs, activeSubTab]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (parsed.lessonTabState) {
        setLessonTabState((current) => ({ ...current, ...parsed.lessonTabState }));
      }
      if (parsed.responseState) {
        setResponseState((current) => {
          const next = createEmptyResponses();
          Object.keys(next).forEach((lessonKey) => {
            next[lessonKey] = {
              ...next[lessonKey],
              ...(parsed.responseState[lessonKey] ?? {})
            };
            next[lessonKey].sections = {
              ...next[lessonKey].sections,
              ...(parsed.responseState[lessonKey]?.sections ?? {})
            };
          });
          return next;
        });
      }
    } catch (error) {
      console.error('Failed to restore local state', error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ lessonTabState, responseState }));
  }, [lessonTabState, responseState]);

  useEffect(() => {
    if (activeTopTab !== 'teacher') return;
    fetchTeacherResponses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTopTab, teacherFilter.lesson, teacherFilter.section]);


  const redrawLesson2Canvas = () => {
    const canvas = lesson2CanvasRef.current;
    const image = lesson2ImageRef.current;
    if (!canvas || !image) return;

    const width = image.clientWidth;
    const height = image.clientHeight;
    if (!width || !height) return;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#1f376d';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    lesson2ArrowsRef.current.forEach((arrow) => {
      drawArrow(ctx, arrow.fromX, arrow.fromY, arrow.toX, arrow.toY);
    });
  };

  const syncLesson2CanvasSize = () => {
    redrawLesson2Canvas();
  };

  useEffect(() => {
    if (activeTopTab !== 'lesson2' || activeSubTab !== 'icebreak') return undefined;

    const handleResize = () => syncLesson2CanvasSize();
    handleResize();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
    return undefined;
  }, [activeTopTab, activeSubTab]);

  const getLesson2CanvasPoint = (event) => {
    const canvas = lesson2CanvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };

  const handleLesson2CanvasMouseDown = (event) => {
    const point = getLesson2CanvasPoint(event);
    if (!point) return;
    setLesson2IsDrawing(true);
    setLesson2StartPoint(point);
  };

  const handleLesson2CanvasMouseUp = (event) => {
    if (!lesson2IsDrawing || !lesson2StartPoint) return;
    const point = getLesson2CanvasPoint(event);
    if (!point) return;

    lesson2ArrowsRef.current = [
      ...lesson2ArrowsRef.current,
      {
        fromX: lesson2StartPoint.x,
        fromY: lesson2StartPoint.y,
        toX: point.x,
        toY: point.y
      }
    ];
    redrawLesson2Canvas();
    setLesson2IsDrawing(false);
    setLesson2StartPoint(null);
  };

  const resetLesson2Drawing = () => {
    lesson2ArrowsRef.current = [];
    redrawLesson2Canvas();
    handleAnswerChange('lesson2', 'icebreak', 'q2Drawing', '');
  };

  const exportLesson2Drawing = () => {
    const canvas = lesson2CanvasRef.current;
    const image = lesson2ImageRef.current;
    if (!canvas || !image || !lesson2ArrowsRef.current.length) return '';

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = image.naturalWidth || canvas.width;
    exportCanvas.height = image.naturalHeight || canvas.height;
    const exportCtx = exportCanvas.getContext('2d');
    exportCtx.drawImage(image, 0, 0, exportCanvas.width, exportCanvas.height);
    exportCtx.drawImage(canvas, 0, 0, exportCanvas.width, exportCanvas.height);
    return exportCanvas.toDataURL('image/png');
  };

  const handleSubTabChange = (lessonKey, subTabId) => {
    setLessonTabState((current) => ({
      ...current,
      [lessonKey]: subTabId
    }));
  };

  const getNextSubTab = (lessonKey, currentSubTabId = lessonTabState[lessonKey]) => {
    const tabs = lessonSubTabsMap[lessonKey] || [];
    const currentIndex = tabs.findIndex((tab) => tab.id === currentSubTabId);
    return currentIndex >= 0 ? tabs[currentIndex + 1] || null : null;
  };

  const moveToNextSubTab = (lessonKey, currentSubTabId = lessonTabState[lessonKey]) => {
    const nextTab = getNextSubTab(lessonKey, currentSubTabId);
    if (!nextTab) return;
    handleSubTabChange(lessonKey, nextTab.id);
  };

  const moveToLesson = (lessonKey) => {
    if (!['lesson1', 'lesson2', 'lesson3'].includes(lessonKey)) return;
    setActiveTopTab(lessonKey);
  };

  const getLessonQuickLabel = (lessonKey) => {
    if (lessonKey === 'lesson1') return '1차시 다시 보기';
    if (lessonKey === 'lesson2') return '2차시 다시 보기';
    if (lessonKey === 'lesson3') return '3차시 다시 보기';
    return '추천 차시 다시 보기';
  };

  const handleStudentFieldChange = (lessonKey, field, value) => {
    setResponseState((current) => ({
      ...current,
      [lessonKey]: {
        ...current[lessonKey],
        [field]: value
      }
    }));
  };

  const handleAnswerChange = (lessonKey, sectionKey, answerKey, value) => {
    setResponseState((current) => ({
      ...current,
      [lessonKey]: {
        ...current[lessonKey],
        sections: {
          ...current[lessonKey].sections,
          [sectionKey]: {
            ...current[lessonKey].sections[sectionKey],
            [answerKey]: value
          }
        }
      }
    }));
  };

  const saveAnswersBatch = async ({ studentId, name, answers }) => {
    if (!studentId || !name) {
      return { success: false, error: '이름과 학번을 먼저 입력해주세요.' };
    }

    const entries = Object.entries(answers || {}).filter(([, answer]) => String(answer ?? '').trim());
    if (!entries.length) {
      return { success: false, error: '저장할 답안을 먼저 입력해주세요.' };
    }

    try {
      for (const [questionId, answer] of entries) {
        const question = QUESTION_MAP[questionId];
        if (!question) continue;

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId,
            name,
            lesson: question.lesson,
            section: question.section,
            questionId,
            questionText: question.text,
            answer: String(answer).trim()
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = '';
          try {
            const parsed = JSON.parse(errorText);
            errorMessage = parsed?.message || parsed?.error || '';
          } catch (parseError) {
            errorMessage = errorText || '';
          }

          throw new Error(errorMessage || `서버 응답 오류: ${response.status}`);
        }
      }

      return { success: true };
    } catch (error) {
      console.error('답안 저장 오류:', error);
      return {
        success: false,
        error:
          error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')
            ? '네트워크 연결을 확인한 뒤 다시 시도해 주세요.'
            : '저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      };
    }
  };

  const handleSaveSectionAll = async ({ lessonKey, sectionKey, questionGroups }) => {
    const student = responseState[lessonKey];
    const statusKey = `${lessonKey}-${sectionKey}`;
    const sectionAnswers = responseState[lessonKey]?.sections?.[sectionKey] || {};

    const answersByQuestionId = {};
    questionGroups.forEach((group, groupIndex) => {
      (group.questions || []).forEach((question, promptIndex) => {
        const answerKey = `g${groupIndex + 1}_q${promptIndex + 1}`;
        answersByQuestionId[question.questionId] = sectionAnswers[answerKey] || '';
      });
    });

    setSaveStatus((current) => ({
      ...current,
      [statusKey]: { type: 'loading', message: '저장 중...' }
    }));

    const result = await saveAnswersBatch({
      studentId: String(student?.studentId ?? '').trim(),
      name: String(student?.studentName ?? '').trim(),
      answers: answersByQuestionId
    });

    setSaveStatus((current) => ({
      ...current,
      [statusKey]: result.success
        ? { type: 'success', message: `저장 완료 (${new Date().toLocaleTimeString('ko-KR', { hour12: false })})` }
        : { type: 'error', message: result.error || '저장 중 오류가 발생했습니다.' }
    }));
  };

  const fetchTeacherResponses = async () => {
    setTeacherMeta({ loading: true, error: '', fetched: false });
    try {
      const query = new URLSearchParams({ lesson: teacherFilter.lesson, section: teacherFilter.section });
      const response = await fetch(`/.netlify/functions/get-responses?${query.toString()}`);
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || '응답을 불러오지 못했습니다.');
      }
      setTeacherResponses(Array.isArray(result.responses) ? result.responses : []);
      setTeacherMeta({ loading: false, error: '', fetched: true });
    } catch (error) {
      setTeacherResponses([]);
      setTeacherMeta({ loading: false, error: error.message || '응답을 불러오지 못했습니다.', fetched: true });
    }
  };

  const loadBothDatasets = async () => {
    const [preResponse, postResponse] = await Promise.all([
      fetch('/.netlify/functions/proxy?dataset=pre', { cache: 'no-store' }),
      fetch('/.netlify/functions/proxy?dataset=post', { cache: 'no-store' })
    ]);

    const [preJson, postJson] = await Promise.all([preResponse.json(), postResponse.json()]);

    if (!preResponse.ok || !postResponse.ok) {
      throw new Error('사전 또는 사후 검사 데이터를 불러오지 못했습니다.');
    }

    const nextPrePayload = normalizePayload(preJson, 'pre');
    const nextPostPayload = normalizePayload(postJson, 'post');

    setPrePayload(nextPrePayload);
    setPostPayload(nextPostPayload);

    return { nextPrePayload, nextPostPayload };
  };


  const handlePosttestFieldChange = (field, value) => {
    const trimmedResetNeeded = posttestVerified || posttestVerificationMessage.text;

    if (field === 'name') {
      setPosttestName(value);
    }

    if (field === 'studentId') {
      setPosttestStudentId(value);
    }

    if (trimmedResetNeeded) {
      setPosttestVerified(false);
      setPosttestVerificationMessage({ type: '', text: '' });
    }
  };

  const verifyPosttestEligibility = async () => {
    const studentName = posttestName.trim();
    const studentId = posttestStudentId.trim();

    if (!studentName || !studentId) {
      const message = '이름과 학번을 모두 입력해주세요.';
      setPosttestVerified(false);
      setPosttestVerificationMessage({ type: 'error', text: message });
      if (typeof window !== 'undefined') {
        window.alert(message);
      }
      return;
    }

    setPosttestVerifying(true);
    setPosttestVerificationMessage({ type: 'loading', text: '사전 검사 데이터를 확인하는 중입니다...' });

    try {
      const response = await fetch('/.netlify/functions/proxy?dataset=pre', { cache: 'no-store' });
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json?.error || '사전 검사 데이터를 불러오지 못했습니다.');
      }

      const normalizedPrePayload = normalizePayload(json, 'pre');
      const rows = normalizedPrePayload?.data || [];
      setPrePayload(normalizedPrePayload);

      if (!rows.length) {
        throw new Error('사전 검사 데이터가 없습니다. 먼저 사전 검사를 완료해주세요.');
      }

      const sampleRow = rows[0] || {};
      const nameCol = findColumn(sampleRow, ['이름']);
      const studentCol = findColumn(sampleRow, ['학번']);

      if (!nameCol || !studentCol) {
        throw new Error('사전 검사 데이터에서 이름 또는 학번 항목을 찾지 못했습니다.');
      }

      const matched = rows.find(
        (item) => String(item?.[nameCol] ?? '').trim() === studentName && String(item?.[studentCol] ?? '').trim() === studentId
      );

      if (matched) {
        setPosttestVerified(true);
        setPosttestVerificationMessage({ type: 'success', text: '사전 검사 확인이 완료되었습니다. 사후 검사를 진행하세요.' });
        return;
      }

      const message = '사전 검사 데이터가 없습니다. 먼저 사전 검사를 완료해주세요.';
      setPosttestVerified(false);
      setPosttestVerificationMessage({ type: 'error', text: '사전 검사를 완료한 학생만 사후 검사에 참여할 수 있습니다.' });
      if (typeof window !== 'undefined') {
        window.alert(message);
      }
    } catch (error) {
      setPosttestVerified(false);
      setPosttestVerificationMessage({
        type: 'error',
        text: error.message || '사전 검사 데이터를 확인하지 못했습니다. 잠시 후 다시 시도해주세요.'
      });
    } finally {
      setPosttestVerifying(false);
    }
  };

  const runComparison = async () => {
    const cleanName = searchName.trim();
    const cleanStudentId = searchStudentId.trim();

    if (!cleanName || !cleanStudentId) {
      setCompareError('이름과 학번을 모두 입력해 주세요.');
      setCompareResult(null);
      return;
    }

    setCompareLoading(true);
    setCompareError('');
    setAiRecommendation('');
    setAiError('');

    try {
      let localPrePayload = prePayload;
      let localPostPayload = postPayload;

      if (!localPrePayload.data.length || !localPostPayload.data.length) {
        const loaded = await loadBothDatasets();
        localPrePayload = loaded.nextPrePayload;
        localPostPayload = loaded.nextPostPayload;
      }

      if (!localPrePayload.data.length || !localPostPayload.data.length) {
        throw new Error('일치하는 학생 정보를 찾을 수 없습니다.');
      }

      const preRows = localPrePayload.data;
      const postRows = localPostPayload.data;
      const preHeaders = Object.keys(preRows[0] || {});
      const postHeaders = Object.keys(postRows[0] || {});
      const preHeaderMap = new Map(preHeaders.map((header) => [normalizeQuestionName(header), header]));
      const postHeaderMap = new Map(postHeaders.map((header) => [normalizeQuestionName(header), header]));

      const preNameCol = findColumn(preRows[0], ['이름']);
      const preStudentCol = findColumn(preRows[0], ['학번']);
      const preTimestampCol = findColumn(preRows[0], ['타임스탬프', '응답 시간', '제출 시간']);
      const postNameCol = findColumn(postRows[0], ['이름']);
      const postStudentCol = findColumn(postRows[0], ['학번']);
      const postTimestampCol = findColumn(postRows[0], ['타임스탬프', '응답 시간', '제출 시간']);

      if (!preNameCol || !preStudentCol || !preTimestampCol || !postNameCol || !postStudentCol || !postTimestampCol) {
        throw new Error('사전/사후 데이터에서 이름, 학번, 타임스탬프 컬럼을 찾지 못했습니다.');
      }

      const matchedPre = pickLatestMatch(preRows, preNameCol, preStudentCol, cleanName, cleanStudentId, preTimestampCol);
      const matchedPost = pickLatestMatch(postRows, postNameCol, postStudentCol, cleanName, cleanStudentId, postTimestampCol);

      if (!matchedPre || !matchedPost) {
        throw new Error('일치하는 학생 정보를 찾을 수 없습니다.');
      }

      const preExcludedColumns = new Set([preNameCol, preStudentCol, preTimestampCol]);
      const postExcludedColumns = new Set([postNameCol, postStudentCol, postTimestampCol]);
      const preScoreColumns = preHeaders.filter(
        (header) =>
          !preExcludedColumns.has(header) &&
          (parseScore(matchedPre?.[header]) !== null || parseScore((preRows[0] || {})[header]) !== null)
      );
      const postScoreColumns = postHeaders.filter(
        (header) =>
          !postExcludedColumns.has(header) &&
          (parseScore(matchedPost?.[header]) !== null || parseScore((postRows[0] || {})[header]) !== null)
      );
      const normalizedPostScoreColumns = postScoreColumns.map((header) => normalizeQuestionName(header));
      const commonColumns = preScoreColumns.filter((header) =>
        normalizedPostScoreColumns.includes(normalizeQuestionName(header))
      );

      const items = commonColumns
        .map((column, index) => {
          const normalizedColumn = normalizeQuestionName(column);
          const preColumn = preHeaderMap.get(normalizedColumn) || column;
          const postColumn = postHeaderMap.get(normalizedColumn);
          if (!postColumn) return null;

          const pre = matchedPre ? parseScore(matchedPre[preColumn]) : null;
          const post = matchedPost ? parseScore(matchedPost[postColumn]) : null;

          if (pre === null && post === null) return null;

          const delta = pre === null || post === null ? null : Number((post - pre).toFixed(2));
          const judgement = classifyChange(column, pre, post);
          const category = isScientificConceptQuestion(preColumn) ? '과학적 개념' : '오개념';
          const lessonKey = getLessonKeyFromQuestion(preColumn);

          return {
            index,
            question: preColumn,
            preScore: pre,
            postScore: post,
            delta,
            judgement,
            directionScore: getDirectionScore(column, pre, post),
            category,
            lessonKey
          };
        })
        .filter(Boolean);

      if (!items.length) {
        throw new Error('비교 가능한 점수 문항을 찾지 못했습니다.');
      }

      const validPreScores = items.map((item) => item.preScore).filter((score) => score !== null);
      const validPostScores = items.map((item) => item.postScore).filter((score) => score !== null);
      const preAvg = average(validPreScores);
      const postAvg = average(validPostScores);
      const deltaAvg = Number((postAvg - preAvg).toFixed(2));
      const improved = items.filter((item) => item.judgement === '개선').length;
      const same = items.filter((item) => item.judgement === '동일').length;
      const deepened = items.filter((item) => item.judgement === '심화').length;
      const categorySummary = {
        scientific: buildCategorySummary(items, '과학적 개념'),
        misconception: buildCategorySummary(items, '오개념')
      };
      const weaknessByLesson = buildWeaknessByLesson(items);
      const recommendedLessons = getRecommendedLessons(weaknessByLesson);

      setCompareResult({
        student: {
          name: cleanName,
          studentId: cleanStudentId,
          preTimestamp: matchedPre[preTimestampCol],
          postTimestamp: matchedPost[postTimestampCol]
        },
        summary: {
          questionCount: items.length,
          preAvg,
          postAvg,
          deltaAvg,
          improved,
          same,
          deepened
        },
        categorySummary,
        weaknessByLesson,
        recommendedLessons,
        items
      });
      setAiRecommendation('');
      setAiError('');
      setShowRecommendationLinks(false);
      setAiRecommendationChecked(false);
      setSortMode('original');
    } catch (error) {
      setCompareResult(null);
      setAiRecommendation('');
      setAiError('');
      setShowRecommendationLinks(false);
      setAiRecommendationChecked(false);
      setCompareError(error.message || '비교 결과를 불러오지 못했습니다.');
    } finally {
      setCompareLoading(false);
    }
  };

  const sortedCompareItems = useMemo(() => {
    if (!compareResult) return [];
    const base = [...compareResult.items];

    if (sortMode === 'improved') {
      return base.sort((a, b) => (b.directionScore - a.directionScore) || (a.index - b.index));
    }

    if (sortMode === 'worsened') {
      return base.sort((a, b) => (a.directionScore - b.directionScore) || (a.index - b.index));
    }

    return base.sort((a, b) => a.index - b.index);
  }, [compareResult, sortMode]);

  const lessonDisplayNameMap = {
    lesson1: '1차시',
    lesson2: '2차시',
    lesson3: '3차시'
  };

  const requestAiRecommendation = async () => {
    if (!compareResult) {
      setAiError('먼저 학생의 사전/사후 결과를 조회해 주세요.');
      setAiRecommendation('');
      setShowRecommendationLinks(false);
      setAiRecommendationChecked(false);
      return;
    }

    if (!compareResult.recommendedLessons.length) {
      setAiError('');
      setAiRecommendation('현재 추가 학습 추천이 필요하지 않습니다.');
      setShowRecommendationLinks(false);
      setAiRecommendationChecked(true);
      return;
    }

    setAiLoading(true);
    setAiError('');
    setShowRecommendationLinks(false);
    setAiRecommendationChecked(false);

    try {
      const response = await fetch('/.netlify/functions/analyze-learning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: compareResult.student.name,
          summary: {
            overall: compareResult.summary,
            scientific: compareResult.categorySummary.scientific,
            misconception: compareResult.categorySummary.misconception
          },
          weaknessByLesson: compareResult.weaknessByLesson,
          recommendedLessons: compareResult.recommendedLessons
        })
      });

      const result = await response.json();

      if (!response.ok || !result?.recommendation) {
        throw new Error(result?.error || 'AI 추천을 생성하지 못했습니다.');
      }

      setAiRecommendation(result.recommendation);
      setShowRecommendationLinks(compareResult.recommendedLessons.length > 0);
      setAiRecommendationChecked(true);
    } catch (error) {
      setAiRecommendation('');
      setAiError(error.message || 'AI 추천을 불러오지 못했습니다.');
      setShowRecommendationLinks(false);
      setAiRecommendationChecked(false);
    } finally {
      setAiLoading(false);
    }
  };

  const renderHome = () => (
    <div className="page-stack">
      <section className="card hero-card">
        <div className="hero-copy">
          <span className="section-tag">Student Courseware Preview</span>
          <h2>기관계의 통합적 작용 AI 코스웨어</h2>
          <p>이 코스웨어는 기관계의 통합적 작용을 주제로 한 3차시 POE 기반 학습 프로그램입니다.</p>
        </div>
      </section>

      <div className="content-grid content-grid--home">
        <section className="card info-card">
          <span className="section-tag">사용 방법 안내</span>
          <h3>학습 흐름 안내</h3>
          <ul className="guide-list">
            {usageSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </section>

        <section className="card info-card">
          <span className="section-tag">안내</span>
          <h3>학생 입력 + 저장 + 교사용 확인</h3>
          <p>
            학생은 각 차시의 생각열기, 예상하기, 관찰하기, 설명하기에서 답을 입력하고 저장할 수 있으며,
            교사는 교사용 보기 탭에서 차시/단계별 응답을 확인할 수 있습니다.
          </p>
        </section>
      </div>

      <section className="card shortcuts-card">
        <div className="section-heading">
          <div>
            <h3>주요 탭 빠르게 이동</h3>
          </div>
          <p>학생용 입력 화면과 교사용 확인 화면을 빠르게 이동할 수 있습니다.</p>
        </div>
        <div className="shortcut-grid">
          {quickLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              className="shortcut-card"
              onClick={() => setActiveTopTab(link.id)}
            >
              <strong>{link.title}</strong>
              <span>{link.caption}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );

  const renderAssessment = ({ title, description, buttonLabel }) => (
    <div className="page-stack">
      <section className="card assessment-card">
        <div className="section-heading section-heading--align-start">
          <div>
            <span className="section-tag">검사 안내</span>
            <h2>{title}</h2>
          </div>
          <button type="button" className="primary-button">
            {buttonLabel}
          </button>
        </div>
        <p className="body-text">{description}</p>
      </section>

      <section className="card placeholder-card">
        <div className="placeholder-panel">추후 Google Form 또는 검사 모듈이 연결될 예정입니다.</div>
      </section>
    </div>
  );

  const renderSingleFormCard = ({ key, title, description, openUrl, embedUrl }) => (
    <section key={key} className="card survey-card">
      <div className="survey-head">
        <div>
          <span className="section-tag">설문 참여</span>
          <h2>{title}</h2>
        </div>
        <a href={openUrl} target="_blank" rel="noopener noreferrer" className="primary-button ghost-link">
          새 창에서 열기
        </a>
      </div>
      <p className="body-text">{description}</p>
      <iframe src={embedUrl} title={title} className="survey-iframe" loading="lazy" />
    </section>
  );

  const renderSurveyGroup = (forms) => <div className="survey-stack">{forms.map((form) => renderSingleFormCard(form))}</div>;

  const renderPretestPanel = () => <div className="page-stack">{renderSurveyGroup(preSurveyForms)}</div>;

  const renderPosttestPanel = () => (
    <div className="page-stack">
      <section className="card survey-card">
        <div className="section-heading section-heading--stacked compact-gap">
          <div>
            <span className="section-tag">사전 검사 확인</span>
            <h2>사후 검사 참여 확인</h2>
          </div>
          <p>사후 검사는 사전 검사를 완료한 학생만 참여할 수 있습니다. 이름과 학번을 입력한 뒤 확인해 주세요.</p>
        </div>

        <div className="lesson-detail-stack lesson-detail-stack--compact">
          <section className="card nested-section-card">
            <div className="student-info-grid">
              <label className="field-label">
                <span>이름</span>
                <input
                  type="text"
                  value={posttestName}
                  onChange={(event) => handlePosttestFieldChange('name', event.target.value)}
                  placeholder="이름"
                  className="text-input"
                />
              </label>
              <label className="field-label">
                <span>학번</span>
                <input
                  type="text"
                  value={posttestStudentId}
                  onChange={(event) => handlePosttestFieldChange('studentId', event.target.value)}
                  placeholder="학번"
                  className="text-input"
                />
              </label>
            </div>

            <div className="save-row">
              <button type="button" className="primary-button" onClick={verifyPosttestEligibility} disabled={posttestVerifying}>
                {posttestVerifying ? '확인 중...' : '사전 검사 확인'}
              </button>
              {!posttestVerified && (
                <button type="button" className="primary-button ghost-link" onClick={() => setActiveTopTab('pretest')}>
                  사전 검사 하러 가기
                </button>
              )}
              {posttestVerificationMessage.text && (
                <span className={`status-message status-message--${posttestVerificationMessage.type || 'loading'}`}>
                  {posttestVerificationMessage.text}
                </span>
              )}
            </div>
          </section>
        </div>
      </section>

      {posttestVerified ? (
        renderSurveyGroup(postSurveyForms)
      ) : (
        <section className="card survey-card">
          <div className="placeholder-panel">사전 검사를 완료한 학생만 사후 검사에 참여할 수 있습니다.</div>
        </section>
      )}
    </div>
  );

  const renderProgressDashboard = () => {
    const scientificSummary = compareResult?.categorySummary?.scientific;
    const misconceptionSummary = compareResult?.categorySummary?.misconception;
    const scientificItems = sortedCompareItems.filter((item) => item.category === '과학적 개념');
    const misconceptionItems = sortedCompareItems.filter((item) => item.category === '오개념');
    const summaryGroups = compareResult
      ? [
          {
            key: 'scientific',
            title: '과학적 개념 문항 요약',
            tag: '과학적 개념',
            summary: scientificSummary
          },
          {
            key: 'misconception',
            title: '오개념 문항 요약',
            tag: '오개념',
            summary: misconceptionSummary
          }
        ]
      : [];

    const averageCharts = compareResult
      ? [
          {
            key: 'scientific-average',
            tag: '그래프 1',
            title: '과학적 개념 문항 평균 비교',
            summary: scientificSummary
          },
          {
            key: 'misconception-average',
            tag: '그래프 2',
            title: '오개념 문항 평균 비교',
            summary: misconceptionSummary
          }
        ]
      : [];

    const graph3Data = scientificSummary
      ? [
          { label: '증가', value: scientificSummary.improved, className: 'tone-up' },
          { label: '동일', value: scientificSummary.same, className: 'tone-neutral' },
          { label: '감소', value: scientificSummary.deepened, className: 'tone-down' }
        ]
      : [];

    const misconceptionDecreaseCount = misconceptionItems.filter((item) => item?.delta !== null && item?.delta < 0).length;
    const misconceptionSameCount = misconceptionItems.filter((item) => item?.delta !== null && item?.delta === 0).length;
    const misconceptionIncreaseCount = misconceptionItems.filter((item) => item?.delta !== null && item?.delta > 0).length;

    const graph4Data = misconceptionSummary
      ? [
          {
            label: '감소',
            value: misconceptionDecreaseCount,
            className: 'tone-up',
            meaning: getMisconceptionMeaningLabel('decrease')
          },
          {
            label: '동일',
            value: misconceptionSameCount,
            className: 'tone-neutral',
            meaning: getMisconceptionMeaningLabel('same')
          },
          {
            label: '증가',
            value: misconceptionIncreaseCount,
            className: 'tone-down',
            meaning: getMisconceptionMeaningLabel('increase')
          }
        ]
      : [];

    const distributionCharts = compareResult
      ? [
          {
            key: 'scientific-distribution',
            tag: '그래프 3',
            title: '과학적 개념 확신도 증가/동일/감소 분포',
            summary: scientificSummary,
            data: graph3Data
          },
          {
            key: 'misconception-distribution',
            tag: '그래프 4',
            title: '오개념 확신도 감소/동일/증가 분포',
            summary: misconceptionSummary,
            data: graph4Data
          }
        ]
      : [];

    const comparisonSections = compareResult
      ? [
          {
            key: 'scientific-table',
            title: '과학적 개념 문항 비교',
            tag: '과학적 개념 문항 비교',
            items: scientificItems
          },
          {
            key: 'misconception-table',
            title: '오개념 문항 비교',
            tag: '오개념 문항 비교',
            items: misconceptionItems
          }
        ]
      : [];

    return (
      <div className="page-stack">
        <section className="card detail-card">
          <div className="section-heading section-heading--stacked compact-gap">
            <div>
              <span className="section-tag">결과 조회</span>
              <h2>학습 변화 확인</h2>
            </div>
            <p>이름과 학번을 모두 입력해 주세요.</p>
          </div>

          <div
            className="search-grid"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                runComparison();
              }
            }}
          >
            <label className="field-label search-field">
              <span>이름</span>
              <input
                className="text-input"
                value={searchName}
                onChange={(event) => setSearchName(event.target.value)}
                placeholder="예: 홍길동"
              />
            </label>
            <label className="field-label search-field">
              <span>학번</span>
              <input
                className="text-input"
                value={searchStudentId}
                onChange={(event) => setSearchStudentId(event.target.value)}
                placeholder="예: 20230001"
              />
            </label>
            <div className="teacher-action-cell">
              <button type="button" className="primary-button" onClick={runComparison}>
                조회
              </button>
            </div>
          </div>

          {compareError && <p className="status-message status-message--error">{compareError}</p>}
          {compareLoading && <p className="status-message status-message--loading">사전/사후 검사 결과를 조회하는 중입니다...</p>}
        </section>

        {compareResult && (
          <>
            <section className="card detail-card">
              <div className="section-heading section-heading--stacked compact-gap">
                <div>
                  <span className="section-tag">학생 정보</span>
                  <h3>조회된 학생 정보</h3>
                </div>
              </div>
              <div className="metrics-grid metrics-grid--student">
                <article className="metric-card">
                  <span>이름</span>
                  <strong>{compareResult.student.name}</strong>
                </article>
                <article className="metric-card">
                  <span>학번</span>
                  <strong>{compareResult.student.studentId}</strong>
                </article>
                <article className="metric-card">
                  <span>사전 응답 시각</span>
                  <strong>{formatDate(compareResult.student.preTimestamp)}</strong>
                </article>
                <article className="metric-card">
                  <span>사후 응답 시각</span>
                  <strong>{formatDate(compareResult.student.postTimestamp)}</strong>
                </article>
              </div>
            </section>

            <div className="content-grid">
              {summaryGroups.map((group) => (
                <section key={group.key} className="card detail-card">
                  <div className="section-heading section-heading--stacked compact-gap">
                    <div>
                      <span className="section-tag">{group.tag}</span>
                      <h3>{group.title}</h3>
                    </div>
                    <p>{group.tag} 문항의 평균과 판정 분포를 확인합니다.</p>
                  </div>
                  <div className="metrics-grid metrics-grid--category-summary">
                    {[
                      { label: '문항 수', value: `${group.summary.questionCount}개` },
                      { label: '사전 평균', value: group.summary.preAvg.toFixed(2) },
                      { label: '사후 평균', value: group.summary.postAvg.toFixed(2) },
                      { label: '평균 변화량', value: `${group.summary.deltaAvg >= 0 ? '+' : ''}${group.summary.deltaAvg.toFixed(2)}` },
                      { label: `${getCategoryStatusLabel(group.tag, '개선')} 수`, value: `${group.summary.improved}개` },
                      { label: `${getCategoryStatusLabel(group.tag, '동일')} 수`, value: `${group.summary.same}개` },
                      { label: `${getCategoryStatusLabel(group.tag, '심화')} 수`, value: `${group.summary.deepened}개` }
                    ].map((metric) => (
                      <article key={metric.label} className="metric-card">
                        <span>{metric.label}</span>
                        <strong>{metric.value}</strong>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="content-grid">
              {averageCharts.map((chart) => (
                <section key={chart.key} className="card detail-card">
                  <div className="section-heading section-heading--stacked compact-gap">
                    <div>
                      <span className="section-tag">{chart.tag}</span>
                      <h3>{chart.title}</h3>
                    </div>
                  </div>
                  <div className="simple-chart">
                    {[
                      { label: '사전 평균', value: chart.summary.preAvg, className: 'tone-neutral' },
                      { label: '사후 평균', value: chart.summary.postAvg, className: 'tone-up' }
                    ].map((bar) => (
                      <div key={bar.label} className="chart-row">
                        <span>{bar.label}</span>
                        <div className="chart-track">
                          <div className={`chart-bar ${bar.className}`} style={{ width: `${(bar.value / 5) * 100}%` }} />
                        </div>
                        <strong>{bar.value.toFixed(2)}</strong>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="content-grid">
              {distributionCharts.map((chart) => (
                <section key={chart.key} className="card detail-card">
                  <div className="section-heading section-heading--stacked compact-gap">
                    <div>
                      <span className="section-tag">{chart.tag}</span>
                      <h3>{chart.title}</h3>
                    </div>
                  </div>
                  <div className="simple-chart">
                    {chart.summary.category === '오개념' && (
                      <p className="body-text chart-note">감소 = 오개념 확신도 감소, 증가 = 오개념 확신도 증가</p>
                    )}
                    {chart.data.map((bar) => (
                      <div key={bar.label} className="chart-row" title={bar.meaning || bar.label}>
                        <span>{bar.label}</span>
                        <div className="chart-track">
                          <div
                            className={`chart-bar ${bar.className}`}
                            style={{ width: `${chart.summary.questionCount ? (bar.value / chart.summary.questionCount) * 100 : 0}%` }}
                          />
                        </div>
                        <strong>{bar.value}</strong>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <section className="card detail-card">
              <div className="section-heading">
                <div>
                  <span className="section-tag">문항별 비교표</span>
                  <h3>문항별 비교</h3>
                </div>
                <label className="field-label search-field search-field--inline">
                  <span>정렬</span>
                  <select className="text-input" value={sortMode} onChange={(event) => setSortMode(event.target.value)}>
                    <option value="original">원래 순서</option>
                    <option value="improved">긍정 변화 큰 순</option>
                    <option value="worsened">주의 변화 큰 순</option>
                  </select>
                </label>
              </div>
              <div className="lesson-detail-stack lesson-detail-stack--compact">
                {comparisonSections.map((section) => (
                  <section key={section.key} className="card nested-section-card">
                    <div className="section-heading section-heading--stacked compact-gap">
                      <div>
                        <span className="section-tag">{section.tag}</span>
                        <h4>{section.title}</h4>
                      </div>
                      <p>{section.items.length}개 문항의 사전/사후 비교 결과입니다.</p>
                    </div>
                    <div className="table-wrap">
                      <table className="compare-table">
                        <thead>
                          <tr>
                            <th>문항명</th>
                            <th>사전 점수</th>
                            <th>사후 점수</th>
                            <th>변화량(Δ)</th>
                            <th>판정</th>
                          </tr>
                        </thead>
                        <tbody>
                          {section.items.map((item) => (
                            <tr key={`${section.key}-${item.question}`}>
                              <td>{item.question}</td>
                              <td>{item.preScore ?? '-'}</td>
                              <td>{item.postScore ?? '-'}</td>
                              <td>{item.delta == null ? '-' : `${item.delta >= 0 ? '+' : ''}${item.delta.toFixed(2)}`}</td>
                              <td>
                                <span className={`tone-pill ${getJudgementTone(item.judgement)}`}>{getCategoryStatusLabel(item.category, item.judgement)}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                ))}
              </div>
            </section>

            <section className="card detail-card">
              <div className="section-heading section-heading--stacked compact-gap">
                <div>
                  <span className="section-tag">AI 추천 학습</span>
                  <h3>부족한 차시 기반 AI 추천</h3>
                </div>
                <p>사전/사후 결과를 바탕으로 복습이 필요한 차시와 다시 보면 좋은 활동 단계를 추천합니다.</p>
              </div>
              <div className="lesson-detail-stack lesson-detail-stack--compact">
                {compareResult.recommendedLessons.length > 0 && (
                  <section className="card nested-section-card">
                    <div className="section-heading section-heading--stacked compact-gap">
                      <div>
                        <span className="section-tag">추천 우선순위</span>
                        <h4>복습이 필요한 차시</h4>
                      </div>
                    </div>
                    <div className="metrics-grid metrics-grid--student">
                      {compareResult.recommendedLessons.map((item) => (
                        <article key={item.lessonKey} className="metric-card">
                          <span>{lessonDisplayNameMap[item.lessonKey] || item.lessonKey}</span>
                          <strong>{item.count}개 부족 문항</strong>
                        </article>
                      ))}
                    </div>
                  </section>
                )}

                <div className="save-row">
                  <button type="button" className="primary-button" onClick={requestAiRecommendation} disabled={aiLoading || !compareResult}>
                    {aiLoading ? 'AI 추천 생성 중...' : 'AI 추천 받기'}
                  </button>
                  {aiError && <span className="status-message status-message--error">{aiError}</span>}
                </div>

                {aiRecommendationChecked && (aiRecommendation || !compareResult.recommendedLessons.length) && (
                  <section className="card nested-section-card">
                    <div className="section-heading section-heading--stacked compact-gap">
                      <div>
                        <span className="section-tag">추천 결과</span>
                        <h4>AI 추천 학습 안내</h4>
                      </div>
                    </div>
                    <p className="body-text">{aiRecommendation || '현재 추가 학습 추천이 필요하지 않습니다.'}</p>
                  </section>
                )}

                {aiRecommendationChecked && !aiError && (
                  showRecommendationLinks && compareResult.recommendedLessons.length > 0 ? (
                    <section className="card nested-section-card">
                      <div className="section-heading section-heading--stacked compact-gap">
                        <div>
                          <span className="section-tag">추천 학습 바로가기</span>
                          <h4>추천 학습 바로가기</h4>
                        </div>
                        <p>현재 결과를 바탕으로 다시 보면 좋은 차시입니다.</p>
                      </div>
                      <div className="recommended-link-row">
                        {compareResult.recommendedLessons.map((item) => (
                          <button
                            key={`recommended-${item.lessonKey}`}
                            type="button"
                            className="primary-button"
                            onClick={() => moveToLesson(item.lessonKey)}
                          >
                            {getLessonQuickLabel(item.lessonKey)} (부족 문항 {item.count}개)
                          </button>
                        ))}
                      </div>
                    </section>
                  ) : (
                    <section className="card nested-section-card">
                      <div className="section-heading section-heading--stacked compact-gap">
                        <div>
                          <span className="section-tag">추천 학습 바로가기</span>
                          <h4>추천 학습 바로가기</h4>
                        </div>
                      </div>
                      <p className="body-text">현재 추가 학습 추천이 필요하지 않습니다.</p>
                    </section>
                  )
                )}
              </div>
            </section>
          </>
        )}
      </div>
    );
  };

  const renderExperimentCard = (experiment) => (
    <article key={experiment.name} className="experiment-card">
      <div className="section-heading section-heading--stacked compact-gap">
        <div>
          <span className="section-tag">실험 섹션</span>
          <h4>{experiment.name}</h4>
        </div>
      </div>

      <div className="lesson-section-block">
        <h5>준비물</h5>
        <div className="material-grid">
          {experiment.materials.map((item) => (
            <span key={item} className="material-chip">
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="lesson-section-block">
        <h5>실험 방법</h5>
        <ol className="step-list">
          {experiment.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>

      {experiment.notes && (
        <div className="lesson-section-block">
          <h5>유의사항</h5>
          <ul className="note-list">
            {experiment.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );

  const renderExperimentOverviewCard = (lesson, options = {}) => {
    const {
      wrapperClassName = 'card detail-card accent-card accent-card--experiment',
      tag = '실험 안내',
      title = '실험 안내',
      description = '실험명, 준비물, 실험 절차를 차례대로 확인한 뒤 활동을 진행합니다.'
    } = options;

    return (
      <section className={wrapperClassName}>
        <div className="section-heading section-heading--stacked compact-gap">
          <div>
            <span className="section-tag">{tag}</span>
            <h3>{title}</h3>
          </div>
          <p>{description}</p>
        </div>
        <div className="experiment-grid">{lesson.experiments.map((experiment) => renderExperimentCard(experiment))}</div>
      </section>
    );
  };

  const renderStudentIdentityCard = (lessonKey) => {
    const student = responseState[lessonKey];
    return (
      <section className="card form-card">
        <div className="section-heading section-heading--stacked compact-gap">
          <div>
            <span className="section-tag">학생 정보</span>
            <h3>이름과 학번 입력</h3>
          </div>
          <p>답변 저장을 위해 학생 이름과 학번을 입력해 주세요.</p>
        </div>
        <div className="student-info-grid">
          <label className="field-label">
            <span>이름</span>
            <input
              type="text"
              value={student.studentName}
              onChange={(event) => handleStudentFieldChange(lessonKey, 'studentName', event.target.value)}
              placeholder="예: 홍길동"
              className="text-input"
            />
          </label>
          <label className="field-label">
            <span>학번</span>
            <input
              type="text"
              value={student.studentId}
              onChange={(event) => handleStudentFieldChange(lessonKey, 'studentId', event.target.value)}
              placeholder="예: 20230001"
              className="text-input"
            />
          </label>
        </div>
      </section>
    );
  };

  const renderResponseSection = (lessonKey, sectionKey, sectionOverride = null, contentAfterHeader = null) => {
    const lesson = detailedLessonData[lessonKey];
    const section = sectionOverride || lesson.responseSections[sectionKey];
    const questionGroups = getSectionQuestionGroups(lessonKey, sectionKey, section);
    const answers = responseState[lessonKey]?.sections?.[sectionKey] ?? {};
    const status = saveStatus[`${lessonKey}-${sectionKey}`];

    if (!questionGroups?.length) {
      return null;
    }

    return (
      <div className="lesson-detail-stack">
        {renderStudentIdentityCard(lessonKey)}

        <section className="card detail-card">
          <div className="section-heading section-heading--stacked compact-gap">
            <div>
              <span className="section-tag">{section.title}</span>
              <h3>{section.title}</h3>
            </div>
            <p>{section.description}</p>
          </div>

          {contentAfterHeader}

          <div className="lesson-detail-stack lesson-detail-stack--compact">
            {questionGroups.map((group, groupIndex) => (
              <section key={group.title} className="card nested-section-card">
                <div className="section-heading section-heading--stacked compact-gap">
                  <div>
                    <span className="section-tag">{group.title}</span>
                    <h4>{group.title}</h4>
                  </div>
                </div>
                <div className="question-form-grid">
                  {(group.questions || []).map((question, promptIndex) => {
                    const answerKey = `g${groupIndex + 1}_q${promptIndex + 1}`;

                    return (
                      <article key={answerKey} className="question-card question-card--input">
                        <span className="info-item-badge">
                          {group.badgePrefix} {promptIndex + 1}
                        </span>
                        <h4>{question.questionText}</h4>
                        <textarea
                          className="response-textarea"
                          value={answers[answerKey] ?? ''}
                          onChange={(event) => handleAnswerChange(lessonKey, sectionKey, answerKey, event.target.value)}
                          placeholder="여기에 답변을 입력하세요."
                        />
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
          <div className="save-row">
            <button
              type="button"
              className="primary-button"
              onClick={() => handleSaveSectionAll({ lessonKey, sectionKey, questionGroups })}
              disabled={status?.type === 'loading'}
            >
              {status?.type === 'loading' ? '저장 중...' : '전체 답안 저장'}
            </button>
            {status && <span className={`status-message status-message--${status.type}`}>{status.message}</span>}
          </div>
        </section>
      </div>
    );
  };




  const getLessonTutorLabel = (lessonKey) => {
    const labels = {
      lesson1: '1차시 AI 보조교사 실행하기',
      lesson2: '2차시 AI 보조교사 실행하기',
      lesson3: '3차시 AI 보조교사 실행하기'
    };

    return labels[lessonKey] || 'AI 보조교사 실행하기';
  };

  const launchLessonTutor = (lessonKey) => {
    const targetUrl = GPT_LINKS[lessonKey];
    if (!targetUrl || typeof window === 'undefined') return;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const renderPredictHelperBanner = (lessonKey) => (
    <section className="card ai-helper-banner">
      <div className="ai-helper-head">
        <span className="section-tag">AI 보조교사</span>
        <button type="button" className="primary-button" onClick={() => launchLessonTutor(lessonKey)}>
          {getLessonTutorLabel(lessonKey)}
        </button>
      </div>
      <p className="body-text ai-helper-note">
        AI 보조교사를 활용하여 자신의 생각을 적어봅시다. 실행한 AI 보조교사는 예상하기 활동 완료 후에도 끄지 말고 유지해주세요.
      </p>
    </section>
  );

  const renderExplainHelperBanner = () => (
    <section className="card ai-helper-banner">
      <span className="section-tag">AI 활용 안내</span>
      <p className="body-text ai-helper-note">실행한 AI 보조교사를 활용하여 아래 제시된 질문에 대한 답을 적어봅시다.</p>
    </section>
  );

  const renderLesson3IcebreakResources = () => (
    <div className="lesson-detail-stack lesson-detail-stack--compact">
      <section className="card info-card">
        <span className="section-tag">도입 자료</span>
        <h3>자료 안내</h3>
        <p>다음은 42.195km 마라톤을 하는 운동선수의 몸속에서 일어나는 생리적 변화에 대한 자료입니다.</p>
      </section>

      <section className="card resource-card">
        <span className="section-tag">자료</span>
        <h3>[자료] 마라톤 선수의 몸속에서 일어나는 생리적 변화</h3>
        <ol className="resource-list">
          {detailedLessonData.lesson3.extraInfoItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>
    </div>
  );


  const renderNextStepButton = (lessonKey) => {
    const currentSubTabId = lessonTabState[lessonKey];
    const nextTab = getNextSubTab(lessonKey, currentSubTabId);

    if (!nextTab) {
      return null;
    }

    return (
      <div className="next-step-row">
        <button
          type="button"
          className="primary-button next-step-button"
          onClick={() => moveToNextSubTab(lessonKey, currentSubTabId)}
        >
          다음: {nextTab.label}
        </button>
      </div>
    );
  };

  const renderAITutor = (lessonKey) => {
    return (
      <div className="lesson-detail-stack ai-guide-layout">
        <section className="card detail-card ai-guide-card">
          <div className="section-heading section-heading--stacked compact-gap">
            <div>
              <span className="section-tag">AI 보조교사</span>
              <h3>AI 보조교사와 함께 학습하기</h3>
            </div>
          </div>
          <p className="body-text">
            이 활동에서는 AI 보조교사와 대화하면서 실험 전 예상 활동, 실험 관찰, 실험 후 설명 활동을 진행합니다.
          </p>
          <p className="support-text ai-note">
            AI 보조교사는 정답을 바로 알려주기보다 여러분의 생각을 말로 표현하고 관찰 결과를 바탕으로 설명하도록 돕습니다.
          </p>
        </section>

        <section className="card detail-card ai-guide-card ai-launch-card">
          <div className="section-heading section-heading--stacked compact-gap">
            <div>
              <span className="section-tag">GPT 실행</span>
              <h3>{getLessonTutorLabel(lessonKey)}</h3>
            </div>
          </div>
          <button type="button" className="ai-launch-button" onClick={() => launchLessonTutor(lessonKey)}>
            {getLessonTutorLabel(lessonKey)}
          </button>
          <p className="support-text ai-note">새 창에서 GPT가 열립니다. 활동 후 다시 코스웨어로 돌아와 답안을 정리하세요.</p>
        </section>

        <section className="card detail-card ai-guide-card">
          <div className="section-heading section-heading--stacked compact-gap">
            <div>
              <span className="section-tag">활용 가이드</span>
              <h3>AI 보조교사 활용 가이드</h3>
            </div>
          </div>

          <section className="ai-guide-section">
            <h4>1. 활동 진행 방법</h4>
            <div className="ai-guide-item">
              <h5>① 실험 전 예상 활동</h5>
              <ul className="note-list note-list--spacious">
                <li>AI 보조교사가 활동지에 제시된 실험 전 질문을 하나씩 제시합니다.</li>
                <li>각 질문에 대하여 자신의 생각을 자유롭게 작성하면 됩니다.</li>
                <li>이 단계에서는 정답을 맞추는 것이 목적이 아니므로, 자신의 생각을 솔직하게 적는 것이 중요합니다.</li>
              </ul>
            </div>
            <div className="ai-guide-item">
              <h5>② 관찰 활동</h5>
              <ul className="note-list note-list--spacious">
                <li>여러분이 실제 실험을 수행하는 단계입니다.</li>
                <li>실험을 마친 후, AI 보조교사에게 다음과 같이 입력합니다.</li>
              </ul>
              <div className="ai-guide-callout">실험이 끝났습니다.</div>
              <p className="support-text">이후 AI 보조교사는 활동지에 제시된 실험 후 질문을 제시합니다.</p>
            </div>
            <div className="ai-guide-item">
              <h5>③ 실험 후 설명 활동</h5>
              <p className="support-text">여러분이 관찰한 실험 결과를 바탕으로 AI 보조교사와 대화를 하면서 다음을 정리합니다.</p>
              <ul className="note-list note-list--spacious">
                <li>관찰한 결과는 무엇인지</li>
                <li>처음 예측과 어떤 점이 같거나 다른지</li>
                <li>그 이유를 과학적으로 어떻게 설명할 수 있는지</li>
              </ul>
              <p className="support-text">AI 보조교사는 여러분이 스스로 생각할 수 있도록 추가 질문을 통해 사고를 확장시켜 줍니다.</p>
            </div>
          </section>

          <section className="ai-guide-section">
            <h4>2. AI 보조교사와 대화할 때 주의할 점</h4>
            <div className="ai-guide-item">
              <h5>① 질문에는 가능한 구체적으로 답해주세요.</h5>
              <ul className="note-list note-list--spacious">
                <li>너무 짧게 적으면 AI 보조교사가 여러분의 생각을 이해하기 어렵습니다.</li>
                <li>한 문장 이상으로, 이유나 근거와 함께 자세하게 설명하는 것이 좋습니다.</li>
              </ul>
            </div>
            <div className="ai-guide-item">
              <h5>② 실험 전 예측이 틀려도 괜찮습니다.</h5>
              <ul className="note-list note-list--spacious">
                <li>이 활동은 정답을 맞추는 것이 목적이 아니라 여러분의 생각을 표현하는 것이 중요한 활동입니다.</li>
                <li>처음 예측이 실제 결과와 달라도 괜찮습니다.</li>
              </ul>
            </div>
            <div className="ai-guide-item">
              <h5>③ AI 보조교사는 여러분에게 정답을 바로 알려주지 않아요.</h5>
              <ul className="note-list note-list--spacious">
                <li>대신 여러분이 스스로 생각하도록 추가 질문을 할 수 있습니다.</li>
                <li>이것은 생각을 더 깊게 해보기 위한 과정입니다.</li>
              </ul>
            </div>
            <div className="ai-guide-item">
              <h5>④ 한 번에 하나의 질문만 제시됩니다.</h5>
              <p className="support-text">현재 질문에 답한 후 다음 질문으로 진행하세요.</p>
            </div>
            <div className="ai-guide-item">
              <h5>⑤ AI 보조교사는 수업 외 질문에는 반응하지 않아요.</h5>
              <p className="support-text">AI 코스웨어에서 제시하는 질문에 여러분의 생각을 작성해 보는 활동에 집중해 봅시다.</p>
            </div>
          </section>
        </section>
      </div>
    );
  };

  const renderSummarySection = (lessonKey) => {
    const lesson = detailedLessonData[lessonKey];
    const summaryQuestions = lesson?.summaryQuestions || [];
    const summarySection = lesson?.responseSections?.summary;

    if (!summarySection) {
      return null;
    }

    const sectionOverride =
      summaryQuestions.length > 0
        ? {
            ...summarySection,
            groups: [
              {
                ...(summarySection.groups?.[0] || { title: '정리하기', badgePrefix: '정리' }),
                prompts: summaryQuestions
              }
            ]
          }
        : summarySection;

    return renderResponseSection(lessonKey, 'summary', sectionOverride);
  };

  const renderDetailedLesson = (lessonKey) => {
    const lesson = detailedLessonData[lessonKey];
    let content = null;

    if (activeSubTab === 'review') {
      content = (
        <div className="lesson-detail-stack">
          <section className="card detail-card accent-card accent-card--review">
            <div className="section-heading section-heading--stacked compact-gap">
              <div>
                <span className="section-tag">이전 차시 학습 확인</span>
                <h3>이전 차시 학습 확인</h3>
              </div>
              <p>{lesson.reviewCards[0]}</p>
            </div>
            <div className="info-list-grid">
              {lesson.reviewCards.map((item, index) => (
                <article key={item} className="info-item-card">
                  <span className="info-item-badge">요약 {index + 1}</span>
                  <p>{item}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      );
    } else if (activeSubTab === 'goal') {
      content = (
        <div className="lesson-detail-stack">
          <section className="card detail-card accent-card accent-card--goal">
            <div className="section-heading section-heading--stacked compact-gap">
              <div>
                <span className="section-tag">{lesson.goalBadge}</span>
                <h3>학습목표</h3>
              </div>
              <p>{lesson.summary}</p>
            </div>
            <div className="info-list-grid">
              {lesson.goals.map((item, index) => (
                <article key={item} className="info-item-card">
                  <span className="info-item-badge">목표 {index + 1}</span>
                  <p>{item}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      );
    } else if (activeSubTab === 'video' && lesson.videos) {
      content = (
        <div className="lesson-detail-stack">
          <section className="card detail-card accent-card accent-card--media">
            <div className="section-heading section-heading--stacked compact-gap">
              <div>
                <span className="section-tag">{lesson.videoTitle}</span>
                <h3>{lesson.videoTitle}</h3>
              </div>
              <p>{lesson.videoDescription}</p>
            </div>
            <div className="video-card-list">
              {lesson.videos.map((video) => (
                <article key={video.embedUrl} className="video-embed-card">
                  <h4>{video.title}</h4>
                  {video.prompt && <p className="video-prompt">{video.prompt}</p>}
                  <iframe
                    src={video.embedUrl}
                    title={video.title}
                    className="lesson-video-frame"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </article>
              ))}
            </div>
          </section>
        </div>
      );
    } else if (activeSubTab === 'icebreak') {
      const contentAfterHeader = lessonKey === 'lesson3' ? renderLesson3IcebreakResources() : null;
      content = renderResponseSection(lessonKey, 'icebreak', null, contentAfterHeader);
    } else if (activeSubTab === 'experiment') {
      content = <div className="lesson-detail-stack">{renderExperimentOverviewCard(lesson)}</div>;
    } else if (activeSubTab === 'predict') {
      content = renderResponseSection(lessonKey, 'predict', null, renderPredictHelperBanner(lessonKey));
    } else if (activeSubTab === 'observe') {
      const observeExtraContent = renderExperimentOverviewCard(lesson, {
        wrapperClassName: 'card nested-section-card',
        tag: '실험 안내 다시 보기',
        title: '실험 안내 다시 보기',
        description: '관찰 내용을 기록하기 전에 같은 차시의 실험 안내를 다시 확인해 보세요.'
      });
      content = renderResponseSection(lessonKey, 'observe', null, observeExtraContent);
    } else if (activeSubTab === 'explain') {
      content = renderResponseSection(lessonKey, 'explain', null, renderExplainHelperBanner());
    } else if (activeSubTab === 'summary') {
      content = renderSummarySection(lessonKey);
    } else if (activeSubTab === 'ai') {
      content = renderAITutor(lessonKey);
    }

    if (!content) {
      return null;
    }

    return (
      <div className="lesson-tab-stage">
        {content}
        {renderNextStepButton(lessonKey)}
      </div>
    );
  };

  const renderLesson = () => (
    <div className="lesson-layout">
      <aside className="card lesson-sidebar">
        <span className="section-tag">차시 서브탭</span>
        <h2 className="lesson-title">{activeLesson.title}</h2>
        <p>{activeLesson.summary}</p>
        <div className="subtab-list">
          {lessonTabs.map((tab, index) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`subtab-button ${isActive ? 'active' : ''}`}
                onClick={() => handleSubTabChange(activeTopTab, tab.id)}
              >
                <span className="subtab-step-number">{index + 1}</span>
                <span className="subtab-label">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="card lesson-content">
        <div className="section-heading section-heading--stacked">
          <div>
            <span className="section-tag">{activeLesson.title}</span>
            <h2>{activeSubTabLabel}</h2>
          </div>
          <p>{activeLesson.summary}</p>
        </div>
        {renderDetailedLesson(activeTopTab)}
      </section>
    </div>
  );

  const renderTeacherView = () => (
    <div className="page-stack">
      <section className="card assessment-card">
        <div className="section-heading section-heading--align-start">
          <div>
            <span className="section-tag">Teacher View</span>
            <h2>교사용 보기</h2>
          </div>
        </div>
        <p className="body-text">차시와 단계 기준으로 저장된 학생 응답을 확인할 수 있습니다.</p>
      </section>

      <section className="card detail-card">
        <div className="filter-grid">
          <label className="field-label">
            <span>차시 선택</span>
            <select
              className="text-input"
              value={teacherFilter.lesson}
              onChange={(event) => setTeacherFilter((current) => ({ ...current, lesson: event.target.value }))}
            >
              <option value="lesson1">1차시</option>
              <option value="lesson2">2차시</option>
              <option value="lesson3">3차시</option>
            </select>
          </label>
          <label className="field-label">
            <span>단계 선택</span>
            <select
              className="text-input"
              value={teacherFilter.section}
              onChange={(event) => setTeacherFilter((current) => ({ ...current, section: event.target.value }))}
            >
              {teacherSectionOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <div className="teacher-action-cell">
            <button type="button" className="primary-button" onClick={fetchTeacherResponses}>
              응답 새로고침
            </button>
          </div>
        </div>
      </section>

      <section className="card detail-card">
        {teacherMeta.loading && <p className="body-text">응답을 불러오는 중입니다...</p>}
        {!teacherMeta.loading && teacherMeta.error && <p className="status-message status-message--error">{teacherMeta.error}</p>}
        {!teacherMeta.loading && !teacherMeta.error && teacherResponses.length === 0 && teacherMeta.fetched && (
          <div className="placeholder-panel">선택한 조건에 해당하는 응답이 아직 없습니다.</div>
        )}
        {!teacherMeta.loading && !teacherMeta.error && teacherResponses.length > 0 && (
          <div className="teacher-response-list">
            {teacherResponses.map((item, index) => (
              <article key={`${item.studentId ?? 'student'}-${item.savedAt ?? index}`} className="teacher-response-card">
                <div className="teacher-response-meta">
                  <span className="info-item-badge">{item.savedAt || '저장 시각 없음'}</span>
                  <strong>
                    {item.studentName || '이름 없음'} / {item.studentId || '학번 없음'}
                  </strong>
                  <span>
                    {item.lesson || teacherFilter.lesson} · {item.section || teacherFilter.section}
                  </span>
                </div>
                <div className="teacher-answer-grid">
                  {Object.entries(item.answers || {}).map(([key, value]) => (
                    <div key={key} className="teacher-answer-item">
                      <strong>{key}</strong>
                      {key === 'q2Drawing' && typeof value === 'string' && value.startsWith('data:image') ? (
                        <div className="teacher-drawing-preview">
                          <img src={value} alt="학생 순환계 화살표 그림" />
                        </div>
                      ) : (
                        <p>{String(value || '')}</p>
                      )}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );

  const renderProgress = () => (
    <div className="page-stack">
      <section className="card assessment-card">
        <span className="section-tag">비교 확인</span>
        <h2>학습 변화 확인</h2>
        <p className="body-text">사전 검사와 사후 검사 결과를 비교하여 학습 변화를 확인하는 영역입니다.</p>
      </section>

      <div className="content-grid">
        <section className="card placeholder-card">
          <div className="section-heading section-heading--stacked compact-gap">
            <div>
              <span className="section-tag">그래프 영역</span>
              <h3>사전/사후 비교 그래프</h3>
            </div>
          </div>
          <div className="placeholder-panel placeholder-panel--medium">사전/사후 검사 비교 그래프가 들어갈 영역입니다.</div>
        </section>

        <section className="card placeholder-card">
          <div className="section-heading section-heading--stacked compact-gap">
            <div>
              <span className="section-tag">문항 분석</span>
              <h3>문항별 변화 분석</h3>
            </div>
          </div>
          <div className="placeholder-panel placeholder-panel--medium">문항별 변화 분석 결과가 들어갈 영역입니다.</div>
        </section>
      </div>
    </div>
  );

  const renderContent = () => {
    if (activeTopTab === 'home') return renderHome();
    if (activeTopTab === 'pretest') {
      return renderPretestPanel();
    }
    if (activeTopTab === 'posttest') {
      return renderPosttestPanel();
    }
    if (activeTopTab === 'progress') return renderProgressDashboard();
    if (isLessonTab) return renderLesson();
    return null;
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <span className="app-badge">AI Courseware Structure Preview</span>
          <h1>기관계(소화, 순환, 호흡, 배설) AI 코스웨어</h1>
        </div>
      </header>

      <nav className="top-tab-bar" aria-label="상단 메인 탭">
        {topTabs.map((tab) => {
          const isActive = activeTopTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`top-tab ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTopTab(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      <main>{renderContent()}</main>
    </div>
  );
}

export default App;
