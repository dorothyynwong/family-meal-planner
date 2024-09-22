using FamilyMealPlanner.Enums;
using FamilyMealPlanner.Models.Data;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
namespace FamilyMealPlanner;

public class FamilyMealPlannerContext(DbContextOptions<FamilyMealPlannerContext> options)
    : IdentityDbContext<User, Role, int>(options)
{

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

    }
}