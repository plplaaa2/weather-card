# Lovelace animated weather card for naver weather

Originally created for the [old UI](https://community.home-assistant.io/t/custom-ui-weather-state-card-with-a-question/23008) converted by @arsaboo and @ciotlosm to [Lovelace](https://community.home-assistant.io/t/custom-ui-weather-state-card-with-a-question/23008/291) and @bramkragten now converted to Lit to make it even better.

This card uses the awesome [animated SVG weather icons by amCharts](https://www.amcharts.com/free-animated-svg-weather-icons/).

![normal](https://github.com/user-attachments/assets/f5ebb55a-a573-4218-88cd-d722e834a98a)

Thanks for all picking this card up.

## 사전 주의사항

기본 센서 값이 'sensor.naver~' 로 시작되는 것만 사용 가능하기 때문에
한글을 영문으로 쓴 센서값 'sensor.gangsuryang' 일 경우
기기 및 서비스 -> 네이버 날씨 -> 구성요소에 들어가 센서 값을 'sensor.naver~' 로 다시 수정하여야 사용 가능

## 설치 방법:

네이버 날씨설치
Special Thanks HACS 네이버 날씨 제작자 miumida님

1. 기존 weather-card 삭제

2. 네이버 날씨 특화 Weather-card 설치 ( HACS -> frontend -> : -> custom repositories)
repositories : https://github.com/plplaaa2/weather-card
category : dashboard

## Dashboard 설정
