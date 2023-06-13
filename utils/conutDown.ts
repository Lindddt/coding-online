/* eslint-disable no-param-reassign */

const conutDown = ({
  interval,
  time,
  startTime = new Date().getTime(),
  countDownFunc,
}: {
  /** 开始时间 */
  startTime?: number,
  /**  */
  interval: number,
  /** 倒计时 */
  time: number
}) => {

  let timeCounter: NodeJS.Timeout;

  const countDownStart = ({
    interval,
    time,
    startTime = new Date().getTime(),
  }: {
    /** 开始时间 */
    startTime?: number,
    /**  */
    interval: number,
    /** 倒计时 */
    time: number
  }) => {
    let count = 0;
    count++;
    const offset = new Date().getTime() - (startTime + count * interval);// 误差计算
    let nextTime = interval - offset;

    if (nextTime < 0) {
      nextTime = 0;
    }

    time -= interval;

    countDownFunc(time, count, nextTime);
    console.log('误差：' + offset + 'ms，下一次执行：' + nextTime + 'ms后，离活动开始还有：' + count + 'ms');

    if (time < 0) {
      clearTimeout(timeCounter);
    } else {
      timeCounter = setTimeout(countDownStart, nextTime) as unknown as NodeJS.Timeout;
    }
  };

  if (time >= 0) {
    timeCounter = setTimeout(countDownStart, interval) as unknown as NodeJS.Timeout;
  }
};