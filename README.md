# Bio AI Courseware

학생용 AI 코스웨어의 React + Vite + Netlify 기반 미리보기 프로젝트입니다.

## 주요 기능
- 상단 메인 탭 및 차시별 서브탭 구조
- 학생 이름/학번 입력
- 생각열기 / 예상하기 / 관찰하기 / 설명하기 답변 입력
- Netlify Functions를 통한 응답 저장
- 교사용 보기 탭에서 저장된 응답 조회

## 환경변수
이 기능을 사용하려면 Apps Script 저장 API와 조회 API가 필요합니다.
프론트는 Netlify Function만 호출하고, Apps Script URL은 브라우저에 직접 노출하지 않습니다.

다음 환경변수를 Netlify에 설정하세요.

- `RESPONSE_SAVE_URL`
- `RESPONSE_READ_URL`

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
