import React, { useMemo, useState } from 'react';

const topTabs = [
  { id: 'home', label: '홈' },
  { id: 'pretest', label: '사전 검사' },
  { id: 'lesson1', label: '1차시' },
  { id: 'lesson2', label: '2차시' },
  { id: 'lesson3', label: '3차시' },
  { id: 'posttest', label: '사후 검사' },
  { id: 'progress', label: '학습 변화 확인' }
];

const lessonSubTabs = [
  { id: 'goal', label: '학습목표' },
  { id: 'video', label: '영상' },
  { id: 'icebreak', label: '생각열기' },
  { id: 'experiment', label: '실험안내' },
  { id: 'predict', label: '예상하기' },
  { id: 'explain', label: '설명하기' }
];

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
    videoTitle: '동기 유발 영상',
    videoDescription:
      '마라톤 선수가 경기 중 바나나를 먹는 장면을 보고, 먹은 음식이 몸속에서 어떻게 에너지로 이어지는지 생각해 본다.',
    videoPlaceholder: '마라톤 선수가 경기 중 바나나를 먹는 영상이 들어갈 영역입니다.',
    videoSupport: '먹은 음식이 소화되어 우리 몸의 에너지와 연결되는 과정을 떠올리며 영상을 살펴보세요.',
    icebreakQuestions: [
      '마라톤 선수가 먹은 바나나가 어떻게 근육을 움직이는 에너지가 될까요?',
      '소화되고 남은 물질은 어떻게 우리 몸을 빠져나올까요?'
    ],
    icebreakSupport: '추후 학생 입력창이 연결될 예정입니다.',
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
    predictBanner: '추후 AI 보조교사(GPT)와 연동될 예정입니다.',
    predictDescription: '실험을 수행하기 전에 아래 질문에 대해 자신의 생각을 정리해 봅니다.',
    predictSections: [
      {
        title: '예상 질문',
        badgePrefix: '예상 질문',
        questions: [
          '녹말-셀로판 튜브를 담근 비커의 아이오딘-아이오딘화 칼륨 용액과의 반응 결과는 어떠할까요? 그렇게 생각한 이유도 함께 적어봅시다.',
          '포도당-셀로판 튜브를 담근 비커의 베네딕트 반응 결과는 어떠할까요? 그렇게 생각한 이유도 함께 적어봅시다.',
          '녹말 + 침 용액 셀로판 튜브를 담가둔 비커의 아이오딘-아이오딘화 칼륨 용액과 베네딕트 반응 결과는 각각 어떠할까요? 그렇게 생각한 이유도 함께 적어봅시다.',
          '소화 과정은 에너지 생성 과정일까요? 여러분의 생각을 자유롭게 적어봅시다.'
        ]
      }
    ],
    predictSupport: '아직 채팅/입력 기능은 연결하지 않았으며, 추후 답변 작성 영역이 추가될 예정입니다.',
    explainBanner: '추후 AI 보조교사와 함께 설명을 정교화하는 기능이 연결될 예정입니다.',
    explainDescription: '실험 결과를 바탕으로 다음 질문에 대해 설명을 정리해 봅니다.',
    explainSections: [
      {
        title: '설명 질문',
        badgePrefix: '설명 질문',
        questions: [
          '각각의 튜브에서 나타난 색 변화가 어떤 물질의 이동 때문인지 설명해 봅시다.',
          '이번 실험에서 관찰된 과정이 에너지를 생성하는 과정이라고 볼 수 있을까요?',
          '실험 과정에서 녹말 용액과 침을 함께 넣은 용액에서 검출된 물질은 무엇인가요? 침의 어떤 성분에 의해 이러한 결과가 나타났을까요? 그리고 그 성분이 생물체의 ‘세포’ 혹은 ‘물질’인가요?',
          '셀로판 튜브는 우리 몸의 기관 중 어느 것에 해당할지 적어보고, 셀로판 튜브를 통과한 영양소는 우리 몸에서 어느 곳으로 이동할지, 또, 셀로판 튜브 안에 남아서 통과하지 못한 물질은 우리 몸 안으로 들어왔다고 할 수 있는지 적어봅시다.',
          '우리 몸에서 침과 같이 소화를 도와주는 물질이 분비되는 곳은 어느 기관이 있나요? 그리고 그 기관에서 직접적으로 소화 과정을 수행하는지 적어봅시다.'
        ]
      }
    ],
    explainSupport: '추후 학생 작성 영역과 AI 보조 피드백 기능이 연결될 예정입니다.',
    wrapUpTitle: '오늘 배운 내용 정리하기',
    wrapUpDescription: '오늘 학습한 내용을 세포 호흡의 관점까지 연결하여 정리해 봅니다.',
    wrapUpPrompts: [
      '세포 호흡의 관점에서 소화계가 하는 역할은?',
      '세포 호흡 공장이 멈추지 않고 계속 돌아가려면 소화계는 어떤 도움을 주어야 할지 적어봅시다.',
      '오늘 수업을 통해 생각이 변화된 것이 있다면 자유롭게 적어주세요.'
    ],
    wrapUpSupport: '추후 학생이 자유롭게 정리 내용을 작성할 수 있는 영역이 연결될 예정입니다.'
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
    videoTitle: '동기 유발 자료',
    videoDescription:
      '마라톤 선수와 일반인의 평상시 심박수 자료, 그리고 순환계 모식도를 보며 운동 중 혈액의 흐름과 산소 운반을 생각해 보는 영역입니다.',
    videoPlaceholder: '마라톤 선수와 일반인의 평상시 심박수 자료 또는 순환계 모식도 자료가 들어갈 영역입니다.',
    videoSupport: '운동 중 혈액의 흐름과 산소 운반이 어떻게 달라질지 떠올리며 자료를 살펴보세요.',
    icebreakQuestions: [
      '마라톤 선수들은 어떻게 지치지 않고 계속해서 달릴 수 있을까요?',
      '아래 그림은 우리 몸의 순환계를 구조화한 모식도입니다. 경기 중인 마라톤 선수의 몸속에서 혈액이 어떻게 이동할지 생각해 보고, 모식도에 화살표로 나타내 봅시다.',
      '모식도에 나와 있는 각 혈관의 명칭과 그 혈관을 지나는 혈액의 산소의 양도 함께 표시해 봅시다.'
    ],
    icebreakSupport: '추후 학생 입력창 또는 도식 작성 기능이 연결될 예정입니다.',
    icebreakExtraPlaceholder: '모식도 작성 활동이 들어갈 영역입니다.',
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
    predictBanner: '추후 AI 보조교사(GPT)와 연동될 예정입니다.',
    predictDescription: '실험을 수행하기 전에 아래 질문에 대해 자신의 생각을 정리해 봅니다.',
    predictSections: [
      {
        title: '순환계 실험',
        badgePrefix: '순환계 질문',
        questions: [
          '심장 박동이 느껴지는 곳에 손을 대봅시다. 심장은 우리 몸의 어느 부분에 위치하고 있나요?',
          '1분간 격렬하게 운동을 한 직후, 자신의 심박수(BPM)는 안정 시 심박수와 비교하여 얼마나 달라질지 적어봅시다. 그리고 심박수 조절은 어느 기관에서 할지 적어봅시다.',
          '운동을 할 때, 심장 박동의 변화에 따라 혈관에서 흐르는 혈액의 양은 어떻게 변화할까요?',
          '심장에서 폐로 흐르는 혈관에는 산소가 (많은 / 적은) 혈액이 흐를 것이다. 여러분이 생각하는 답을 선택해 보세요.'
        ]
      },
      {
        title: '호흡계 실험',
        badgePrefix: '호흡계 질문',
        questions: [
          '평상시와 운동 직후, 어느 때에 불어넣은 날숨이 BTB 용액을 더 빨리 노란색으로 변화시킬지, 그 이유와 함께 적어봅시다.',
          '우리 몸에서 호흡은 어디에서 일어날까요?',
          '들숨과 날숨에서 각각 산소와 이산화탄소의 비율은 어떻게 될까요?'
        ]
      }
    ],
    predictSupport: '아직 채팅/입력 기능은 구현하지 않았으며, 추후 학생 답변 영역이 연결될 예정입니다.',
    explainBanner: '추후 AI 보조교사와 함께 설명을 정교화하는 기능이 연결될 예정입니다.',
    explainDescription: '실험 결과를 바탕으로 다음 질문에 대해 설명을 정리해 봅니다.',
    explainSections: [
      {
        title: '순환계 실험 후 질문',
        badgePrefix: '순환계 설명',
        questions: [
          '심장 박동이 느껴지는 곳에 손을 대봅시다. 심장은 우리 몸의 어느 부분에 위치하고 있나요?',
          '운동을 하는 과정에서 심박수가 빨라졌을 때, 혈액이 흐르는 속도와 우리 몸 혈액의 전체 양은 각각 어떻게 될까요?',
          '심장에서 폐로 이산화탄소를 운반하는 혈관은 어디일까요? 그리고 그 혈관에 흐르는 산소의 양은 어떠할까요? 그 혈관의 명칭과 함께 생각해봅시다.',
          '실험 결과를 토대로 안정 시 심박수와 운동 후 심박수, 회복 후 심박수의 변화를 세포 호흡의 관점에서 설명해 봅시다.'
        ]
      },
      {
        title: '호흡계 실험 후 질문',
        badgePrefix: '호흡계 설명',
        questions: [
          '실험 결과, 어느 비커에서 BTB 용액이 노란색으로 더 빠르게 변하였나요?',
          '우리 몸에서 호흡은 어디에서 일어나는 활동인가요? 호흡이 일어나는 장소에 대해서 적어봅시다.',
          '안정된 상태에서와 운동 후 들숨과 날숨에서 각각 산소와 이산화탄소의 비율은 각각 어떻게 될까요?',
          '우리가 들이마신 공기는 어떤 경로를 통해서 우리 몸 내부로 이동하는 것인지 적어봅시다.'
        ]
      }
    ],
    explainSupport: '추후 학생 작성 영역과 AI 보조 피드백 기능이 연결될 예정입니다.',
    wrapUpTitle: '오늘 배운 내용 정리하기',
    wrapUpDescription: '순환계와 호흡계가 세포 호흡을 돕는 방식을 연결하여 정리해 봅니다.',
    wrapUpPrompts: [
      '세포 호흡의 관점에서 순환계가 하는 역할은?',
      '세포 호흡의 관점에서 호흡계가 하는 역할은?',
      '세포 호흡 공장이 멈추지 않고 계속 돌아가려면 순환계와 호흡계는 각각 어떤 도움을 주어야 할지 적어봅시다.',
      '오늘 수업을 통해 생각이 변화된 것이 있다면 자유롭게 적어주세요.'
    ],
    wrapUpSupport: '추후 학생이 자신의 설명을 정리해 입력할 수 있는 영역이 연결될 예정입니다.'
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
    videoTitle: '동기 유발 자료',
    videoDescription:
      '마라톤 선수의 몸속에서 일어나는 생리적 변화 자료를 보고, 요소 생성과 노폐물 배출의 필요성을 생각해 보는 영역입니다.',
    videoPlaceholder: '마라톤 선수의 몸속에서 일어나는 생리적 변화 자료가 들어갈 영역입니다.',
    videoSupport: '운동 후 몸속에서 생성된 노폐물이 어떤 경로로 배출될지 생각하며 자료를 살펴보세요.',
    icebreakQuestions: [
      '마라톤 선수의 오줌에서 요소 농도가 높아지는 현상을 세포 호흡 및 물질의 이동 경로와 관련지어 설명해 봅시다.',
      '세포 호흡의 결과물인 ‘요소’와 같은 노폐물이 혈액에 계속 쌓인다면, 우리 몸 전체에 어떤 문제가 생길까요?',
      '마라톤 선수가 바나나를 먹고 소화 과정을 통해 우리 몸으로 흡수된 영양소가 세포에서 사용되고 생성된 물질은 어떻게 우리 몸을 빠져나올까요?'
    ],
    icebreakSupport: '추후 학생 입력창이 연결될 예정입니다.',
    icebreakInfoCard: {
      title: '추가 자료',
      items: [
        '호흡 속도와 심장박동 속도가 빨라져 근육에서 에너지를 효율적으로 얻을 수 있다.',
        '많은 에너지가 소비되므로 일정 지점마다 제공되는 음식물(바나나 등)을 먹고 소화한다.',
        '몸 속에 요소 생성량이 많아진다.'
      ]
    },
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
    predictBanner: '추후 AI 보조교사(GPT)와 연동될 예정입니다.',
    predictDescription: '실험을 수행하기 전에 아래 질문에 대해 자신의 생각을 정리해 봅니다.',
    predictSections: [
      {
        title: '예상 질문',
        badgePrefix: '예상 질문',
        questions: [
          '30분 뒤, 튜브 밖 비커의 물(증류수) 속으로 빠져나오는 물질은 무엇일까요? 그렇게 생각한 이유도 함께 적어봅시다.',
          '실험에서 사용한 셀로판 튜브와 비커는 우리 몸의 어느 기관에 해당할까요? 자유롭게 적어봅시다.'
        ]
      }
    ],
    predictSupport: '아직 채팅/입력 기능은 구현하지 않았으며, 추후 학생 답변 영역이 연결될 예정입니다.',
    explainBanner: '추후 AI 보조교사와 함께 설명을 정교화하는 기능이 연결될 예정입니다.',
    explainDescription: '실험 결과를 바탕으로 다음 질문에 대해 설명을 정리해 봅니다.',
    explainSections: [
      {
        title: '실험 후 질문',
        badgePrefix: '설명 질문',
        questions: [
          '실험에서 셀로판 튜브와 비커는 우리 몸의 배설계를 이루는 기관 중 각각 무엇에 해당하고 어떤 역할을 하는 것일까요?',
          '셀로판 튜브에 남은 물질은 우리 몸에서 무엇을 의미할까요?',
          '비커에 모인 액체는 우리 몸에서 생성되는 물질 중 무엇에 해당하는지 쓰고, 이 액체가 생성되는 과정을 우리 몸의 배설계를 이루는 기관을 포함하여 설명해 봅시다.',
          '소화계에서 소화 과정을 마치고 나온 찌꺼기와 배설계에서 배설 경로를 거쳐 우리 몸에서 빠져나가는 노폐물은 같은 것인가요?',
          '이 모형에서는 배설계에서 일어나는 과정 중 드러나지 않는 과정이 있습니다. 어떤 과정일까요?'
        ]
      }
    ],
    explainSupport: '추후 학생 작성 영역과 AI 보조 피드백 기능이 연결될 예정입니다.',
    wrapUpTitle: '오늘 배운 내용 정리하기',
    wrapUpDescription: '배설계가 세포 호흡의 결과물과 몸속 환경 유지에 어떤 역할을 하는지 정리해 봅니다.',
    wrapUpPrompts: [
      '세포 호흡의 관점에서 배설계가 하는 역할은?',
      '세포 호흡 공장이 멈추지 않고 계속 돌아가려면 배설계는 어떤 도움을 주어야 할지 적어봅시다.',
      '오늘 수업을 통해 생각이 변화된 것이 있다면 자유롭게 적어주세요.'
    ],
    wrapUpSupport: '추후 학생이 자유롭게 정리 내용을 작성할 수 있는 영역이 연결될 예정입니다.'
  }
};

