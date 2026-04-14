const LitElement = customElements.get("ha-panel-lovelace")
  ? Object.getPrototypeOf(customElements.get("ha-panel-lovelace"))
  : Object.getPrototypeOf(customElements.get("hc-lovelace"));
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

const weatherIconsDay = {
  clear: "day",
  "clear-night": "night",
  cloudy: "cloudy",
  fog: "cloudy",
  hail: "rainy-7",
  lightning: "thunder",
  "lightning-rainy": "thunder",
  partlycloudy: "cloudy-day-3",
  pouring: "rainy-6",
  rainy: "rainy-5",
  snowy: "snowy-6",
  "snowy-rainy": "rainy-7",
  sunny: "day",
  windy: "cloudy",
  "windy-variant": "cloudy-day-3",
  exceptional: "!!",
};

const weatherIconsNight = {
  ...weatherIconsDay,
  clear: "night",
  sunny: "night",
  partlycloudy: "cloudy-night-3",
  "windy-variant": "cloudy-night-3",
};

const windDirections = [
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW",
  "N",
];


window.customCards = window.customCards || [];
window.customCards.push({
  type: "weather-card",
  name: "Weather Card",
  description: "A custom weather card with animated icons.",
  preview: true,
  documentationURL: "https://github.com/bramkragten/weather-card",
});

const fireEvent = (node, type, detail, options) => {
  options = options || {};
  detail = detail === null || detail === undefined ? {} : detail;
  const event = new Event(type, {
    bubbles: options.bubbles === undefined ? true : options.bubbles,
    cancelable: Boolean(options.cancelable),
    composed: options.composed === undefined ? true : options.composed,
  });
  event.detail = detail;
  node.dispatchEvent(event);
  return event;
};

function hasConfigOrEntityChanged(element, changedProps) {
  if (changedProps.has("_config") || changedProps.has("_forecastEvent")) {
    return true;
  }

  if (!changedProps.has("hass")) {
    return false;
  }

  const oldHass = changedProps.get("hass");
  if (oldHass) {
    return (
      oldHass.states[element._config.entity] !==
        element.hass.states[element._config.entity] ||
      oldHass.states["sun.sun"] !== element.hass.states["sun.sun"]
    );
  }

  return true;
}

class WeatherCard extends LitElement {
  static get properties() {
    return {
      _config: {},
      _forecastEvent: {},
      hass: {},
    };
  }

  static getConfigForm() {
    return {
      schema: [
        {
          name: "entity",
          required: true,
          selector: { entity: { domain: "weather" } },
        },
        {
          name: "name",
          selector: { text: {} },
        },
        { name: "current", default: true, selector: { boolean: {} } },
        { name: "details", default: true, selector: { boolean: {} } },
        { name: "forecast", default: true, selector: { boolean: {} } },
        {
          name: "forecast_type",
          default: "daily",
          selector: {
            select: {
              options: [
                { value: "hourly", label: "Hourly" },
                { value: "daily", label: "Daily" },
              ],
            },
          },
        },
        { name: "number_of_forecasts", default: 5, selector: { number: {} } },
        { name: "precip_start_sensor", selector: { entity: { domain: "sensor" } } },
        { name: "precip_quantity_sensor", selector: { entity: { domain: "sensor" } } },
        { name: "pm10_sensor", selector: { entity: { domain: "sensor" } } },
        { name: "uv_sensor", selector: { entity: { domain: "sensor" } } },
        { name: "pm25_sensor", selector: { entity: { domain: "sensor" } } },
        { name: "ozone_sensor", selector: { entity: { domain: "sensor" } } },
      ],
    };
  }

