using Learning.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Learning.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Enrollment> Enrollment { get; set; }
    public DbSet<Session> Session { get; set; }
    public DbSet<SessionOption> SessionOption { get; set; }
}