const lessonContent = {
  lesson1: {
    title: detailedLessonData.lesson1.title,
    summary: detailedLessonData.lesson1.summary,
    placeholders: {
      goal: '1차시 학습목표가 들어갈 영역입니다.',
      video: '1차시 동기유발 영상이 들어갈 영역입니다.',
      icebreak: '1차시 생각 열기 질문이 들어갈 영역입니다.',
      experiment: '1차시 실험 준비물, 방법, 실험 영상이 들어갈 영역입니다.',
      predict: '1차시 예상하기(GPT 활용) 영역입니다.',
      explain: '1차시 설명하기(GPT 활용) 영역입니다.'
    }
  },
  lesson2: {
    title: detailedLessonData.lesson2.title,
    summary: detailedLessonData.lesson2.summary,
    placeholders: {
      goal: '2차시 학습목표가 들어갈 영역입니다.',
      video: '2차시 동기유발 영상이 들어갈 영역입니다.',
      icebreak: '2차시 생각 열기 질문이 들어갈 영역입니다.',
      experiment: '2차시 실험 준비물, 방법, 실험 영상이 들어갈 영역입니다.',
      predict: '2차시 예상하기(GPT 활용) 영역입니다.',
      explain: '2차시 설명하기(GPT 활용) 영역입니다.'
    }
  },
  lesson3: {
    title: detailedLessonData.lesson3.title,
    summary: detailedLessonData.lesson3.summary,
    placeholders: {
      goal: '3차시 학습목표가 들어갈 영역입니다.',
      video: '3차시 동기유발 영상이 들어갈 영역입니다.',
      icebreak: '3차시 생각 열기 질문이 들어갈 영역입니다.',
      experiment: '3차시 실험 준비물, 방법, 실험 영상이 들어갈 영역입니다.',
      predict: '3차시 예상하기(GPT 활용) 영역입니다.',
      explain: '3차시 설명하기(GPT 활용) 영역입니다.'
    }
  }
};

