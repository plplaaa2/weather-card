# Lovelace animated weather card for naver weather

Originally created for the [old UI](https://community.home-assistant.io/t/custom-ui-weather-state-card-with-a-question/23008) converted by @arsaboo and @ciotlosm to [Lovelace](https://community.home-assistant.io/t/custom-ui-weather-state-card-with-a-question/23008/291) and now converted to Lit to make it even better.

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

# Hosted:

Add the following to resources in your lovelace config:

```yaml
- url: https://cdn.jsdelivr.net/gh/bramkragten/weather-card/dist/weather-card.min.js
  type: module
```

# Manual:

1. Download the [weather-card.js](https://raw.githubusercontent.com/bramkragten/weather-card/v1.2.0/dist/weather-card.js) to `/config/www/custom-lovelace/weather-card/`. (or an other folder in `/config/www/`)
2. Save, the [amCharts icons](https://www.amcharts.com/free-animated-svg-weather-icons/) (The contents of the folder "animated") under `/config/www/custom-lovelace/weather-card/icons/` (or an other folder in `/config/www/`)
3. If you use Lovelace in storage mode, and want to use the editor, download the [weather-card-editor.js](https://raw.githubusercontent.com/bramkragten/weather-card/v1.2.0/dist/weather-card-editor.js) to `/config/www/custom-lovelace/weather-card/`. (or the folder you used above)

Add the following to resources in your lovelace config:

```yaml
resources:
  - url: /local/custom-lovelace/weather-card/weather-card.js
    type: module
```

## Configuration:

And add a card with type `custom:weather-card`:

```yaml
type: custom:weather-card
entity: weather.yourweatherentity
name: Optional name
```

If you want to use your local icons add the location to the icons:

```yaml
type: custom:weather-card
entity: weather.yourweatherentity
icons: "/local/custom-lovelace/weather-card/icons/"
```

You can choose wich elements of the weather card you want to show:

The 3 different rows, being:

- The current weather icon, the current temperature and title
- The details about the current weather
- The X day forecast or hourly forecast

```yaml
type: custom:weather-card
entity: weather.yourweatherentity
current: true
details: false
forecast: true
hourly_forecast: false
number_of_forecasts: 5
```

If you want to show the sunrise and sunset times, make sure the `sun` component is enabled:

```yaml
# Example configuration.yaml entry
sun:
```

### Dark Sky:

When using Dark Sky you should put the mode to `daily` if you want a daily forecast with highs and lows.

```yaml
# Example configuration.yaml entry
weather:
  - platform: darksky
    api_key: YOUR_API_KEY
    mode: daily
```

### OpenWeather Map:

When using OpenWeather map you can select hourly(default) or daily forecast to show.

```yaml
# Example configuration.yaml entry
weather:
  - platform: openweathermap
    api_key: YOUR_API_KEY
```
