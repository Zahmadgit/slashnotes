export const xycoordinate = $state({ xValue: 0, yValue: 0 })
export const setXY = (x: number, y: number) => {
  xycoordinate.xValue = x
  xycoordinate.yValue = y
}
