using Learning.Features.Categories.Entities;
using Learning.Features.Enrollments.Entities;
using Learning.Features.Products.Entities;
using Learning.Features.Profiles.Entities;
using Learning.Shared.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Learning.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Enrollment> Enrollments { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<SubCategory> SubCategories { get; set; }
    public DbSet<ProfileSummary> ProfileSummaries { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<PrivateSessionProduct> PrivateSessionProducts { get; set; }
    public DbSet<OnlineCourseProduct> OnlineCourseProducts { get; set; }
    public DbSet<GroupSessionProduct> GroupSessionProducts { get; set; }
    public DbSet<Module> Modules { get; set; }
    public DbSet<Lesson> Lessons { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ProfileSummary>(entity =>
        {
            entity.ToTable("profile_summary");

            entity.HasKey(e => e.UserId);
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(255);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(255);
            entity.Property(e => e.ImageUrl).HasMaxLength(500);
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToTable("category");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired();
            entity.HasIndex(e => e.Name).IsUnique();
        });

        modelBuilder.Entity<SubCategory>(entity =>
        {
            entity.ToTable("sub_category");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired();
            entity.HasOne(e => e.Category)
                  .WithMany(c => c.SubCategories)
                  .HasForeignKey(e => e.CategoryId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.Name, e.CategoryId }).IsUnique();
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("product");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.ImageUrl).HasMaxLength(500);
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
            entity.Property(e => e.HasEnrollment).IsRequired();
            entity.HasOne(e => e.SubCategory)
                  .WithMany(s => s.Products)
                  .HasForeignKey(e => e.SubCategoryId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.PrivateSessionProduct)
                  .WithOne().HasForeignKey<PrivateSessionProduct>(p => p.ProductId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.GroupSessionProduct)
                  .WithOne().HasForeignKey<GroupSessionProduct>(p => p.ProductId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.OnlineCourseProduct)
                  .WithOne().HasForeignKey<OnlineCourseProduct>(p => p.ProductId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Product>().HasIndex(p => p.Id)
            .HasDatabaseName("idx_product_not_deleted")
            .HasFilter("deleted_at IS NULL");

        modelBuilder.Entity<Product>().HasIndex(p => p.EducatorId)
            .HasDatabaseName("idx_product_educator_id_not_deleted")
            .HasFilter("deleted_at IS NULL");

        modelBuilder.Entity<Product>().HasIndex(p => p.SubCategoryId)
            .HasDatabaseName("idx_product_sub_category_id_not_deleted")
            .HasFilter("deleted_at IS NULL");

        modelBuilder.Entity<Product>().HasIndex(p => p.Status)
            .HasDatabaseName("idx_product_status_not_deleted")
            .HasFilter("deleted_at IS NULL");

        modelBuilder.Entity<Product>().HasIndex(p => new { p.EducatorId, p.Status })
            .HasDatabaseName("idx_product_educator_status_not_deleted")
            .HasFilter("deleted_at IS NULL");

        modelBuilder.Entity<Product>().HasIndex(p => p.Type)
            .HasDatabaseName("idx_product_type_not_deleted")
            .HasFilter("deleted_at IS NULL");

        modelBuilder.Entity<Product>().HasIndex(p => p.LastScheduledAt)
            .HasDatabaseName("idx_product_last_scheduled_at_not_deleted")
            .HasFilter("deleted_at IS NULL");

        modelBuilder.Entity<PrivateSessionProduct>(entity =>
        {
            entity.ToTable("private_session_product");

            entity.HasKey(e => e.ProductId);
            entity.Property(e => e.DurationMin).IsRequired();
        });

        modelBuilder.Entity<GroupSessionProduct>(entity =>
        {
            entity.ToTable("group_session_product");

            entity.HasKey(e => e.ProductId);
            entity.Property(e => e.DurationMin).IsRequired();
            entity.Property(e => e.MaxParticipants).IsRequired();
        });

        modelBuilder.Entity<OnlineCourseProduct>(entity =>
        {
            entity.ToTable("online_course_product");

            entity.HasKey(e => e.ProductId);
            entity.Property(e => e.MaxParticipants).IsRequired();
            entity.Property(e => e.StartTime);
            entity.Property(e => e.EndTime);
        });

        modelBuilder.Entity<Module>(entity =>
        {
            entity.ToTable("module");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.SortOrder).IsRequired();
            entity.HasOne(e => e.Product)
                  .WithMany(p => p.Modules)
                  .HasForeignKey(e => e.ProductId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Module>().HasIndex(m => new { m.ProductId, m.SortOrder })
            .HasDatabaseName("idx_module_product_id_sort_order_not_deleted")
            .HasFilter("deleted_at IS NULL");

        modelBuilder.Entity<Lesson>(entity =>
        {
            entity.ToTable("lesson");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.SortOrder).IsRequired();
            entity.HasOne(e => e.Module)
                  .WithMany(m => m.Lessons)
                  .HasForeignKey(e => e.ModuleId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Lesson>().HasIndex(l => new { l.ModuleId, l.SortOrder })
            .HasDatabaseName("idx_lesson_module_id_sort_order_not_deleted")
            .HasFilter("deleted_at IS NULL");

        modelBuilder.Entity<Enrollment>(entity =>
        {
            entity.ToTable("enrollment");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Status).IsRequired();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.HasIndex(e => new { e.UserId, e.CreatedAt });
            entity.HasIndex(e => e.ProductId);
        });

        modelBuilder.Entity<Enrollment>().HasIndex(e => new { e.UserId, e.CreatedAt })
            .HasDatabaseName("idx_enrollment_user_id_created_at")
            .IsDescending(true, true);

        modelBuilder.Entity<Enrollment>().HasIndex(e => e.ProductId)
            .HasDatabaseName("idx_enrollment_product_id");
    }

    public override int SaveChanges()
    {
        SetTimeTrackableValues();

        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken token = default)
    {
        SetTimeTrackableValues();

        return base.SaveChangesAsync(token);
    }

    private void SetTimeTrackableValues()
    {
        foreach (var entityEntry in ChangeTracker.Entries()
                        .Where(e => e.Entity is ITimeTrackable)
                        .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified))
        {
            if (entityEntry.Entity is ITimeTrackable trackable)
            {
                var now = DateTime.UtcNow;

                if (entityEntry.State == EntityState.Added)
                {
                    trackable.CreatedAt = now;
                }

                trackable.UpdatedAt = now;
            }
        }
    }
}