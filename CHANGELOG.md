## v1.1 변경사항

-  현재 온도에 따른 체감온도 표기 색 지정 오류 수정

![image](https://github.com/plplaaa2/HA-weather-card-custom/assets/124797654/5c951744-4d8d-42b0-8b14-4aef09230983)

체감온도 < 현재온도 일 때 딥 블루 스카이 색상이 웹 색상으로 지정된 걸 RGB로 재 지정
체감온도 > 현재온도 일 때는 오렌지 색상으로 웹 색상으로 지정 한 건 정상 작동함.

## v1.0  기본 weather-card와 차이점

1. 미세먼지, 초미세먼지, 오존, 자외선 등급 표시 및 등급에 따라 아이콘 색을 추가하여 시인성 향상

2. 비가 오면 몇 시에 비가 내리는지, 강수량은 얼마인지 정보가 추가되며 비가 그치면 사라짐

3. 현재 온도 대신 체감온도로 변환, 현재 온도보다 체감 온도가 높거나 낮을 시 색이 변함 

4. HA 4.0 이상에서 안 나오던 예보를 나오게 수정

5. 자외선 아이콘 등급 수정
