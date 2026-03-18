import { useMemo, useState } from 'react';

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

const lessonTitles = {
  lesson1: '1차시',
  lesson2: '2차시',
  lesson3: '3차시'
};

const homeHighlights = [
  '상단 탭에서 원하는 학습 단계로 이동합니다.',
  '차시 탭에서는 하위 학습 흐름을 순서대로 확인합니다.',
  '현재는 기능 연결 전 UI 구조만 확인하는 버전입니다.'
];

function App() {
  const [activeTopTab, setActiveTopTab] = useState('home');
  const [lessonTabState, setLessonTabState] = useState({
    lesson1: 'goal',
    lesson2: 'goal',
    lesson3: 'goal'
  });

  const isLessonTab = ['lesson1', 'lesson2', 'lesson3'].includes(activeTopTab);

  const activeLessonTitle = lessonTitles[activeTopTab];
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

  const renderContent = () => {
    if (activeTopTab === 'home') {
      return (
        <div className="content-grid content-grid--home">
          <section className="card hero-card">
            <span className="eyebrow">Bio + AI Courseware</span>
            <h1>AI 기반 바이오 코스웨어</h1>
            <p className="hero-text">
              학생이 사전 검사부터 차시 학습, 사후 검사, 학습 변화 확인까지 한 흐름으로 살펴볼 수 있도록
              구성한 데스크톱용 코스웨어 UI 구조입니다.
            </p>
          </section>

          <section className="card info-card">
            <h2>간단한 소개</h2>
            <p>
              본 화면은 학습 콘텐츠와 평가 도구를 한곳에서 탐색할 수 있는 학생용 코스웨어의 기본 구조를
              보여줍니다. 각 영역은 향후 실제 기능과 자료가 연결될 수 있도록 카드형 레이아웃으로 배치했습니다.
            </p>
          </section>

          <section className="card info-card">
            <h2>사용 방법 안내</h2>
            <ul className="guide-list">
              {homeHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
      );
    }

    if (activeTopTab === 'pretest') {
      return (
        <section className="card content-card">
          <div className="section-header">
            <div>
              <span className="section-tag">진단 평가</span>
              <h2>사전 검사</h2>
            </div>
            <button type="button" className="primary-button">
              검사 시작
            </button>
          </div>
          <p className="placeholder-text">
            학습을 시작하기 전에 현재 이해 수준을 점검하는 사전 검사 안내 문구가 들어갈 영역입니다.
          </p>
        </section>
      );
    }

    if (activeTopTab === 'posttest') {
      return (
        <section className="card content-card">
          <div className="section-header">
            <div>
              <span className="section-tag">마무리 평가</span>
              <h2>사후 검사</h2>
            </div>
            <button type="button" className="primary-button">
              검사 시작
            </button>
          </div>
          <p className="placeholder-text">사후 검사 안내와 마무리 점검 내용이 들어갈 영역입니다.</p>
        </section>
      );
    }

    if (activeTopTab === 'progress') {
      return (
        <div className="content-grid">
          <section className="card content-card">
            <span className="section-tag">성과 확인</span>
            <h2>사전/사후 비교</h2>
            <div className="placeholder-panel placeholder-panel--large">그래프 영역 placeholder</div>
          </section>

          <section className="card content-card">
            <span className="section-tag">문항 분석</span>
            <h2>문항별 분석</h2>
            <div className="placeholder-panel">문항별 분석 영역 placeholder</div>
          </section>
        </div>
      );
    }

    if (isLessonTab) {
      return (
        <div className="lesson-layout">
          <section className="card lesson-sidebar">
            <span className="section-tag">학습 흐름</span>
            <h2>{activeLessonTitle}</h2>
            <p>{activeLessonTitle}에서 확인할 세부 학습 단계를 선택하세요.</p>
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
          </section>

          <section className="card lesson-content">
            <div className="section-header section-header--stacked">
              <div>
                <span className="section-tag">{activeLessonTitle} 콘텐츠</span>
                <h2>{activeSubTabLabel}</h2>
              </div>
              <p className="section-description">
                {activeLessonTitle} {activeSubTabLabel}가 들어갈 영역입니다.
              </p>
            </div>
            <div className="placeholder-panel placeholder-panel--lesson">
              {activeLessonTitle} {activeSubTabLabel} placeholder content
            </div>
          </section>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <span className="app-badge">Student UI Prototype</span>
          <h1>AI 코스웨어 전체 구조</h1>
        </div>
        <p className="app-subtitle">상단 탭과 차시별 서브탭만으로 전체 학습 동선을 빠르게 검토할 수 있도록 구성했습니다.</p>
      </header>

      <nav className="top-tab-bar" aria-label="상단 학습 탭">
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