const quickLinks = [
  { id: 'pretest', title: '사전 검사 바로가기', caption: '수업 전 개념 검사를 먼저 진행합니다.' },
  { id: 'lesson1', title: '1차시 바로가기', caption: '소화계 학습 구조를 확인합니다.' },
  { id: 'lesson2', title: '2차시 바로가기', caption: '순환계·호흡계 학습 구조를 확인합니다.' },
  { id: 'lesson3', title: '3차시 바로가기', caption: '배설계 학습 구조를 확인합니다.' },
  { id: 'progress', title: '학습 변화 확인 바로가기', caption: '사전/사후 비교 영역 구성을 확인합니다.' }
];

const usageSteps = [
  '1) 사전 검사를 실시합니다.',
  '2) 1~3차시 학습을 진행합니다.',
  '3) 사후 검사를 실시합니다.',
  '4) 학습 변화 확인 탭에서 결과를 비교합니다.'
];

function App() {
  const [activeTopTab, setActiveTopTab] = useState('home');
  const [lessonTabState, setLessonTabState] = useState({
    lesson1: 'goal',
    lesson2: 'goal',
    lesson3: 'goal'
  });

  const isLessonTab = ['lesson1', 'lesson2', 'lesson3'].includes(activeTopTab);
  const activeLesson = lessonContent[activeTopTab];
  const activeSubTab = lessonTabState[activeTopTab];
  const activeSubTabLabel = useMemo(
    () => lessonSubTabs.find((tab) => tab.id === activeSubTab)?.label ?? '',
    [activeSubTab]
  );

  const handleSubTabChange = (lessonKey, subTabId) => {
    setLessonTabState((current) => ({
      ...current,
      [lessonKey]: subTabId
    }));
  };

  const renderHome = () => (
    <div className="page-stack">
      <section className="card hero-card">
        <div className="hero-copy">
          <span className="section-tag">Student Courseware Preview</span>
          <h2>기관계의 통합적 작용 AI 코스웨어</h2>
          <p>
            이 코스웨어는 기관계의 통합적 작용을 주제로 한 3차시 POE 기반 학습 프로그램입니다.
            현재 버전은 Netlify에서 전체 탭 구조와 화면 흐름을 먼저 확인하기 위한 UI 시안입니다.
          </p>
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
          <h3>구조 확인용 화면</h3>
          <p>
            실제 Google Form, GPT, 결과 분석 기능은 아직 연결하지 않았으며 각 탭은 placeholder 카드와 문구로
            구성되어 있습니다. 우선은 상단 메인 탭과 차시별 서브탭 흐름을 검토할 수 있도록 정리했습니다.
          </p>
        </section>
      </div>

      <section className="card shortcuts-card">
        <div className="section-heading">
          <div>
            <span className="section-tag">바로가기</span>
            <h3>주요 탭 빠르게 이동</h3>
          </div>
          <p>구조 검토를 위해 자주 확인하는 화면으로 바로 이동할 수 있습니다.</p>
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

  const renderQuestionSection = (section, supportText) => (
    <section key={section.title} className="card detail-card">
      <div className="section-heading section-heading--stacked compact-gap">
        <div>
          <span className="section-tag">{section.title}</span>
          <h3>{section.title}</h3>
        </div>
      </div>
      <div className="question-grid">
        {section.questions.map((question, index) => (
          <article key={question} className="question-card">
            <span className="info-item-badge">
              {section.badgePrefix} {index + 1}
            </span>
            <h4>{question}</h4>
            <p className="support-text">{supportText}</p>
          </article>
        ))}
      </div>
    </section>
  );

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

  const renderDetailedLesson = (lessonKey) => {
    const lesson = detailedLessonData[lessonKey];

    if (activeSubTab === 'goal') {
      return (
        <div className="lesson-detail-stack">
          <section className="card detail-card">
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
    }

    if (activeSubTab === 'video') {
      return (
        <div className="lesson-detail-stack">
          <section className="card detail-card">
            <div className="section-heading section-heading--stacked compact-gap">
              <div>
                <span className="section-tag">{lesson.videoTitle}</span>
                <h3>{lesson.videoTitle}</h3>
              </div>
              <p>{lesson.videoDescription}</p>
            </div>
            <div className="placeholder-panel placeholder-panel--video">{lesson.videoPlaceholder}</div>
            <p className="support-text">{lesson.videoSupport}</p>
          </section>
        </div>
      );
    }

    if (activeSubTab === 'icebreak') {
      return (
        <div className="lesson-detail-stack">
          <section className="card detail-card">
            <div className="section-heading section-heading--stacked compact-gap">
              <div>
                <span className="section-tag">생각 열기</span>
                <h3>생각 열기</h3>
              </div>
              <p>질문에 대한 자신의 생각을 먼저 떠올리며 수업의 핵심 개념을 준비합니다.</p>
            </div>
            <div className="question-grid">
              {lesson.icebreakQuestions.map((question, index) => (
                <article key={question} className="question-card">
                  <span className="info-item-badge">질문 {index + 1}</span>
                  <h4>{question}</h4>
                  <p className="support-text">{lesson.icebreakSupport}</p>
                </article>
              ))}
            </div>
            {lesson.icebreakExtraPlaceholder && (
              <div className="placeholder-panel placeholder-panel--diagram">{lesson.icebreakExtraPlaceholder}</div>
            )}
            {lesson.icebreakInfoCard && (
              <article className="info-item-card info-item-card--full">
                <span className="info-item-badge">{lesson.icebreakInfoCard.title}</span>
                <ul className="note-list note-list--spacious">
                  {lesson.icebreakInfoCard.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            )}
          </section>
        </div>
      );
    }

    if (activeSubTab === 'experiment') {
      return (
        <div className="lesson-detail-stack">
          <section className="card banner-card">
            <span className="section-tag">안내</span>
            <p>{lesson.experimentBanner}</p>
          </section>

          <section className="card detail-card">
            <div className="section-heading section-heading--stacked compact-gap">
              <div>
                <span className="section-tag">실험 안내</span>
                <h3>실험 안내</h3>
              </div>
              <p>실험명, 준비물, 실험 절차를 차례대로 확인한 뒤 수업에 참여합니다.</p>
            </div>
            <div className="experiment-grid">
              {lesson.experiments.map((experiment) => renderExperimentCard(experiment))}
            </div>
          </section>
        </div>
      );
    }

    if (activeSubTab === 'predict') {
      return (
        <div className="lesson-detail-stack">
          <section className="card banner-card">
            <span className="section-tag">AI 연동 예정</span>
            <p>{lesson.predictBanner}</p>
          </section>

          <section className="card detail-card">
            <div className="section-heading section-heading--stacked compact-gap">
              <div>
                <span className="section-tag">예상하기</span>
                <h3>예상하기</h3>
              </div>
              <p>{lesson.predictDescription}</p>
            </div>
            <div className="lesson-detail-stack lesson-detail-stack--compact">
              {lesson.predictSections.map((section) => renderQuestionSection(section, lesson.predictSupport))}
            </div>
          </section>
        </div>
      );
    }

    return (
      <div className="lesson-detail-stack">
        <section className="card banner-card">
          <span className="section-tag">AI 연동 예정</span>
          <p>{lesson.explainBanner}</p>
        </section>

        <section className="card detail-card">
          <div className="section-heading section-heading--stacked compact-gap">
            <div>
              <span className="section-tag">설명하기</span>
              <h3>설명하기</h3>
            </div>
            <p>{lesson.explainDescription}</p>
          </div>
          <div className="lesson-detail-stack lesson-detail-stack--compact">
            {lesson.explainSections.map((section) => renderQuestionSection(section, lesson.explainSupport))}
          </div>
        </section>

        <section className="card detail-card">
          <div className="section-heading section-heading--stacked compact-gap">
            <div>
              <span className="section-tag">{lesson.wrapUpTitle}</span>
              <h3>정리하기</h3>
            </div>
            <p>{lesson.wrapUpDescription}</p>
          </div>
          <div className="question-grid question-grid--summary">
            {lesson.wrapUpPrompts.map((prompt, index) => (
              <article key={prompt} className="summary-card">
                <span className="info-item-badge">정리 {index + 1}</span>
                <h4>{prompt}</h4>
                <p className="support-text">{lesson.wrapUpSupport}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    );
  };

  const renderLesson = () => {
    const placeholderText = activeLesson.placeholders[activeSubTab];
    const isDetailedLesson = Boolean(detailedLessonData[activeTopTab]);

    return (
      <div className="lesson-layout">
        <aside className="card lesson-sidebar">
          <span className="section-tag">차시 서브탭</span>
          <h2>{activeLesson.title}</h2>
          <p>{activeLesson.summary}</p>
          <div className="subtab-list">
            {lessonSubTabs.map((tab) => {
              const isActive = lessonTabState[activeTopTab] === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`subtab-button ${isActive ? 'active' : ''}`}
                  onClick={() => handleSubTabChange(activeTopTab, tab.id)}
                >
                  {tab.label}
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
            <p>{isDetailedLesson ? activeLesson.summary : placeholderText}</p>
          </div>
          {isDetailedLesson ? (
            renderDetailedLesson(activeTopTab)
          ) : (
            <div className="placeholder-panel placeholder-panel--lesson">{placeholderText}</div>
          )}
        </section>
      </div>
    );
  };

  const renderProgress = () => (
    <div className="page-stack">
      <section className="card assessment-card">
        <span className="section-tag">비교 확인</span>
        <h2>학습 변화 확인</h2>
        <p className="body-text">
          사전 검사와 사후 검사 결과를 비교하여 학습 변화를 확인하는 영역입니다.
        </p>
      </section>

      <div className="content-grid">
        <section className="card placeholder-card">
          <div className="section-heading section-heading--stacked compact-gap">
            <div>
              <span className="section-tag">그래프 영역</span>
              <h3>사전/사후 비교 그래프</h3>
            </div>
          </div>
          <div className="placeholder-panel placeholder-panel--medium">
            사전/사후 검사 비교 그래프가 들어갈 영역입니다.
          </div>
        </section>

        <section className="card placeholder-card">
          <div className="section-heading section-heading--stacked compact-gap">
            <div>
              <span className="section-tag">문항 분석</span>
              <h3>문항별 변화 분석</h3>
            </div>
          </div>
          <div className="placeholder-panel placeholder-panel--medium">
            문항별 변화 분석 결과가 들어갈 영역입니다.
          </div>
        </section>
      </div>
    </div>
  );

  const renderContent = () => {
    if (activeTopTab === 'home') {
      return renderHome();
    }

    if (activeTopTab === 'pretest') {
      return renderAssessment({
        title: '사전 검사',
        description: '1차시 수업 전 기관계 관련 사전 개념 검사를 실시하는 영역입니다.',
        buttonLabel: '사전 검사 시작'
      });
    }

    if (activeTopTab === 'posttest') {
      return renderAssessment({
        title: '사후 검사',
        description: '3차시 수업 후 기관계 관련 사후 개념 검사를 실시하는 영역입니다.',
        buttonLabel: '사후 검사 시작'
      });
    }

    if (activeTopTab === 'progress') {
      return renderProgress();
    }

    if (isLessonTab) {
      return renderLesson();
    }

    return null;
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <span className="app-badge">AI Courseware Structure Preview</span>
          <h1>학생용 AI 코스웨어 전체 구조 확인</h1>
        </div>
        <p className="app-subtitle">
          실제 기능 연결 전 단계에서 상단 메인 탭과 차시별 서브탭 흐름을 데스크톱 화면으로 먼저 검토할 수
          있도록 구성했습니다.
        </p>
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
