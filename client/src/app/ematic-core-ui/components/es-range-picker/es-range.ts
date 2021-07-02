export class EsRange {
  private _startDate: Date;
  private _endDate: Date;

  get startDate(): Date {
    return this._startDate;
  }

  set startDate(value: Date) {
    this._startDate = value;
  }

  get endDate(): Date {
    return this._endDate;
  }

  set endDate(value: Date) {
    this._endDate = value;
  }

  constructor(range?) {
    if (!arguments.length) {
      this.startDate = new Date();
      this.endDate = new Date();
    } else {
      this.startDate = new Date(range._startDate);
      this.endDate = new Date(range._endDate);
    }
  }
}
