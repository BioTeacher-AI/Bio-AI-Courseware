# Bio AI Courseware

학생용 AI 코스웨어의 React + Vite + Netlify 기반 프로젝트입니다.

## 주요 기능
- 상단 메인 탭 및 차시별 서브탭 구조
- 학생 이름/학번 입력
- 생각열기 / 예상하기 / 관찰하기 / 설명하기 답변 입력 및 저장
- Netlify Functions를 통한 응답 저장 / 조회
- 사전 검사 / 사후 검사 Google Form iframe 내장
- 학습 변화 확인 탭에서 이름 + 학번 기준 개인 결과 비교 대시보드 조회

## 사전 검사 / 사후 검사
- 사전 검사와 사후 검사는 각각 Google Form iframe으로 코스웨어 안에 표시됩니다.
- 각 탭에는 새 창에서 설문을 열 수 있는 링크도 함께 제공됩니다.

## 학습 변화 확인 사용 방법
1. `학습 변화 확인` 탭으로 이동합니다.
2. 이름과 학번을 모두 입력합니다.
3. 조회 버튼 또는 Enter 키로 결과를 불러옵니다.
4. 사전/사후 평균, 개선/동일/악화 분포, 문항별 비교표를 확인합니다.

이 탭은 이름 + 학번이 모두 일치하는 응답만 같은 학생으로 간주하며, 사전/사후 각각 가장 최신 응답 1개를 사용합니다.

## 환경변수
이 기능을 사용하려면 Apps Script 저장 API, 조회 API, 그리고 설문 결과 JSON API가 필요합니다.
프론트는 Netlify Function만 호출하고, Apps Script URL 및 설문 결과 JSON API URL은 브라우저에 직접 노출하지 않습니다.

다음 환경변수를 Netlify에 설정하세요.

- `RESPONSE_SAVE_URL`
- `RESPONSE_READ_URL`
- `GFORM_JSON_URL_PRE`
- `GFORM_JSON_URL_POST` (기본 사후 URL: `https://script.google.com/macros/s/AKfycbwGWHDZ3l1pufPPCDixCmighF6tmMlC31-Oa_hHlp9sFwMEEFr9fakdhh8KoL986_4/exec`)

## Netlify Function proxy 구조
- 학습 변화 확인 탭은 브라우저에서 Apps Script URL을 직접 호출하지 않습니다.
- 대신 `/.netlify/functions/proxy?dataset=pre` 와 `/.netlify/functions/proxy?dataset=post` 를 호출합니다.
- `netlify/functions/proxy.js` 는 `dataset` 값에 따라 `GFORM_JSON_URL_PRE` 또는 `GFORM_JSON_URL_POST` 를 선택해 각각 다른 Apps Script URL로 프록시합니다.
- 사후 검사 기본 fallback URL은 `https://script.google.com/macros/s/AKfycbwGWHDZ3l1pufPPCDixCmighF6tmMlC31-Oa_hHlp9sFwMEEFr9fakdhh8KoL986_4/exec` 입니다.
- 학습 변화 확인 탭은 proxy를 통해 불러온 pre/post payload를 분리 저장한 뒤 공통 문항만 비교합니다.

## 저장 흐름
1. 프론트엔드는 `/.netlify/functions/save-response`로 POST 요청을 보냅니다.
2. Netlify Function은 `RESPONSE_SAVE_URL`로 전달된 Apps Script Web App에 JSON payload를 전달합니다.
3. Apps Script는 Google Sheets 등에 응답을 저장합니다.

예시 payload:

```json
{
  "lesson": "lesson1",
  "section": "predict",
  "studentName": "홍길동",
  "studentId": "20230001",
  "answers": {
    "g1_q1": "...",
    "g1_q2": "..."
  },
  "savedAt": "2026-03-19T00:00:00.000Z"
}
```

## 조회 흐름
1. 교사용 보기 탭은 `/.netlify/functions/get-responses`를 호출합니다.
2. Netlify Function은 `RESPONSE_READ_URL`에 차시/단계 필터를 전달합니다.
3. Apps Script 조회 API는 JSON 응답 목록을 반환합니다.

예상 응답 형식 예시:

```json
{
  "responses": [
    {
      "savedAt": "2026-03-19T00:00:00.000Z",
      "studentName": "홍길동",
      "studentId": "20230001",
      "lesson": "lesson1",
      "section": "predict",
      "answers": {
        "g1_q1": "..."
      }
    }
  ]
}
```
