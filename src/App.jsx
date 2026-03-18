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

const lessonContent = {
  lesson1: {
    title: '1차시: 소화계',
    summary: '소화계의 구조와 기능을 관찰하고 POE 흐름에 따라 학습하는 영역입니다.',
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
    title: '2차시: 순환계·호흡계',
    summary: '순환계와 호흡계의 통합적 작용을 중심으로 학습하는 영역입니다.',
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
    title: '3차시: 배설계',
    summary: '배설계의 역할을 탐구하며 학습 내용을 정리하는 영역입니다.',
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

  const renderLesson = () => {
    const placeholderText = activeLesson.placeholders[activeSubTab];

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
            <p>{placeholderText}</p>
          </div>
          <div className="placeholder-panel placeholder-panel--lesson">{placeholderText}</div>
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
