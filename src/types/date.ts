export interface DateRange {
  start: Date;
  end: Date;
}

export interface DateRangeWithOptionalEnd {
  start: Date;
  end?: Date;
}

export interface DateRangeFromTo {
  from: Date;
  to: Date;
}