# Lovelace animated weather card for naver weather

Originally created for the [old UI](https://community.home-assistant.io/t/custom-ui-weather-state-card-with-a-question/23008) converted by @arsaboo and @ciotlosm to [Lovelace](https://community.home-assistant.io/t/custom-ui-weather-state-card-with-a-question/23008/291) and @bramkragten now converted to Lit to make it even better.

This card uses the awesome [animated SVG weather icons by amCharts](https://www.amcharts.com/free-animated-svg-weather-icons/).

![normal](https://github.com/user-attachments/assets/f5ebb55a-a573-4218-88cd-d722e834a98a)

Thanks for all picking this card up.

## 사전 주의사항

기본 센서 값이 'sensor.naver~' 로 시작되는 것만 사용 가능하기 때문에
한글을 영문으로 쓴 센서값 'sensor.gangsuryang' 일 경우
기기 및 서비스 -> 네이버 날씨 -> 구성요소에 들어가 센서 값을 'sensor.naver~' 로 다시 수정하여야 사용 가능

**entity id 수정 전**

![image](https://github.com/user-attachments/assets/4e2a6752-c04b-4d7b-b73e-ea2137f4e568)

이름을 클릭하면 바꿀 이름이 자동으로 나오니 적어 뒀다가 아래처럼 수정

**entity id 수정 후**

![image](https://github.com/user-attachments/assets/5c0dcad7-d1b1-4ba9-b462-91c2be380d33)

네이버 날씨의 모든 센서를 이와 같이 변경해야 함
(단, 뒤에 숫자는 _1 만 가능하기 때문에 네이버 날씨 카드로 쓸 수 있는 지역은 한 곳뿐)

## 설치 방법

네이버 날씨설치
Special Thanks HACS 네이버 날씨 제작자 miumida님

1. 기존 weather-card 삭제

2. 네이버 날씨 특화 Weather-card 설치 ( HACS -> frontend -> : -> custom repositories)
```
repositories : https://github.com/plplaaa2/weather-card
category : dashboard
```
4. 카드 추가 버튼 누르기
5. 카드 찾기에서 weather card 입력
6. weather card 선택
7. 구성요소에서 naver 날씨 선택

