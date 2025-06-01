using Learning.Features.Products.Contracts;
using Learning.Features.Products.Services;
using Learning.Infrastructure.Keycloak;
using Learning.Shared.Pagination;

namespace Learning.Features.Products;

public static class ProductApi
{
    public static void MapProductEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var productGroup = endpoints.MapGroup("api/v1/products")
            .WithTags("Products");

        productGroup.MapGet("", async (
            [AsParameters] ProductFilter filter,
            CancellationToken token,
            IProductReadService service,
            int pageNumber = 1,
            int pageSize = 20) =>
        {
            var courses = await service.GetProductsAsync(
                filter,
                pageNumber,
                pageSize,
                token
            );
            return Results.Ok(courses);
        })
        .WithName("GetProductsAsync")
        .WithSummary("Retrieve Products")
        .WithDescription("Retrieves a list of products filtered by optional educator, category, or sub-category parameters, with pagination support using pageNumber and pageSize.")
        .Produces<PagedResult<ProductSummaryResponse>>(StatusCodes.Status200OK)
        .AllowAnonymous();

        productGroup.MapGet("educator/{educatorId:guid}", async (
            Guid educatorId,
            string cursor,
            CancellationToken token,
            IProductReadService service,
            int pageSize = 20) =>
        {
            var result = await service.GetEducatorProductsAsync(educatorId, cursor, pageSize, token);
            return Results.Ok(result);
        })
        .WithName("GetEducatorProductsAsync")
        .WithSummary("Retrieve Educator Products")
        .WithDescription("Retrieves a list of products by educator id with cursor-based pagination")
        .RequireAuthorization()
        .Produces<CursorPagedResult<ProductSummaryResponse>>(StatusCodes.Status200OK)
        .AllowAnonymous();

        productGroup.MapGet("my", async (
            CancellationToken token,
            string cursor,
            IProductReadService service,
            int pageSize = 20) =>
        {
            var courses = await service.GetEnrolledProductsAsync(cursor, pageSize, token);
            return Results.Ok(courses);
        })
        .WithName("GetEnrolledProductsAsync")
        .WithSummary("Retrieve Enrolled Products")
        .WithDescription("Retrieves the list of products that the authenticated user is enrolled in using skip and take as pagination parameters.")
        .RequireAuthorization()
        .Produces<CursorPagedResult<ProductSummaryResponse>>(StatusCodes.Status200OK);

        productGroup.MapGet("{productId:long}", async (
            long productId,
            CancellationToken token,
            IProductReadService service) =>
        {
            var course = await service.GetProductDetailsAsync(productId, token);
            return course != null ? Results.Ok(course) : Results.NotFound();
        })
        .WithName("GetProductDetailsAsync")
        .WithSummary("Get Product Details")
        .WithDescription("Retrieves detailed information for a specific product identified by productId. Returns 404 if the product is not found.")
        .Produces<ProductDetailsResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .AllowAnonymous();

        productGroup.MapPost("{productId:long}/purchase-metadata", async (
            long productId,
            ProductPurchaseMetadataRequest request,
            CancellationToken token,
            IProductReadService service) =>
        {
            var result = await service.GetProductPurchaseMetadataAsync(productId, request, token);
            return Results.Ok(result);
        })
        .WithName("GetProductPurchaseMetadataAsync")
        .WithSummary("Get Product Purchase Metadata")
        .WithDescription("Retrieves information about whether a product can be purchased, whether it needs to be scheduled (with additional info for it).")
        .RequireAuthorization()
        .Produces<ProductPurchaseMetadataResponse>(StatusCodes.Status200OK);

        productGroup.MapPost("{productId:long}/scheduling-metadata", async (
            long productId,
            ProductSchedulingMetadataRequest request,
            CancellationToken token,
            IProductReadService service) =>
        {
            var result = await service.GetProductSchedulingMetadataAsync(productId, request, token);
            return Results.Ok(result);
        })
        .WithName("GetProductSchedulingMetadataAsync")
        .WithSummary("Get Product Scheduling Metadata")
        .WithDescription("Retrieves information about whether a product need scheduling and whether can be scheduled.")
        .RequireAuthorization(AuthorizationPolicies.RequireEducatorRole)
        .Produces<ProductSchedulingMetadataResponse>(StatusCodes.Status200OK);

        productGroup.MapPost("", async (
            ProductCreateRequest request,
            CancellationToken token,
            IProductWriteService service) =>
        {
            var result = await service.CreateProductAsync(request, token);
            return Results.Ok(result);
        })
        .WithName("CreateProductAsync")
        .WithSummary("Create New Product")
        .WithDescription("Creates a new product using the provided details. This endpoint requires the Educator role.")
        .RequireAuthorization(AuthorizationPolicies.RequireEducatorRole)
        .Produces<long>(StatusCodes.Status200OK);

