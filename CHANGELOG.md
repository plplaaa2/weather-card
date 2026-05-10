## 1.3.1

- 오늘 비 소식이 없을 때 내일 비 시작 시간을 표시하는 로직 추가

## 1.3
- 데이터 소스 통합: 별도 센서 지정 없이 날씨 엔티티(weather.*)의 예보 및 속성 데이터를 직접 활용하도록 개선.
- 가변 데이터 로딩 (_getValue): 사용자가 지정한 센서값이 없을 경우, 날씨 엔티티의 속성에서 자동으로 데이터를 찾아 표시하는 폴백 로직 구현.
- 온도 표시 최적화: 메인 온도를 '체감 온도' 센서 의존에서 '현재 온도' 및 '표준 체감 온도' 속성 기반으로 변경.
- 풍속 단위 고정: HA 시스템 설정에 상관없이 m/s 단위를 우선적으로 표시하도록 수정.
- 안정성 강화: Optional Chaining 및 try-catch 구문을 도입하여 데이터 누락 시에도 카드가 정상적으로 렌더링되도록 보강.
- 네이버 날씨 컴포넌트 (Backend)
- 속성(Attributes) 확장: 미세먼지 등급, 초미세먼지 등급, 자외선, 오존, 비 시작 시간 등을 엔티티 속성으로 대거 추가.
- 표준 속성 매핑: native_apparent_temperature(체감온도), native_precipitation(강수량) 등을 HA 표준 규격에 맞게 매핑.
- 풍속 단위 정상화: 백엔드에서 m/s 단위를 유지하도록 계산식 수정 및 단위 명시.
- 설정 화면 최적화: 불필요해진 센서 수동 설정 항목들에 대한 기본값을 제거하여 자동 연동 유도.

## 1.2.1

- Not need change entity_id

## 1.2.0

- Added UI editor
- Hide forecast when not available

## 1.1.0

- Added sun rise and set times
- Added option for `name`
- Some styling tweaks

## 1.0.1

- Added state `clear-night` @AVirtualL
- Fixes for RTL @AVirtualL
- Used local Lit @iantrich
- Use hosted icons, option to use local icons with `icons:`
