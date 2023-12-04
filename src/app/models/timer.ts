export class Timer {
  private timer?: number
  private isStarted: boolean

  constructor(
    private countdownMilliseconds: number,
    private clockFreq: number,
    private func: () => void
  ) {
    this.isStarted = false

  }

  public start() {
    console.log("Timer.start()");
    this.isStarted = true
    this.runTimer()
  }

  public stop() {
    if (this.isStarted) {
      clearInterval(this.timer)
    }
  }

  private runTimer() {
    console.log("Timer.runTimer() enter");

    if (this.countdownMilliseconds > 0) {
      console.log("Timer.runTimer() " + this.countdownMilliseconds + " codMilli");
      // "Timer.runTimer()"
      this.timer = setTimeout(() => {
        this.func()
        console.log("AAA");
        console.log(this.countdownMilliseconds);
        this.countdownMilliseconds -= this.clockFreq
        this.runTimer()
      }, this.clockFreq)
    }
  }

}
