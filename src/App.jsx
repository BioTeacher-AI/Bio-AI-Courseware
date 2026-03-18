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

const lesson1GoalItems = [
  '침에 있는 소화 효소에 의해 영양소가 분해되는 것을 확인하고 소화계의 작용을 설명할 수 있다.',
  '세포 호흡의 관점에서 소화계의 역할을 이해하고 설명할 수 있다.'
];

const lesson1IcebreakQuestions = [
  '마라톤 선수가 먹은 바나나가 어떻게 근육을 움직이는 에너지가 될까요?',
  '소화되고 남은 물질은 어떻게 우리 몸을 빠져나올까요?'
];

const lesson1Materials = [
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
];

const lesson1ExperimentSteps = [
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
];

const lesson1PredictQuestions = [
  '녹말-셀로판 튜브를 담근 비커의 아이오딘-아이오딘화 칼륨 용액과의 반응 결과는 어떠할까요? 그렇게 생각한 이유도 함께 적어봅시다.',
  '포도당-셀로판 튜브를 담근 비커의 베네딕트 반응 결과는 어떠할까요? 그렇게 생각한 이유도 함께 적어봅시다.',
  '녹말 + 침 용액 셀로판 튜브를 담가둔 비커의 아이오딘-아이오딘화 칼륨 용액과 베네딕트 반응 결과는 각각 어떠할까요? 그렇게 생각한 이유도 함께 적어봅시다.',
  '소화 과정은 에너지 생성 과정일까요? 여러분의 생각을 자유롭게 적어봅시다.'
];

const lesson1ExplainQuestions = [
  '각각의 튜브에서 나타난 색 변화가 어떤 물질의 이동 때문인지 설명해 봅시다.',
  '이번 실험에서 관찰된 과정이 에너지를 생성하는 과정이라고 볼 수 있을까요?',
  '실험 과정에서 녹말 용액과 침을 함께 넣은 용액에서 검출된 물질은 무엇인가요? 침의 어떤 성분에 의해 이러한 결과가 나타났을까요? 그리고 그 성분이 생물체의 ‘세포’ 혹은 ‘물질’인가요?',
  '셀로판 튜브는 우리 몸의 기관 중 어느 것에 해당할지 적어보고, 셀로판 튜브를 통과한 영양소는 우리 몸에서 어느 곳으로 이동할지, 또, 셀로판 튜브 안에 남아서 통과하지 못한 물질은 우리 몸 안으로 들어왔다고 할 수 있는지 적어봅시다.',
  '우리 몸에서 침과 같이 소화를 도와주는 물질이 분비되는 곳은 어느 기관이 있나요? 그리고 그 기관에서 직접적으로 소화 과정을 수행하는지 적어봅시다.'
];

const lesson1WrapUpPrompts = [
  '세포 호흡의 관점에서 소화계가 하는 역할은?',
  '세포 호흡 공장이 멈추지 않고 계속 돌아가려면 소화계는 어떤 도움을 주어야 할지 적어봅시다.',
  '오늘 수업을 통해 생각이 변화된 것이 있다면 자유롭게 적어주세요.'
];

