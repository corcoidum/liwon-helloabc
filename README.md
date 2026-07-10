# 헬로 ABC (hello-abc)

알파벳 몇 글자만 아는 5세 아동을 위한 **비중독성 영어 입문 PWA**.
보고(See) → 듣고(Hear) → 누르고(Touch) → 말하고(Speak) → 따라 쓰고(Trace) → 놀이하고(Play) → 복습(Review)하는 순환 구조로, 하루 5~10분 학습합니다.

- 로그인·서버·광고·결제·분석 도구 없음. 모든 학습 기록은 **기기 안에만** 저장됩니다.
- **모든 음성은 앱에 내장된 자체 제작 오디오 파일**(scripts/make-audio.ps1로 생성)로 재생되어, TTS가 없는 브라우저와 오프라인에서도 항상 소리가 납니다. 브라우저 TTS는 예비 수단입니다.
- 아동의 음성을 녹음·저장·전송하지 않습니다.
- 스트릭, 순위, 무한 콘텐츠, 확률형 보상 등 중독성 장치를 사용하지 않습니다.
- 그림은 이모지, 음성은 자체 생성 파일, 글꼴은 Jua(SIL OFL 라이선스)를 사용해 라이선스 문제가 없습니다.

## 실행 방법

```bash
npm install          # 의존성 설치
npm run dev          # 개발 서버 (http://localhost:5173)
npm run build        # 프로덕션 빌드 (dist/) — typecheck 포함
npm run preview      # 빌드 결과 미리보기 (http://localhost:4173)
```

모바일에서 확인하려면 같은 Wi-Fi에서 `npm run dev -- --host` 후 표시되는 주소로 접속하세요.
PWA 설치·오프라인은 **빌드 결과(preview 또는 배포)** 에서만 동작합니다(개발 서버 제외).

## 검증

```bash
npm run lint         # ESLint
npm run typecheck    # tsc (앱 + 설정/e2e)
npm run test         # Vitest 단위/컴포넌트 테스트
npm run build        # 프로덕션 빌드
npx playwright install chromium   # 최초 1회
npm run e2e          # Playwright 전체 흐름 테스트 (자동으로 preview 서버 실행)
```

E2E는 홈 → 오늘의 학습(A·B 소개, 듣고 고르기, 대·소문자 따라 쓰기) → 카드 맞추기 → 따라 말하기 → 챈트 → 종료 화면 → 진도 저장 → 새로고침 → 부모 메뉴(진도·복습 항목) 흐름과 360px 레이아웃, 복습 규칙을 검증합니다.

## PWA / 오프라인 확인

1. `npm run build && npm run preview`
2. Chrome에서 `http://localhost:4173` 접속 → 주소창의 설치 아이콘으로 홈 화면에 설치
3. DevTools → Application → Service Workers에서 `sw.js` 활성 확인
4. Network 탭에서 Offline 체크 후 새로고침 → 핵심 학습 기능이 그대로 동작 (앱 상단에 오프라인 배너 표시)

Lighthouse(모바일)로 PWA 설치 가능 여부·접근성·성능을 점검할 수 있습니다.

## 배포

`dist/` 폴더를 정적 호스팅(Netlify, Vercel, GitHub Pages, Cloudflare Pages 등)에 올리면 됩니다.
HTTPS가 필요합니다(Service Worker 요건). 하위 경로에 배포할 경우 `vite.config.ts`에 `base`를 설정하세요.

## 폴더 구조

```
src/
  data/        학습 콘텐츠 (UI와 분리된 JSON + TS 래퍼)
    letters.json/.ts   A~Z + 기본 음가
    words.json/.ts     생활 단어 65개 (글자별 2개 이상, 이모지 그림)
    chants.json/.ts    자체 제작 챈트 3개 + 글자별 챈트 26개 자동 생성
    phrases.json/.ts   짧은 표현 10개
    feedback.json/.ts  한국어 격려 안내 문구
  services/    audio(내장 음성 재생), sound(음성 통합), speech(TTS 예비·음성인식),
               storage(로컬 저장), review(복습 규칙), session(학습 구성), progress(진도)
  activities/  LetterIntro, ListenChoose, TraceBoard, MatchCards,
               SortGame, SpeakAlong, PhrasePlay, ChantPlay
  screens/     Home, LessonRunner, EndScreen, ReviewScreen, FreePlay,
               WordsFree(단어 구경), PhraseFree(말놀이), ParentArea
  components/  공용 UI / utils/colors.ts 글자별 파스텔 색
  assets/      Jua 글꼴 (SIL OFL)
  tests/       Vitest 테스트
public/audio/  자체 생성 음성 146개 (Windows TTS로 생성, 커밋됨)
e2e/           Playwright 흐름 테스트
scripts/       make-icons.mjs(아이콘), make-audio.ps1(음성 일괄 생성)
```

음성을 다시 생성하려면(Windows): `pwsh -File scripts/make-audio.ps1`

## 학습 규칙 요약

- 한 세션에 새 알파벳 최대 2개 (`session.ts`)
- 복습 우선순위: 최근 틀림 > 여러 번 다시 들음 > 따라 쓰기 미완료 > 오래된 항목 (`review.ts`, 로컬 규칙 기반)
- 발음 점수 없음 — 말하기 시도 자체를 긍정적으로 안내
- 세션 시간이 설정(기본 8분)을 넘으면 다음 단계에서 종료 화면으로 이동
- 부모 메뉴는 홈 하단 버튼을 1.2초 이상 길게 눌러 진입

## 알려진 제한

- 알파벳 음가는 근사 발음(예: "buh")을 녹음해 사용합니다. X는 관례대로 끝소리 단어(box, fox)를 씁니다.
- 내장 음성은 Windows 기본 음성(Zira/Heami)으로 생성한 것이라 원어민 육성보다 기계적입니다. 더 자연스러운 음성으로 교체하려면 make-audio.ps1 결과물을 같은 파일명으로 덮어쓰면 됩니다.
- 음성 인식(SpeechRecognition)은 Chrome 계열에서만 동작하며, 미지원/거부 시 듣고 따라 말하기로 자동 대체됩니다.
- 최초 로딩 시 오디오·글꼴 포함 약 10MB를 내려받아 캐시합니다(이후 오프라인 동작).