  static getStubConfig(hass, unusedEntities, allEntities) {
    let entity = unusedEntities.find((eid) => eid.split(".")[0] === "weather");
    if (!entity) {
      entity = allEntities.find((eid) => eid.split(".")[0] === "weather");
    }
    return { entity };
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("Please define a weather entity");
    }
    this._config = {
      forecast_type: "daily",
      ...config
    };
  }

  _needForecastSubscription() {
    return (
      this._config &&
      this._config.forecast !== false &&
      this._config.forecast_type &&
      this._config.forecast_type !== "legacy"
    );
  }

  _unsubscribeForecastEvents() {
    if (this._subscribed) {
      this._subscribed.then((unsub) => unsub());
      this._subscribed = undefined;
    }
  }

  async _subscribeForecastEvents() {
    this._unsubscribeForecastEvents();
    if (
      !this.isConnected ||
      !this.hass ||
      !this._config ||
      !this._needForecastSubscription()
    ) {
      return;
    }

    this._subscribed = this.hass.connection.subscribeMessage(
      (event) => {
        this._forecastEvent = event;
      },
      {
        type: "weather/subscribe_forecast",
        forecast_type: this._config.forecast_type,
        entity_id: this._config.entity,
      }
    );
  }

  _getValue(sensor, attrValue) {
    if (sensor && this.hass.states[sensor]) {
      return this.hass.states[sensor].state;
    }
    return attrValue || '-';
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.hasUpdated && this._config && this.hass) {
      this._subscribeForecastEvents();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unsubscribeForecastEvents();
  }

  shouldUpdate(changedProps) {
    return hasConfigOrEntityChanged(this, changedProps);
  }

  updated(changedProps) {
    if (!this.hass || !this._config) {
      return;
    }
    if (changedProps.has("_config") || !this._subscribed) {
      this._subscribeForecastEvents();
    }
  }

  getWindDir(deg) {
    if (deg === undefined) return "";
    if (isNaN(deg)) return deg;
    return windDirections[Math.floor((deg + 11.25) / 22.5)];
  }

  render() {
    if (!this._config || !this.hass) {
      return html``;
    }

    this.numberElements = 0;

    const lang = this.hass.selectedLanguage || this.hass.language;
    const stateObj = this.hass.states[this._config.entity];

    if (!stateObj) {
      console.warn("WeatherCard: Entity not found", this._config.entity);
      return html`
        <style>
          .not-found {
            flex: 1;
            background-color: var(--warning-color);
            padding: 8px;
          }
        </style>
        <ha-card>
          <div class="not-found">
            Entity not available: ${this._config.entity}
          </div>
        </ha-card>
      `;
    }

    const forecast = this._forecastEvent || {
      forecast: stateObj.attributes.forecast,
      type: this._config.hourly_forecast ? "hourly" : "daily",
    };

    // 디버깅 로그 추가
    console.log("WeatherCard Rendering - Entity:", this._config.entity, "State:", stateObj.state);

    return html`
      <ha-card @click="${this._handleClick}">
        ${this._config.current !== false ? this.renderCurrent(stateObj, forecast) : ""}
        ${this._config.details !== false
          ? this.renderDetails(stateObj, lang)
          : ""}
        ${this._config.forecast !== false
          ? this.renderForecast(forecast, lang)
          : ""}
      </ha-card>
    `;
  }

  renderCurrent(stateObj, forecast) {
    try {
      this.numberElements++;
      const forecastData = forecast?.forecast || [];
      const today = forecastData.length > 0 ? forecastData[0] : null;
      
      const state = stateObj?.state || "";
      const attributes = stateObj?.attributes || {};
      
      console.log("WeatherCard renderCurrent - Attributes:", attributes);

      const statusText = this.hass.formatEntityState ? this.hass.formatEntityState(stateObj) : state;
      const currentTemp = attributes.temperature !== undefined ? attributes.temperature : (attributes.apparent_temperature || attributes.TodayFeelTemp || '-');
      const minTemp = today?.templow !== undefined ? today.templow : (attributes.TodayMinTemp || '-');
      const maxTemp = today?.temperature !== undefined ? today.temperature : (attributes.TodayMaxTemp || '-');
      const humidity = attributes.humidity !== undefined ? attributes.humidity : '-';
      const windSpeed = attributes.WindSpeed || attributes.wind_speed || '-';
      const windBearing = attributes.wind_bearing;

      const iconPath = this.getWeatherIcon((state || "").toLowerCase(), this.hass.states["sun.sun"]);

      return html`
        <div class="current ${this.numberElements > 1 ? "spacer" : ""}">
          <span
            class="icon bigger"
            style="background: none, url('${iconPath}') no-repeat; background-size: contain;"
            >${state}
          </span>
          <span class="title">
            ${statusText}<br>
            <span class="subinfo">
              ${minTemp}° / ${maxTemp}°
              <span>습도 ${humidity}% ${this.getWindDir(windBearing)}풍 ${windSpeed} <span class="unit">m/s</span></span>
            </span>
          </span>
          <span class="temp">${currentTemp}</span>
          <span class="tempc">${this.getUnit("temperature")}</span>
        </div>
      `;
    } catch (e) {
      console.error("Error rendering current weather:", e);
      return html`<div class="current">Error rendering current weather</div>`;
    }
  }

  getWindDir(deg) {
    if (deg === undefined || deg === null || deg === "") return "";
    if (isNaN(deg)) return deg;
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];
    return directions[Math.floor((parseFloat(deg) + 11.25) / 22.5)];
  }

  renderDetails(stateObj) {
    const sun = this.hass.states["sun.sun"];
    let next_rising;
    let next_setting;

    if (sun) {
      next_rising = new Date(sun.attributes.next_rising);
      next_setting = new Date(sun.attributes.next_setting);
    }

    this.numberElements++;

    return html`
      <ul class="variations ${this.numberElements > 1 ? "spacer" : ""}">
       ${this._getValue(this._config.precip_start_sensor, stateObj.attributes.rainyStart) !== '비안옴'
            ? html`
                <li>
		  <ha-icon icon="${!['rainy', 'pouring', 'lightning-rainy'].includes(stateObj.state) ? 'mdi:umbrella-closed-variant' : 'mdi:umbrella'}" style="color: rgb(224, 161, 49)"></ha-icon>
                  <span style="color: ${this._getValue(this._config.precip_start_sensor, stateObj.attributes.rainyStart) !== '비안옴' ? 'rgb(224, 161, 49)' : ''};"> ${this._getValue(this._config.precip_start_sensor, stateObj.attributes.rainyStart)} 비 내림</span>
                </li>
              `
            : ""}
		${this._getValue(this._config.precip_start_sensor, stateObj.attributes.rainyStart) !== '비안옴'
            ? html`
                <li>
                  <ha-icon icon="${this._getValue(this._config.precip_quantity_sensor, stateObj.attributes.precipitation || stateObj.attributes.Rainfall) == 0 ? 'mdi:weather-cloudy' : this._getValue(this._config.precip_quantity_sensor, stateObj.attributes.precipitation || stateObj.attributes.Rainfall) > 0 && this._getValue(this._config.precip_quantity_sensor, stateObj.attributes.precipitation || stateObj.attributes.Rainfall) <= 3 ? 'mdi:weather-rainy' : this._getValue(this._config.precip_quantity_sensor, stateObj.attributes.precipitation || stateObj.attributes.Rainfall) >= 4 ? 'mdi:weather-pouring' : ''}" style="color: rgb(224, 161, 49)"></ha-icon>
                  예상 강수량 ${this._getValue(this._config.precip_quantity_sensor, stateObj.attributes.precipitation || stateObj.attributes.Rainfall)}㎜
                </li>
              `
            : ""}
        <li>
          <ha-icon icon= "mdi:blur" style="color: ${this._getValue(this._config.pm10_sensor, stateObj.attributes.FineDustGrade) === '좋음' ? 'rgb(13, 93, 148)' : this._getValue(this._config.pm10_sensor, stateObj.attributes.FineDustGrade) === '보통' ? 'rgb(13, 187, 74)' : this._getValue(this._config.pm10_sensor, stateObj.attributes.FineDustGrade) === '나쁨' ? 'rgb(224, 161, 49)' : this._getValue(this._config.pm10_sensor, stateObj.attributes.FineDustGrade) === '매우나쁨' ? 'red' : 'rgba(255, 255, 255, 0)'};"></ha-icon>
          미세먼지 ${this._getValue(this._config.pm10_sensor, stateObj.attributes.FineDustGrade)}
        </li>
        <li>
          <ha-icon icon="mdi:sun-wireless-outline" style="color: ${this._getValue(this._config.uv_sensor, stateObj.attributes.TodayUVGrade) === '좋음' ? 'rgb(13, 93, 148)' : this._getValue(this._config.uv_sensor, stateObj.attributes.TodayUVGrade) === '보통' ? 'rgb(13, 187, 74)' : this._getValue(this._config.uv_sensor, stateObj.attributes.TodayUVGrade) === '높음' ? 'rgb(224, 161, 49)' : this._getValue(this._config.uv_sensor, stateObj.attributes.TodayUVGrade) === '매우높음' ? 'red' : this._getValue(this._config.uv_sensor, stateObj.attributes.TodayUVGrade) === '위험' ? 'violet' : 'rgba(255, 255, 255, 0)'};"></ha-icon>
          자외선 ${this._getValue(this._config.uv_sensor, stateObj.attributes.TodayUVGrade)}
        </li>
        <li>
          <ha-icon icon="mdi:blur-linear" style="color: ${this._getValue(this._config.pm25_sensor, stateObj.attributes.UltraFineDustGrade) === '좋음' ? 'rgb(13, 93, 148)' : this._getValue(this._config.pm25_sensor, stateObj.attributes.UltraFineDustGrade) === '보통' ? 'rgb(13, 187, 74)' : this._getValue(this._config.pm25_sensor, stateObj.attributes.UltraFineDustGrade) === '나쁨' ? 'rgb(224, 161, 49)' : this._getValue(this._config.pm25_sensor, stateObj.attributes.UltraFineDustGrade) === '매우나쁨' ? 'red' : 'rgba(255, 255, 255, 0)'};"></ha-icon>
          초미세먼지 ${this._getValue(this._config.pm25_sensor, stateObj.attributes.UltraFineDustGrade)}
        </li>
        <li>
          <ha-icon icon="mdi:alert-circle-outline" style="color: ${this._getValue(this._config.ozone_sensor, stateObj.attributes.OzonGrade) === '좋음' ? 'rgb(13, 93, 148)' : this._getValue(this._config.ozone_sensor, stateObj.attributes.OzonGrade) === '보통' ? 'rgb(13, 187, 74)' : this._getValue(this._config.ozone_sensor, stateObj.attributes.OzonGrade) === '나쁨' ? 'rgb(224, 161, 49)' : this._getValue(this._config.ozone_sensor, stateObj.attributes.OzonGrade) === '매우나쁨' ? 'red' : 'rgba(255, 255, 255, 0)'};"></ha-icon>
          오존 ${this._getValue(this._config.ozone_sensor, stateObj.attributes.OzonGrade)}
        </li>
        ${next_rising
          ? html`
              <li>
                <ha-icon icon="mdi:weather-sunset-up" style="color: orange"></ha-icon>
                ${next_rising.toLocaleTimeString()}
              </li>
            `
          : ""}
        ${next_setting
          ? html`
              <li>
                <ha-icon icon="mdi:weather-sunset-down" style="color: red"></ha-icon>
                ${next_setting.toLocaleTimeString()}
              </li>
            `
          : ""}
      </ul>
    `;
  }

  renderForecast(forecast, lang) {
    if (!forecast || !forecast.forecast || forecast.forecast.length === 0) {
      return html``;
    }

    this.numberElements++;
    return html`
      <div class="forecast clear ${this.numberElements > 1 ? "spacer" : ""}">
        ${forecast.forecast
          .slice(
            0,
            this._config.number_of_forecasts
              ? this._config.number_of_forecasts
              : 5
          )
          .map(
            (daily) => html`
              <div class="day">
                <div class="dayname">
                  ${forecast.type === "hourly"
                    ? new Date(daily.datetime).toLocaleTimeString(lang, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : new Date(daily.datetime).toLocaleDateString(lang, {
                        weekday: "short",
                      })}
                </div>
                <i
                  class="icon"
                  style="background: none, url('${this.getWeatherIcon(
                    daily.condition.toLowerCase()
                  )}') no-repeat; background-size: contain"
                ></i><br>
                ${daily.templow !== undefined
                  ? html`
                      <span class="lowTemp">${daily.templow}°/</span>
                    `
                  : ""}<span class="highTemp">${daily.temperature}°</span>
                
                ${!this._config.hide_precipitation &&
                daily.precipitation !== undefined &&
                daily.precipitation !== null
                  ? html`
                      <div class="precipitation">
                        ${Math.round(daily.precipitation * 10) / 10}
                        ${this.getUnit("precipitation")}
                      </div>
                    `
                  : ""}
                ${!this._config.hide_precipitation &&
                daily.precipitation_probability !== undefined &&
                daily.precipitation_probability !== null
                  ? html`
                      <div class="precipitation_probability">
                        ${Math.round(daily.precipitation_probability)}
                        ${this.getUnit("precipitation_probability")}
                      </div>
                    `
                  : ""}
              </div>
            `
          )}
      </div>
    `;
  }

  getWeatherIcon(condition, sun) {
    return `${
      this._config.icons
        ? this._config.icons
        : "https://cdn.jsdelivr.net/gh/bramkragten/weather-card/dist/icons/"
    }${
      sun && sun.state == "below_horizon"
        ? weatherIconsNight[condition]
        : weatherIconsDay[condition]
    }.svg`;
  }

  getUnit(measure) {
    const lengthUnit = this.hass.config.unit_system.length;
    switch (measure) {
      case "air_pressure":
        return lengthUnit === "km" ? "hPa" : "inHg";
      case "length":
        return lengthUnit;
      case "precipitation":
        return lengthUnit === "km" ? "mm" : "in";
      case "precipitation_probability":
        return "%";
      default:
        return this.hass.config.unit_system[measure] || "";
    }
  }

  _handleClick() {
    fireEvent(this, "hass-more-info", { entityId: this._config.entity });
  }

  getCardSize() {
    return 3;
  }

  static get styles() {
    return css`
      ha-card {
        cursor: pointer;
        margin: auto;
        overflow: hidden;
        padding-top: 1.3em;
        padding-bottom: 1.3em;
        padding-left: 1em;
        padding-right: 1em;
        position: relative;
      }

      .spacer {
        padding-top: 1em;
      }

      .clear {
        clear: both;
      }

      .title {
        position: absolute;
        left: 7em;
        top: 0.5em;
        font-weight: 300;
        font-size: 1.5em;
        color: var(--primary-text-color);
      }
	  
      .subinfo {  
        display: flex;
        flex-direction: column;
	justify-content: flex-start;
	align-content: flex-start;
        gap: 0px; /* 요소 간 간격 조정 */
	font-size: 0.7em;
        color: var(--secondary-text-color);
      }

      .temp {
        top: 0.5em;
        font-weight: 300;
        font-size: 2.5em;
        color: var(--primary-text-color);
        position: absolute;
        right: 1.2em;
      }

      .tempc {
        top: 0.5em;
        font-weight: 300;
        font-size: 1.3em;
        vertical-align: super;
        color: var(--primary-text-color);
        position: absolute;
        right: 1em;
        margin-top: 0px;
        margin-right: 7px;
      }
      
      .hum {
        font-weight: 300;
        font-size: 0.7em;
        color: var(--primary-text-color);
        position: absolute;
        right: 1.2em;
        margin-top: -25px;
        margin-right: 7px;
      }

      @media (max-width: 460px) {
        .title {
          font-size: 1.5em;
          left: 6em;
        }
        .temp {
          font-size: 3em;
        }
        .tempc {
          font-size: 1.2em;
        }
      }

      .current {
        padding: 1.2em 0;
        margin-bottom: 3.5em;
      }

      .weathercast {
        position: absolute;
        left: 3em;
        font-weight: 300;
        color: var(--primary-text-color);
      }

      .variations {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        font-weight: 300;
        color: var(--primary-text-color);
        list-style: none;
        padding: 0 1em;
        margin: 0;
      }

      .variations ha-icon {
        height: 22px;
        margin-right: 5px;
        color: var(--paper-item-icon-color);
      }

      .variations li {
        flex-basis: auto;
        width: 50%;
      }

      .variations li:nth-child(2n) {
        text-align: right;
      }

      .variations li:nth-child(2n) ha-icon {
        margin-right: 0;
        margin-left: 8px;
        float: right;
      }

      .unit {
        font-size: 0.8em;
      }

      .forecast {
        width: 100%;
        margin: 0 auto;
        display: flex;
      }

      .day {
        flex: 1;
        display: block;
        text-align: center;
        color: var(--primary-text-color);
        border-right: 0.1em solid #d9d9d9;
        line-height: 2;
        box-sizing: border-box;
      }

      .dayname {
        text-transform: uppercase;
      }

      .forecast .day:first-child {
        margin-left: 0;
      }

      .forecast .day:nth-last-child(1) {
        border-right: none;
        margin-right: 0;
      }

      .highTemp {
        font-weight: bold;
      }

      .lowTemp {
        color: var(--secondary-text-color);
      }

      .precipitation {
        color: var(--primary-text-color);
        font-weight: 300;
      }

      .icon.bigger {
        width: 10em;
        height: 10em;
        margin-top: -4em;
        position: absolute;
        left: 0em;
      }

      .icon {
        width: 50px;
        height: 50px;
        margin-right: 5px;
        display: inline-block;
        vertical-align: middle;
        background-size: contain;
        background-position: center center;
        background-repeat: no-repeat;
        text-indent: -9999px;
      }

      .weather {
        font-weight: 300;
        font-size: 1em;
        color: var(--primary-text-color);
        text-align: left;
        position: absolute;
        top: -0.5em;
        left: 6em;
        word-wrap: break-word;
        width: 30%;
      }
    `;
  }
}
customElements.define("weather-card", WeatherCard);
