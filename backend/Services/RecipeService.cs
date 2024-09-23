
using FamilyMealPlanner.Models;


namespace FamilyMealPlanner.Services;

public interface IRecipeService
{
        Task AddRecipe(RecipeRequest recipeRequest);
}

public class RecipeService(FamilyMealPlannerContext context) : IRecipeService
{
    private readonly FamilyMealPlannerContext _context = context;

    public async Task AddRecipe(RecipeRequest recipeRequest)
    {
        Recipe recipe = new Recipe()
        {
            Name = recipeRequest.Name,
            Notes = recipeRequest.Notes,
            Images = recipeRequest.Images,
            Description = recipeRequest.Description,
            RecipeIngredients = recipeRequest.RecipeIngredients,
            RecipeInstructions = recipeRequest.RecipeInstructions,
        };

        await _context.Recipes.AddAsync(recipe);
        await _context.SaveChangesAsync();
    }

}



