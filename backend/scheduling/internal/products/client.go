package products

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"

	"github.com/maksmelnyk/scheduling/config"
)

type ProductServiceClient struct {
	baseURL    string
	httpClient *http.Client
}

func NewProductServiceClient(cfg config.ExternalServiceConfig, httpClient *http.Client) *ProductServiceClient {
	return &ProductServiceClient{
		baseURL:    cfg.LearningServiceUrl,
		httpClient: httpClient,
	}
}

func (s *ProductServiceClient) GetSchedulingMetadata(
	ctx context.Context,
	productId int64,
	lessonId *int64,
	durationMin int,
	authHeader string,
) (*ProductSchedulingMetadataResponse, error) {
	request := ProductSchedulingMetadataRequest{
		LessonId:    lessonId,
		DurationMin: durationMin,
	}

	jsonData, _ := json.Marshal(request)

	fullURL, err := url.JoinPath(s.baseURL, "api/v1/products", fmt.Sprintf("%d", productId), "scheduling-metadata")
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", fullURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", authHeader)

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, errors.New("Request failed with status:" + resp.Status)
	}

	var response ProductSchedulingMetadataResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return nil, errors.New("Failed to decode response:" + err.Error())
	}

	return &response, nil
}

func (s *ProductServiceClient) GetBookingMetadata(
	ctx context.Context,
	enrollmentId int64,
	durationMin int,
	authHeader string,
) (*EnrollmentBookingMetadataResponse, error) {
	request := EnrollmentBookingMetadataRequest{
		DurationMin: durationMin,
	}
	jsonData, _ := json.Marshal(request)

	fullURL, err := url.JoinPath(s.baseURL, "api/v1/enrollments", fmt.Sprintf("%d", enrollmentId), "booking-metadata")
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", fullURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", authHeader)

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, errors.New("Request failed with status:" + resp.Status)
	}

	var response EnrollmentBookingMetadataResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return nil, errors.New("Failed to decode response:" + err.Error())
	}

	return &response, nil
}
