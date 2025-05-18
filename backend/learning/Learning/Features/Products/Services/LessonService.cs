using FluentValidation;
using Learning.Exceptions;
using Learning.Features.Products.Contracts;
using Learning.Infrastructure.Identity;

namespace Learning.Features.Products.Services;

public interface ILessonService
{
    Task<long> CreateLessonAsync(long productId, long moduleId, LessonCreateRequest request, CancellationToken token);
    Task UpdateLessonAsync(long productId, long moduleId, long lessonId, LessonUpdateRequest request, CancellationToken token);
    Task DeleteLessonAsync(long productId, long moduleId, long lessonId, CancellationToken token);
}

public class LessonService(
    IProductRepository repo,
    ICurrentUser currentUser,
    IValidator<LessonCreateRequest> lessonCreateRequestValidator,
    IValidator<LessonUpdateRequest> lessonUpdateRequestValidator
) : ILessonService
{
    public async Task<long> CreateLessonAsync(long productId, long moduleId, LessonCreateRequest request, CancellationToken token)
    {
        await lessonCreateRequestValidator.ValidateAndThrowAsync(request, token);

        if (!await repo.ModuleExistsAsync(moduleId, productId, currentUser.GetUserId(), token))
            throw new NotFoundException("Module not found", ErrorCode.ModuleNotFound);

        var lesson = ProductMapper.FromLessonCreateRequest(request);
        await repo.AddEntityAsync(lesson, token);

        return lesson.Id;
    }

    public async Task UpdateLessonAsync(long productId, long moduleId, long lessonId, LessonUpdateRequest request, CancellationToken token)
    {
        await lessonUpdateRequestValidator.ValidateAndThrowAsync(request, token);

        var lesson = await repo.GetLessonByIdAsync(
            lessonId,
            moduleId,
            productId,
            currentUser.GetUserId(),
            token
        ) ?? throw new NotFoundException("Lesson not found", ErrorCode.LessonNotFound);

        ProductMapper.MapToLesson(lesson, request);
        await repo.UpdateEntityAsync(lesson, token);
    }

    public async Task DeleteLessonAsync(long productId, long moduleId, long lessonId, CancellationToken token)
    {
        await repo.DeleteLessonAsync(productId, moduleId, lessonId, currentUser.GetUserId(), token);
    }
}