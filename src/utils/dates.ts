import dayjs, { Dayjs } from 'dayjs'

/* eslint-disable no-unused-vars */
export enum Periods {
  ALL_TIME = 'all-time',
  THIS_MONTH = 'this-month',
  LAST_MONTH = 'last-month',
  THIS_WEEK = 'this-week',
  LAST_WEEK = 'last-week'
}

interface DatePeriod {
  startDate?: Dayjs
  endDate?: Dayjs
}

export const toDateRange = (period: Periods) => {
  switch (period) {
    case Periods.ALL_TIME:
      break
    case Periods.THIS_MONTH:
      break
    case Periods.LAST_MONTH:
      break
    case Periods.THIS_WEEK:
      break
    case Periods.LAST_WEEK:
      break
    default:
      break
  }
}

export function lastWeek(): DatePeriod {
  return {
    startDate: dayjs().subtract(1, 'week').startOf('week').startOf('day'),
    endDate: dayjs().subtract(1, 'week').endOf('week').endOf('day')
  }
}

export function thisWeek(): DatePeriod {
  return {
    startDate: dayjs().startOf('week').startOf('day')
  }
}

export function lastMonth(): DatePeriod {
  return {
    startDate: dayjs().subtract(1, 'month').startOf('month').startOf('day'),
    endDate: dayjs().subtract(1, 'month').endOf('month').endOf('day')
  }
}

export function thisMonth(): DatePeriod {
  return {
    startDate: dayjs().startOf('month').startOf('day')
  }
}

export function untilYesterday(): DatePeriod {
  return {
    endDate: dayjs().subtract(1, 'day').endOf('day')
  }
}