        productGroup.MapPut("{productId:long}", async (
            long productId,
            ProductUpdateRequest request,
            CancellationToken token,
            IProductWriteService service) =>
        {
            await service.UpdateProductAsync(productId, request, token);
            return Results.NoContent();
        })
        .WithName("UpdateProductAsync")
        .WithSummary("Update Product")
        .WithDescription("Updates the details of an existing product identified by productId. This operation requires the Educator role.")
        .RequireAuthorization(AuthorizationPolicies.RequireEducatorRole)
        .Produces(StatusCodes.Status204NoContent);

        productGroup.MapDelete("{productId:long}", async (
            long productId,
            CancellationToken token,
            IProductWriteService service) =>
        {
            await service.DeleteProductAsync(productId, token);
            return Results.NoContent();
        })
        .WithName("DeleteProductAsync")
        .WithSummary("Delete Product")
        .WithDescription("Deletes the product identified by productId from the system. Authorization is required for this operation.")
        .RequireAuthorization(AuthorizationPolicies.RequireEducatorRole)
        .Produces(StatusCodes.Status204NoContent);

        productGroup.MapPost("{productId:long}/modules", async (
            long productId,
            ModuleCreateRequest request,
            CancellationToken token,
            IModuleService service) =>
        {
            var result = await service.CreateModuleAsync(productId, request, token);
            return Results.Ok(result);
        })
        .WithName("CreateModuleAsync")
        .WithSummary("Create Module")
        .WithDescription("Creates a new module for the specified product, using the provided module details. Authorization is required.")
        .RequireAuthorization(AuthorizationPolicies.RequireEducatorRole)
        .Produces<long>(StatusCodes.Status200OK);

        productGroup.MapPut("{productId:long}/modules/{moduleId:long}", async (
            long productId,
            long moduleId,
            ModuleUpdateRequest request,
            CancellationToken token,
            IModuleService service) =>
        {
            await service.UpdateModuleAsync(productId, moduleId, request, token);
            return Results.NoContent();
        })
        .WithName("UpdateModuleAsync")
        .WithSummary("Update Module")
        .WithDescription("Updates an existing module's details for the specified product. Authorization is required.")
        .RequireAuthorization(AuthorizationPolicies.RequireEducatorRole)
        .Produces(StatusCodes.Status204NoContent);

        productGroup.MapDelete("{productId:long}/modules/{moduleId:long}", async (
            long productId,
            long moduleId,
            CancellationToken token,
            IModuleService service) =>
        {
            await service.DeleteModuleAsync(productId, moduleId, token);
            return Results.NoContent();
        })
        .WithName("DeleteModuleAsync")
        .WithSummary("Delete Module")
        .WithDescription("Deletes the module identified by moduleId from the given product. Authorization is required.")
        .RequireAuthorization(AuthorizationPolicies.RequireEducatorRole)
        .Produces(StatusCodes.Status204NoContent);

        productGroup.MapPost("{productId:long}/modules/{moduleId:long}/lessons", async (
            long productId,
            long moduleId,
            LessonCreateRequest request,
            CancellationToken token,
            ILessonService service) =>
        {
            var result = await service.CreateLessonAsync(productId, moduleId, request, token);
            return Results.Ok(result);
        })
        .WithName("CreateLessonAsync")
        .WithSummary("Create Lesson")
        .WithDescription("Creates a new lesson within a specific module of the product. Requires Educator role authorization.")
        .RequireAuthorization(AuthorizationPolicies.RequireEducatorRole)
        .Produces<long>(StatusCodes.Status200OK);

        productGroup.MapPut("{productId:long}/modules/{moduleId:long}/lessons/{lessonId:long}", async (
            long productId,
            long moduleId,
            long lessonId,
            LessonUpdateRequest request,
            CancellationToken token,
            ILessonService service) =>
        {
            await service.UpdateLessonAsync(productId, moduleId, lessonId, request, token);
            return Results.Created();
        })
        .WithName("UpdateLessonAsync")
        .WithSummary("Update Lesson")
        .WithDescription("Updates the details of an existing lesson in a module for the specified product. Requires authorization.")
        .RequireAuthorization(AuthorizationPolicies.RequireEducatorRole)
        .Produces(StatusCodes.Status204NoContent);

        productGroup.MapDelete("{productId:long}/modules/{moduleId:long}/lessons/{lessonId:long}", async (
            long productId,
            long moduleId,
            long lessonId,
            CancellationToken token,
            ILessonService service) =>
        {
            await service.DeleteLessonAsync(productId, moduleId, lessonId, token);
            return Results.NoContent();
        })
        .WithName("DeleteLessonAsync")
        .WithSummary("Delete Lesson")
        .WithDescription("Removes the specified lesson from a module within a product. Requires educator authorization.")
        .RequireAuthorization(AuthorizationPolicies.RequireEducatorRole)
        .Produces(StatusCodes.Status204NoContent);
    }
}