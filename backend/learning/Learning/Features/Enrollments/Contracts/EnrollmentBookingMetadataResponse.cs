namespace Learning.Features.Enrollments.Contracts;

public record EnrollmentBookingMetadataResponse(
    bool IsValid = false,
    string ErrorMessage = null,
    string EducatorId = null,
    long? ProductId = null,
    string Title = null
);
