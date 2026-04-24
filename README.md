# 🌤️ Lovelace Animated Weather Card for Naver Weather

Lovelace 환경에서 사용할 수 있는 애니메이션 날씨 카드입니다. 이 카드는 네이버 날씨(Naver Weather) 통합 구성요소에 최적화되어 있으며, [amCharts](https://www.amcharts.com/free-animated-svg-weather-icons/)의 아름다운 SVG 애니메이션 아이콘을 사용합니다.

![normal](https://github.com/user-attachments/assets/f5ebb55a-a573-4218-88cd-d722e834a98a)

---

## ✨ 주요 특징
- **애니메이션 아이콘**: 기상 상태에 따라 움직이는 고품질 SVG 아이콘 적용.
- **네이버 날씨 최적화**: 국내 환경에 맞는 네이버 날씨 데이터 완벽 대응.
- **Lit 기반**: 최신 Lit 프레임워크를 사용하여 빠르고 가벼운 성능.
- **다양한 정보**: 기온, 습도, 풍속 등 상세 날씨 정보 표시.

---

## 🚀 설치 방법

### 1. HACS를 통한 자동 설치 (권장)
아래 버튼을 클릭하면 Home Assistant 인스턴스의 HACS 저장소 추가 화면으로 바로 연결됩니다.

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=plplaaa2&repository=weather-card&category=dashboard)

### 2. 수동 설치 방법
HACS를 사용 중이라면 아래 절차를 통해 커스텀 저장소로 추가할 수 있습니다.

1. 기존에 설치된 다른 `weather-card`가 있다면 삭제합니다.
2. **HACS > Frontend** 메뉴로 이동합니다.
3. 우측 상단 메뉴(⋮)에서 **Custom repositories**를 선택합니다.
4. 아래 정보를 입력하고 추가합니다.
   - **Repository**: `https://github.com/plplaaa2/weather-card`
   - **Category**: `Dashboard`
5. 추가된 `Weather-card`을 클릭하여 설치합니다.

---

## 🛠️ 카드 설정 및 사용

1. 대시보드 우측 상단 **편집** 버튼 클릭 후 **카드 추가**를 누릅니다.
2. 카드 목록에서 `weather-card`를 검색하여 선택합니다.
3. **구성 요소(Entity)** 항목에서 설치된 `naver_weather` 엔티티를 선택합니다.
4. 필요에 따라 옵션을 조정하고 저장합니다.

---

## 🙏 Special Thanks
- **Origin**: @arsaboo, @ciotlosm, @bramkragten (Lovelace & Lit conversion)
- **Naver Weather Integration**: [miumida](https://github.com/miumida)님 (HACS 네이버 날씨 제작자)
- **Icons**: [amCharts](https://www.amcharts.com/)

---

## 📜 라이선스
이 프로젝트는 원본 프로젝트의 라이선스를 계승하며, 자유롭게 수정 및 배포가 가능합니다.

## 후원
[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/plplaaa2)