const lessonContent = {
  lesson1: {
    title: '1차시: 소화계',
    summary:
      '소화계의 구조와 기능을 관찰하고, 세포 호흡의 관점에서 소화계의 역할을 이해하는 POE 기반 학습 영역입니다.',
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

  const renderLessonOneContent = () => {
    if (activeSubTab === 'goal') {
      return (
        <div className="lesson-detail-stack">
          <section className="card detail-card">
            <div className="section-heading section-heading--stacked compact-gap">
              <div>
                <span className="section-tag">1차시 학습목표</span>
                <h3>학습목표</h3>
              </div>
              <p>소화계와 세포 호흡의 연결을 중심으로 이번 차시에서 도달할 목표를 확인합니다.</p>
            </div>
            <div className="info-list-grid">
              {lesson1GoalItems.map((item, index) => (
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
                <span className="section-tag">동기 유발 영상</span>
                <h3>동기 유발 영상</h3>
              </div>
              <p>
                마라톤 선수가 경기 중 바나나를 먹는 장면을 보고, 먹은 음식이 몸속에서 어떻게 에너지로 이어지는지 생각해
                봅니다.
              </p>
            </div>
            <div className="placeholder-panel placeholder-panel--video">
              마라톤 선수가 경기 중 바나나를 먹는 영상이 들어갈 영역입니다.
            </div>
            <p className="support-text">
              먹은 음식이 소화되어 우리 몸의 에너지와 연결되는 과정을 떠올리며 영상을 살펴보세요.
            </p>
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
            <div className="question-grid question-grid--two">
              {lesson1IcebreakQuestions.map((question, index) => (
                <article key={question} className="question-card">
                  <span className="info-item-badge">질문 {index + 1}</span>
                  <h4>{question}</h4>
                  <p className="support-text">추후 학생 입력창이 연결될 예정입니다.</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      );
    }

    if (activeSubTab === 'experiment') {
      return (
        <div className="lesson-detail-stack">
          <section className="card banner-card">
            <span className="section-tag">안내</span>
            <p>실험 과정 영상이 추후 연결될 예정입니다.</p>
          </section>

          <section className="card detail-card">
            <div className="section-heading section-heading--stacked compact-gap">
              <div>
                <span className="section-tag">실험 안내</span>
                <h3>소화의 필요성</h3>
              </div>
              <p>실험명, 준비물, 실험 절차를 차례대로 확인한 뒤 수업에 참여합니다.</p>
            </div>

            <div className="lesson-section-block">
              <h4>실험명</h4>
              <div className="info-item-card info-item-card--single">
                <p>소화의 필요성</p>
              </div>
            </div>

            <div className="lesson-section-block">
              <h4>준비물</h4>
              <div className="material-grid">
                {lesson1Materials.map((item) => (
                  <span key={item} className="material-chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="lesson-section-block">
              <h4>실험 방법</h4>
              <ol className="step-list">
                {lesson1ExperimentSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
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
            <p>추후 AI 보조교사(GPT)와 연동될 예정입니다.</p>
          </section>

          <section className="card detail-card">
            <div className="section-heading section-heading--stacked compact-gap">
              <div>
                <span className="section-tag">예상하기</span>
                <h3>예상하기</h3>
              </div>
              <p>실험을 수행하기 전에 아래 질문에 대해 자신의 생각을 정리해 봅니다.</p>
            </div>
            <div className="question-grid">
              {lesson1PredictQuestions.map((question, index) => (
                <article key={question} className="question-card">
                  <span className="info-item-badge">예상 질문 {index + 1}</span>
                  <h4>{question}</h4>
                  <p className="support-text">아직 채팅/입력 기능은 연결하지 않았으며, 추후 답변 작성 영역이 추가될 예정입니다.</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      );
    }

    return (
      <div className="lesson-detail-stack">
        <section className="card banner-card">
          <span className="section-tag">AI 연동 예정</span>
          <p>추후 AI 보조교사와 함께 설명을 정교화하는 기능이 연결될 예정입니다.</p>
        </section>

        <section className="card detail-card">
          <div className="section-heading section-heading--stacked compact-gap">
            <div>
              <span className="section-tag">설명하기</span>
              <h3>설명하기</h3>
            </div>
            <p>실험 결과를 바탕으로 다음 질문에 대해 설명을 정리해 봅니다.</p>
          </div>
          <div className="question-grid">
            {lesson1ExplainQuestions.map((question, index) => (
              <article key={question} className="question-card">
                <span className="info-item-badge">설명 질문 {index + 1}</span>
                <h4>{question}</h4>
                <p className="support-text">추후 학생 작성 영역과 AI 보조 피드백 기능이 연결될 예정입니다.</p>
              </article>
            ))}
          </div>
        </section>

        <section className="card detail-card">
          <div className="section-heading section-heading--stacked compact-gap">
            <div>
              <span className="section-tag">오늘 배운 내용 정리하기</span>
              <h3>정리하기</h3>
            </div>
            <p>오늘 학습한 내용을 세포 호흡의 관점까지 연결하여 정리해 봅니다.</p>
          </div>
          <div className="question-grid question-grid--summary">
            {lesson1WrapUpPrompts.map((prompt, index) => (
              <article key={prompt} className="summary-card">
                <span className="info-item-badge">정리 {index + 1}</span>
                <h4>{prompt}</h4>
                <p className="support-text">추후 학생이 자유롭게 정리 내용을 작성할 수 있는 영역이 연결될 예정입니다.</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    );
  };

  const renderLesson = () => {
    const placeholderText = activeLesson.placeholders[activeSubTab];
    const isLessonOne = activeTopTab === 'lesson1';

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
            <p>{isLessonOne ? activeLesson.summary : placeholderText}</p>
          </div>
          {isLessonOne ? (
            renderLessonOneContent()
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
