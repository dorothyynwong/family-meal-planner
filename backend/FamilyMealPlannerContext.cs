using Microsoft.EntityFrameworkCore;
namespace FamilyMealPlanner;

public class FamilyMealPlannerContext : DbContext
{
    protected readonly IConfiguration Configuration;

    public FamilyMealPlannerContext(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        // connect to postgres with connection string from app settings
        options.UseNpgsql(Configuration.GetConnectionString("Postgres"));
    }
}