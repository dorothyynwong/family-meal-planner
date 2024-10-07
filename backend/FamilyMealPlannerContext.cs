using FamilyMealPlanner.Enums;
using FamilyMealPlanner.Models;
using FamilyMealPlanner.Models.Data;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
namespace FamilyMealPlanner;

public class FamilyMealPlannerContext(DbContextOptions<FamilyMealPlannerContext> options)
    : IdentityDbContext<User, Role, int>(options)
{
    public DbSet<Recipe> Recipes { get; set; }
    public DbSet<Family> Families { get; set; }
    public DbSet<Meal> Meals { get; set; }
    public DbSet<FamilyUser> FamilyUsers { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        var userRole = new Role
        {
            Id = (int)RoleType.User,
            Name = RoleType.User.ToString(),
            NormalizedName = RoleType.User.ToString().ToUpper(),
        };
        var adminRole = new Role
        {
            Id = (int)RoleType.Admin,
            Name = RoleType.Admin.ToString(),
            NormalizedName = RoleType.Admin.ToString().ToUpper(),
        };
        builder.Entity<Role>().HasData(userRole, adminRole);

        builder.Entity<Family>()
                .HasIndex(f => f.FamilyShareCode)
                .HasDatabaseName("IX_FamilyShareCode_Ascending");

        builder.Entity<FamilyUser>()
                .HasKey(fu => new { fu.UserId, fu.FamilyId });

        builder.Entity<FamilyUser>()
                .HasOne(fu => fu.User)
                .WithMany(u => u.FamilyUsers)
                .HasForeignKey(fu => fu.UserId);

        builder.Entity<FamilyUser>()
            .HasOne(fu => fu.Family)
            .WithMany(f => f.FamilyUsers)
            .HasForeignKey(fu => fu.FamilyId);

    }
}