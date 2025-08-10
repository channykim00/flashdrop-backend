<div align="center">
  <h1>⚡ FlashDrop</h1>

![FlashDrop Header](https://github.com/channykim00/flashdrop-electron/blob/develop/src/assets/readme/header.png?raw=true)

  <p><b>FlashDrop</b>은 파일 공유가 필요한 사용자들이 복잡한 로그인이나 클라우드 절차 없이, 고유 링크를 통해 빠르게 파일을 전송하고 수락할 수 있도록 도와주는 실시간 전송 서비스입니다.</p>

</div>

<br>

## 🧩 프로젝트 구성 레포지토리

| 레포지토리                                                                     | 주요 기술                                   | 주요 역할                                                           |
| ------------------------------------------------------------------------------ | ------------------------------------------- | ------------------------------------------------------------------- |
| 🔗 [**flashdrop-frontend**](https://github.com/channykim00/flashdrop-frontend) | `React`, `Zustand`, `WebSocket`             | 🔹 파일 업로드/링크 생성 UI<br>🔹 WebSocket을 통한 실시간 상태 표시 |
| 🔗 [**flashdrop-backend**](https://github.com/channykim00/flashdrop-backend)   | `Node.js`, `Express`, `Multer`, `Socket.IO` | 🔹 파일 청크 업로드 처리<br>🔹 실시간 이벤트 중계 API               |
| 🔗 [**flashdrop-electron**](https://github.com/channykim00/flashdrop-electron) | `Electron`, `React`, `Node.js`              | 🔹 데스크탑 파일 수신<br>🔹 로컬 디스크 저장 및 열람 처리           |

<br>

---

# Table of Contents

- [💭 개발 동기](#-개발-동기)
- [🛠️ 기술 스택 & 아키텍처](#️-기술-스택--아키텍처)
  - [🌐 Frontend: React + 실시간 UI](#-frontend-react--실시간-ui)
  - [🧪 Backend: Node.js + WebSocket](#-backend-nodejs--websocket)
  - [💻 Desktop: Electron + 네이티브 통합](#-desktop-electron--네이티브-통합)
  - [🤔 기술 선택의 이유](#-기술-선택의-이유)
- [🎬 링크 생성부터 전송까지 한눈에 보기](#-링크-생성부터-전송까지-한눈에-보기)
- [🚀 주요 기능](#-주요-기능)
  - [📎 파일 수신 링크 생성](#-파일-수신-링크-생성)
  - [✏️ 파일 수신 링크 수정](#️-파일-수신-링크-수정)
  - [📤 파일 보내기 (드래그 앤 드롭 지원)](#-파일-보내기-드래그-앤-드롭-지원)
  - [🔍 파일/링크/사용자 통합 검색](#-파일링크사용자-통합-검색)
- [🚧 핵심 도전과제와 해결방법](#-핵심-도전과제와-해결방법)
  - [📦 실시간 대용량 파일 전송](#-실시간-대용량-파일-전송)
  - [🆔 로그인 없이 사용자 구별하기](#-로그인-없이-사용자-구별하기)
- [🏁 성과와 배운 점](#-성과와-배운-점)
- [📌 개선 사항 및 향후 계획](#-개선-사항-및-향후-계획)

---

## 💭 개발 동기

일상 속에서 여러 명에게 파일을 받아야 하거나, 반복적으로 파일을 수신해야 하는 상황은 생각보다 자주 발생합니다.
예를 들어 학교에서는 선생님이 학생들에게 과제를 제출받을 때, 이메일이나 드롭박스 같은 서비스를 주로 사용하곤 합니다.

하지만 이메일을 통한 파일 공유 방식은 번거롭고 비효율적입니다.

보내는 사람은 이메일 로그인 → 수신자 이메일 입력 → 파일 첨부 → 전송

받는 사람은 다시 이메일 로그인 → 메일 검색 → 파일 다운로드

이러한 과정은 한두 번이라면 괜찮지만, 수십 명과 반복해야 한다면 매우 비효율적이며 관리도 어렵습니다.
"누구나 빠르고 간편하게 파일을 보낼 수 있는 방법이 없을까?"
이런 문제의식에서 출발해 FlashDrop 프로젝트를 기획하게 되었습니다.

FlashDrop은 짧은 시간 안에 수신 링크를 생성하고, 해당 링크를 공유하면 누구나 쉽게 파일을 업로드할 수 있는 도구입니다.
복잡한 로그인 절차 없이도, 간단한 링크 하나로 빠르게 파일을 주고받을 수 있습니다.

또한 수신자의 장치에는 업로드된 파일이 자동으로 저장되어, 다운로드 클릭이나 수락 없이도 실시간으로 파일을 받을 수 있는 사용자 경험을 제공합니다.

반복적인 파일 수신 과정을 줄이고자 했던 문제의식에서 출발해,
실제 사용에 있어 간결함과 실용성을 동시에 잡는 것에 집중했습니다.

## 🛠️ 기술 스택 & 아키텍처

### 🌐 Frontend: React + 실시간 UI

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=zustand&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-008080?style=for-the-badge&logo=websocket&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### 🧪 Backend: Node.js + WebSocket

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![AWS S3](https://img.shields.io/badge/AWS_S3-569A31?style=for-the-badge&logo=amazon-aws&logoColor=white)

### 💻 Desktop: Electron + 네이티브 통합

![Electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)

### 🤔 기술 선택의 이유

#### Socket.IO 선택 이유

서버-클라이언트 간 실시간 통신을 위한 Socket.IO 도입 이유는 다음과 같습니다:

처음에는 웹에서 바로 클라이언트로 파일을 빠르게 전송하는 방식을 고민했으나, 파일 받는 사람의 컴퓨터가 꺼져있을 수 있는 상황을 대비해 서버와 데스크톱 앱 간 Socket.IO 연결을 구축했습니다.
이로 인해 받는 사람은 컴퓨터가 꺼져있어도 나중에 컴퓨터를 켜고 앱을 실행하여 백엔드 서버와 동기화할 수 있으며, 꺼져있던 동안 받은 파일 목록을 확인할 수 있게 되었습니다.

- **서버 ↔ 클라이언트 간 1:1 소켓 연결**
  각 클라이언트(Electron 앱)는 고유 deviceId를 기반으로 서버에 연결되고, 서버는 해당 클라이언트와 실시간으로 데이터를 주고받으며 파일 청크 전송 상태, 수락/거절 알림 등을 관리합니다.

- **중앙 서버 중계 방식의 안정성 제공 및 오프라인 수신 지원**
  받는 사람의 컴퓨터가 꺼져 있어도 서버가 중간에서 상태를 유지하여, 나중에 컴퓨터를 켜고 앱을 실행했을 때 파일 수신 목록을 동기화하고 확인할 수 있도록 안정적인 파일 전송 환경을 제공합니다.

- **네트워크 장애 대응 및 자동 재연결**
  Socket.IO의 내장된 자동 재연결 기능 덕분에 네트워크 불안정 상황에서도 연결이 끊기지 않고 신속하게 복구되어 원활한 파일 전송이 가능합니다.

- **WebSocket 기반의 빠른 응답성 및 리소스 효율성**
  HTTP 폴링 대비 지연 시간을 획기적으로 줄이고 서버 자원도 효율적으로 사용하여 실시간성 높은 사용자 경험을 제공합니다.

#### Zustand 선택 이유

Electron 앱 내 전역 상태 관리의 단순화와 성능 최적화를 위해 Zustand를 선택했습니다:

FlashDrop의 Electron 데스크탑 앱은 파일 전송 요청, 수락/거절 상태, 로컬에 저장된 업로드 요청 목록 등 여러 상태를 관리해야 합니다. 이러한 상태들은 앱 전체에서 실시간으로 공유되고 변경되어야 하므로, 효과적인 전역 상태 관리가 필수적이었습니다.

- **경량화 및 단순성**
  Zustand는 Redux 등 복잡한 상태 관리 라이브러리에 비해 설정과 사용법이 매우 간단하며, 불필요한 보일러플레이트 코드를 줄여 개발 생산성을 높였습니다.

- **빠른 상태 업데이트와 최소한의 리렌더링**
  내부적으로 불변성 관리와 셀렉터를 지원해, 상태 변경 시 필요한 컴포넌트만 효율적으로 업데이트할 수 있어 앱 성능 최적화에 기여합니다.

- **Electron API와의 손쉬운 연동**
  Zustand 상태 변경 시 Electron의 로컬 저장소 API와 동기화하는 패턴을 자연스럽게 구현할 수 있어, 앱이 종료되거나 재실행 되어도 상태를 복원할 수 있었습니다.

- **비동기 상태 초기화 지원**
  앱 시작 시 로컬 저장소에서 이전 상태를 비동기적으로 불러와 초기 상태로 세팅하는 작업을 쉽게 처리할 수 있습니다.

<br>

## 🎬 링크 생성부터 전송까지 한눈에 보기

<p align="center">
  <img width="800px" src="https://github.com/channykim00/flashdrop-electron/blob/develop/src/assets/readme/preview.gif?raw=true" alt="FlashDrop 미리보기" />
</p>

1. **링크 생성**
   로그인 없이도 간단한 설정만으로 수신용 링크를 생성할 수 있습니다.

2. **링크 공유**
   생성된 고유 URL을 상대방에게 공유하면, 별도 앱 설치 없이 웹에서 파일을 업로드할 수 있습니다.

<br>

## 🚀 주요 기능

### 📎 파일 수신 링크 생성

<p align="center">
  <img width="800px" src="https://github.com/channykim00/flashdrop-electron/blob/develop/src/assets/readme/link-create.gif?raw=true" />
</p>

FlashDrop은 누구나 사용할 수 있는 **고유 전송 링크 생성 기능**을 제공합니다.
복잡한 회원가입이나 인증 없이도, 개인 수신 링크를 생성하여 손쉽게 파일을 받을 수 있습니다.

링크를 생성할 때 다음과 같은 옵션들을 통해 **수신 방식과 보안 정책을 세밀하게 제어**할 수 있습니다:

- ⏰ **만료 시간 설정**: (현재 미구현) 추후 크론 작업으로 자동 만료 처리 기능을 추가할 예정입니다.
- 🔐 **비밀번호 보호**: 비밀번호를 입력한 사용자만 접근할 수 있습니다.
- 👤 **수신자 이름 지정**: 누가 보낸 파일인지 구분이 가능합니다.
- 📂 **허용 파일 형식 제한**: 예) `.jpg`, `.pdf` 등 지정된 형식만 업로드 허용.
- 🧱 **최대 파일 크기 제한**: 최대 2GB.
- ⚙️ **자동 수락 모드**: 수신자가 별도의 승인 없이 자동으로 파일을 저장합니다.
  > 반복적인 수신 상황 (예: 과제 제출, 이미지 수집 등)에 유용하게 활용할 수 있습니다.

링크를 생성하면 즉시 고유 주소(예: `https://flash-drop.online/cgHce2rDTk`)가 발급되며,
해당 링크를 공유하면 **상대방이 직접 파일을 업로드**할 수 있습니다.

전송자는 **Electron 앱**을 통해

- 업로드 진행 상황을 **실시간으로 확인**하고,
- 파일을 **수동으로 저장하거나**, 설정에 따라 **자동으로 수신**할 수 있습니다.

### ✏️ 파일 수신 링크 수정

<p align="center">
  <img width="600px" src="https://github.com/channykim00/flashdrop-electron/blob/develop/src/assets/readme/edit-link.png?raw=true" alt="파일 수신 링크 수정 화면" />
</p>

생성된 수신 링크의 URL을 제외한 모든 설정을 언제든지 변경할 수 있습니다.
변경된 내용은 실시간으로 링크에 즉시 반영되어 즉각적으로 적용됩니다.

수신 링크의 **제목**, **만료 시간**, **비밀번호**, **접근 권한**뿐만 아니라
수신자 **전송자 이름 받기**, **허용 파일 형식**, **자동 수락** 여부 등도 손쉽게 수정하여
유연하고 안전하게 파일 수신 환경을 관리할 수 있습니다.

### 📤 파일 보내기 (드래그 앤 드롭 지원)

<p align="center">
  <img width="600px" src="https://github.com/channykim00/flashdrop-electron/blob/develop/src/assets/readme/file-upload.gif?raw=true" alt="파일 업로드 드래그 앤 드롭 화면" />
  <br/>
  <sub>📤 드래그 앤 드롭으로 파일을 업로드 하는 보내는 사람 화면 (gif)</sub>
</p>

<br/>

<p align="center">
  <img width="600px" src="https://github.com/channykim00/flashdrop-electron/blob/develop/src/assets/readme/file-receive.png?raw=true" alt="파일 수신자 요청함 화면" />
  <br/>
  <sub>📥 파일을 받은 수신자의 요청함 화면 (사진)</sub>
</p>

**손쉬운 전송 UI로 빠르게 업로드**
직관적인 드래그 앤 드롭 인터페이스를 통해
파일을 마우스로 끌어놓기만 하면 간편하게 전송할 수 있습니다.
복잡한 과정 없이 누구나 쉽게 사용할 수 있는 사용자 친화적인 경험을 제공합니다.

### 🔍 파일/링크/사용자 통합 검색

필요한 항목을 빠르게 탐색 가능 – 업로드된 파일, 생성한 링크, 사용자 정보를
**통합 검색**을 통해 효율적으로 찾을 수 있습니다.

<br/>

<p align="center">
  <img width="600px" src="https://github.com/channykim00/flashdrop-electron/blob/develop/src/assets/readme/search-title.png?raw=true" alt="링크 제목 검색" />
  <br/>
  <sub>🔗 링크 제목으로 검색</sub>
</p>

<p align="center">
  <img width="600px" src="https://github.com/channykim00/flashdrop-electron/blob/develop/src/assets/readme/search-sender.png?raw=true" alt="보낸이 검색" />
  <br/>
  <sub>👤 보낸이로 검색</sub>
</p>

<p align="center">
  <img width="600px" src="https://github.com/channykim00/flashdrop-electron/blob/develop/src/assets/readme/search-filename.png?raw=true" alt="파일 이름 검색" />
  <br/>
  <sub>📄 파일 이름으로 검색</sub>
</p>

사용자는 키워드 입력만으로도 원하는 파일, 보낸 사람, 또는 링크를
빠르게 찾아볼 수 있어 불필요한 스크롤 없이 효율적인 탐색이 가능합니다.

모든 검색은 실시간으로 반응합니다.

<br>

## 🚧 핵심 도전과제와 해결방법

### 📦 실시간 대용량 파일 전송

#### 문제 상황

FlashDrop을 개발하면서 가장 큰 도전은 **대용량 파일을 안정적으로 전송**하는 것이었습니다. 사용자들은 수 GB의 동영상이나 디자인 파일을 빠르게 공유하고 싶어했지만, 기존 방식들은 각각 심각한 한계가 있었습니다.

**💾 브라우저에서 감당하기엔 무거운 작업**

처음에는 브라우저에서 `FileReader.readAsArrayBuffer()`를 사용해 파일을 직접 읽고 업로드하는 방식으로 구현을 시작했습니다. 구현이 간단하고 직관적이며, 서버로 바로 전송할 수 있다는 점에서 이상적으로 보였습니다.

그러나 조사 중 [Stack Overflow 글](https://stackoverflow.com/questions/72663368/filereader-page-memory-leak/72676857)을 통해 심각한 문제를 발견했습니다.

해당 글에서는 **FileReader 사용 시 WebKit 기반 브라우저(iOS Safari 등)에서 메모리 누수가 발생**하며, 이로 인해 **Page memory 사용량이 계속 증가하고, GC(가비지 컬렉션)가 정상적으로 동작하지 않아 브라우저 성능이 급격히 저하될 수 있다**는 사실이 지적되었습니다.

#### 해결 방식

FlashDrop은 현재 최대 2GB까지 파일 전송이 가능하도록 설정되어 있습니다. 그러나 만약 사용자가 2GB 파일을 여러 개 연속해서 전송한다면 브라우저에 큰 부담이 될 것으로 판단했습니다.

이에 파일을 `Blob.slice` 방식으로 작은 청크 단위로 나누어 전송하는 방식을 채택했습니다. 이 방법은 브라우저 메모리 부담을 줄이는 동시에, 파일 전송 진행률을 정확하게 사용자에게 제공할 수 있고, 대용량 파일도 안정적으로 업로드할 수 있게 해줍니다.

아래는 실제로 구현한 청크 전송 방식의 핵심 코드 예시입니다. 각 청크를 `FormData`에 담아 서버에 순차적으로 전송하며, 전송 결과를 기반으로 진행률을 업데이트합니다.

```js
for (let index = 0; index < totalChunks; index++) {
  const chunk = file.slice(index * CHUNK_SIZE, (index + 1) * CHUNK_SIZE);
  const formData = new FormData();
  formData.append("chunk", chunk);
  // 추가 메타데이터 append 생략

  const res = await fetch(`${API_URL}/api/uploads/chunk`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("업로드 실패");

  const result = await res.json();
  onProgress(result.progress, fileId);
}
```

#### 결과

- 메모리 효율성: 브라우저 메모리 사용량을 안정적으로 유지
- 진행률 추적: 정확한 업로드 진행 상황 제공
- 안정성 향상: 대용량 파일 전송 시 브라우저 충돌 방지

### 🆔 로그인 없이 사용자 구별하기

#### 문제 상황

FlashDrop의 핵심 철학은 "회원가입 없이 누구나 바로 사용"하는 것이었습니다. 하지만 사용자를 구별할 수 없다면 파일 전송 상태를 관리하거나, 받는 사람을 특정할 수 없었습니다. 간편함을 추구하면서도 개별 사용자를 식별해야 하는 모순적인 상황이었습니다.

**현실적인 문제들:**

- **사용자 식별 불가**: 같은 시간에 여러 명이 접속하면 누가 누구인지 구별할 수 없음
- **세션 연속성 부족**: 앱을 껐다 켜면 완전히 새로운 사용자로 인식되어 이전 전송 내역 손실
- **전송 상태 추적 어려움**: 파일 전송 중 연결이 끊어지면 누구의 전송인지 알 수 없어 복구 불가
- **개인화 불가**: "내가 주고받은 파일들"이라는 개념 자체가 성립하지 않음

#### 해결 방식 검토

**1. 간단한 세션 ID 방식**

- 앱을 종료하거나 재시작하면 **세션 정보가 초기화**되어 모든 정보가 사라집니다.
- 네트워크가 끊겼다가 다시 연결되면 **새로운 사용자로 인식**됩니다.
- 전송 도중 앱이 종료되면 **복구가 불가능**합니다.
- 휘발성이 강하고 신뢰성이 낮아 실제 서비스에는 부적합하다고 판단했습니다.

**2. 브라우저 저장소(LocalStorage 등) 활용 방식**

- 사용자가 앱 데이터를 삭제하거나 개발자 도구를 통해 **조작이 가능**해 보안에 취약합니다.
- 저장된 ID는 브라우저 단위로 관리되기 때문에 **기기 고유성을 보장하기 어렵습니다.**
- 구현은 간단하지만 보안성과 일관성이 부족했습니다.

**3. 하드웨어 기반 Device ID 방식 (최종 선택) ✅**

- 각 컴퓨터의 하드웨어 정보를 기반으로 **고유한 식별값(Device ID)** 을 생성합니다.
- 앱을 삭제하거나 재설치해도 **동일한 ID가 유지**됩니다.
- 사용자가 조작하거나 위·변조하기 어렵기 때문에 **신뢰성과 보안성이 높습니다.**
- 별도의 로그인이나 개인정보 수집 없이도 **기기 단위의 식별**이 가능합니다.

기기 고유성을 보장하면서도 안정성과 보안성을 만족시켜 최종적으로 이 방식을 선택했습니다.

#### 구체적 구현 방법

**하드웨어 기반 고유 ID 생성 시스템**

```javascript
import fs from "fs";
import path from "path";
import { app } from "electron";
import machineId from "node-machine-id";

// 하드웨어 기반의 고유 Device ID를 생성하거나 기존 ID를 불러오는 함수
export function getOrCreateDeviceId() {
  // Electron 앱의 사용자 데이터 경로에 device_id.json 파일 경로 지정
  const deviceIdPath = path.join(app.getPath("userData"), "device_id.json");

  // 이미 저장된 device_id가 있다면 파일에서 읽어 반환
  if (fs.existsSync(deviceIdPath)) {
    const file = fs.readFileSync(deviceIdPath, "utf-8");
    const { deviceId } = JSON.parse(file);
    if (deviceId) return deviceId; // 유효한 값이면 그대로 사용
  }

  // 새로 생성: 하드웨어 정보를 기반으로 고유한 deviceId 생성 (true: 고정 ID 보장)
  const deviceId = machineId.machineIdSync(true);

  // 생성한 deviceId를 파일에 저장하여 다음에도 동일한 ID 사용 가능
  fs.writeFileSync(deviceIdPath, JSON.stringify({ deviceId }), "utf-8");

  return deviceId;
}
```

#### 결과

이 방식 덕분에 **"한 번 연결된 기기 = 고유한 수신자"** 라는 개념을 유지할 수 있었습니다.

- 사용자 식별: 로그인 없이도 기기 단위로 안정적인 사용자 구별
- 세션 연속성: 앱 재시작 후에도 이전 상태 복원 가능
- 보안성: 하드웨어 기반으로 위변조가 어려운 고유 식별
- 개인화: 기기별 파일 전송 히스토리 관리 가능

## 🏁 성과와 배운 점

이번 **FlashDrop** 프로젝트를 통해 파일 전송 시스템 전반에 대한 깊이 있는 이해와 실무 감각을 기를 수 있었습니다.

처음에는 “그냥 파일을 사용자에게 전송하면 되지 않을까?”라는 단순한 생각으로 개발을 시작했지만, 실제 구현에 들어가면서 브라우저 환경에서의 대용량 파일 처리, 네트워크 전송 방식, 시스템 설계에 대해 다방면으로 고민해야 했습니다. 단순한 파일 업로드가 아닌, 수신자가 꺼져 있는 상태에서도 전송 상태를 유지하고 이어서 받을 수 있는 구조를 설계하면서 기술적 난관뿐만 아니라 아키텍처적 사고가 필요하다는 점을 체감했습니다.

특히, FileReader를 활용한 소규모 파일 처리에는 문제가 없었지만, 대용량 파일의 경우 성능과 안정성에서 제약이 있다는 점을 알게 되었고, 그에 따라 chunk 단위 전송 방식으로 구조를 재설계하게 되었습니다. 이 과정에서 프론트엔드뿐만 아니라 백엔드와의 긴밀한 협업과 구조적 설계가 필수적이라는 점도 배웠습니다.

또한, 평소에는 다뤄보지 못했던 백엔드 환경 세팅, REST API 설계, 파일 병합 및 저장 처리 로직 구현 등도 직접 경험하며, 클라이언트-서버 간의 데이터 흐름을 보다 명확하게 이해하게 되었습니다. 단순히 기능을 구현하는 것을 넘어, 실제 서비스 환경에서 발생할 수 있는 다양한 엣지 케이스를 고려하며 개발했던 경험은 큰 자산이 되었습니다.

이번 프로젝트를 계기로 일상적으로 사용하는 앱이나 서비스의 파일 업로드 기능을 기술적 관점에서 바라볼 수 있게 되었고, 앞으로 비슷한 기능을 구현할 기회가 생긴다면 훨씬 더 효율적이고 자신 있게 개발할 수 있을 것이라는 자신감이 생겼습니다.

무엇보다도 이번 경험을 통해, 단순히 코드를 작성하는 것을 넘어서서, 서비스의 흐름을 설계하고 문제를 구조적으로 해결하는 사고방식이 개발자에게 얼마나 중요한지 깊이 느꼈습니다.

## 📌 개선 사항 및 향후 계획

FlashDrop은 계속해서 개선되고 있으며, 다음과 같은 항목들을 보완하거나 확장할 계획입니다:

- [ ] **링크 만료 시간**
  - 현재는 사용자가 설정한 만료 시간이 지나도 링크가 유효한 상태입니다.
  - 이를 해결하기 위해, 백엔드에서 주기적으로 만료된 링크를 정리하는 작업이 필요합니다.
  - Node.js 환경에서 [`node-cron`](https://github.com/kelektiv/node-cron) 패키지를 활용하여, 일정 간격으로 만료된 링크를 삭제하거나 비활성화하는 크론 작업을 수행할 예정입니다.
