package timeutils

import "time"

func IsOverlapping(startA, endA, startB, endB time.Time) bool {
	return startA.Before(endB) && endA.After(startB)
}

func IsWithinPeriod(start, end, periodStart, periodEnd time.Time) bool {
	return (start.Equal(periodStart) || start.After(periodStart)) &&
		(end.Equal(periodEnd) || end.Before(periodEnd))
}
