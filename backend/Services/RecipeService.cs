using FamilyMealPlanner.Models;
using Microsoft.EntityFrameworkCore;
using NLog;


namespace FamilyMealPlanner.Services;

public interface IRecipeService
{
    Task<int> AddRecipe(RecipeRequest recipeRequest);
    Task<Recipe> GetRecipeById(int recipeId);
    Task<List<Recipe>> GetRecipeByUserId(int userId);
    Task UpdateRecipe(RecipeRequest recipeRequest, int recipeId);
    Task Delete(int recipeId);
}

public class RecipeService(FamilyMealPlannerContext context) : IRecipeService
{
    private readonly FamilyMealPlannerContext _context = context;
    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

    public async Task<int> AddRecipe(RecipeRequest recipeRequest)
    {

        try
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

            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();
            return recipe.Id;
        }
        catch (DbUpdateException ex)
        {
            Logger.Error($"Database error: {ex.Message}");
            throw new Exception("An error occurred while updating the database.", ex);
        }
        catch (Exception ex)
        {
            Logger.Error($"Unexpected error: {ex.Message}");
            throw new Exception("Unexpected error while adding record to database", ex);
        }

    }

    public async Task<Recipe> GetRecipeById(int recipeId)
    {
        Recipe recipe = await _context.Recipes.SingleAsync(recipe => recipe.Id == recipeId);
        if (recipe == null)
        {
            Logger.Error($"Recipe not found {recipeId}");
            throw new InvalidOperationException($"Recipe with id {recipeId} is not found.");
        }
        return recipe;
    }

    public async Task<List<Recipe>> GetRecipeByUserId(int userId)
    {
        List<Recipe> recipes =  await _context.Recipes
                                                .Where(recipe => recipe.Id != 0)
                                                .ToListAsync();
        if (recipes == null || recipes.Count == 0)
        {
            Logger.Error($"No recipes for {userId}");
            throw new InvalidOperationException($"No recipes for {userId}");
        }

        return recipes;
    }

    public async Task UpdateRecipe(RecipeRequest recipeRequest, int recipeId)
    {
        try
        {
            Recipe recipe = await GetRecipeById(recipeId);

            recipe.Id = recipeId;
            recipe.Name = recipeRequest.Name;
            recipe.Notes = recipeRequest.Notes;
            recipe.Images = recipeRequest.Images;
            recipe.Description = recipeRequest.Description;
            recipe.RecipeIngredients = recipeRequest.RecipeIngredients;
            recipe.RecipeInstructions = recipeRequest.RecipeInstructions;

            _context.Recipes.Update(recipe);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            Logger.Error($"Database error on recipeId {recipeId}: {ex.Message}");
            throw new Exception("An error occurred while updating the database.", ex);
        }
        catch (Exception ex)
        {
            Logger.Error($"Unexpected error on recipeId {recipeId}: {ex.Message}");
            throw new Exception("Unexpected error while updating record to database", ex);
        }
    }

    public async Task Delete(int recipeId)
    {
        try
        {
            Recipe recipe = await GetRecipeById(recipeId);
            _context.Recipes.Remove(recipe);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            Logger.Error($"Database error on recipeId {recipeId}: {ex.Message}");
            throw new Exception("An error occurred while updating the database.", ex);
        }
        catch (Exception ex)
        {
            Logger.Error($"Unexpected error on recipeId {recipeId}: {ex.Message}");
            throw new Exception("Unexpected error while deleting record to database", ex);
        }
    }

}



