package products

var (
	Unschedulable = "UNSCHEDULABLE"
	Valid         = "VALID"
	Invalid       = "INVALID"
)

type ProductSchedulingMetadataRequest struct {
	LessonId    *int64 `json:"lessonId"`
	DurationMin int    `json:"durationMin"`
}

type ProductSchedulingMetadataResponse struct {
	State           string `json:"state"`
	ErrorMessage    string `json:"errorMessage"`
	Title           string `json:"title"`
	MaxParticipants int    `json:"maxParticipants"`
}

type EnrollmentBookingMetadataRequest struct {
	DurationMin int `json:"durationMin"`
}

type EnrollmentBookingMetadataResponse struct {
	IsValid      bool   `json:"isValid"`
	ErrorMessage string `json:"errorMessage"`
	EducatorId   string `json:"educatorId"`
	ProductId    *int64 `json:"productId"`
	Title        string `json:"title"`
}
