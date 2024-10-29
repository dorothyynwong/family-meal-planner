using FamilyMealPlanner;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
public class FamilyMealPlannerContextFactory : IDesignTimeDbContextFactory<FamilyMealPlannerContext>
{
    public FamilyMealPlannerContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<FamilyMealPlannerContext>();
        var configuration = new ConfigurationBuilder()
                            .AddEnvironmentVariables() 
                            .Build();
        optionsBuilder.UseNpgsql(configuration["ConnectionStrings_DefaultConnection"]);

        return new FamilyMealPlannerContext(optionsBuilder.Options);
    }
}
