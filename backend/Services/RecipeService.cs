
using System.Linq;
using FamilyMealPlanner.Models;
using Microsoft.EntityFrameworkCore;


namespace FamilyMealPlanner.Services;

public interface IRecipeService
{
    Task AddRecipe(RecipeRequest recipeRequest);
    Task<Recipe> GetRecipeById(int recipeId);
    Task UpdateRecipe(RecipeRequest recipeRequest, int recipeId);
    Task Delete(int recipeId);
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

        _context.Recipes.Add(recipe);
        await _context.SaveChangesAsync();
    }

    public async Task<Recipe> GetRecipeById(int recipeId)
    {
        Recipe recipe = await _context.Recipes.SingleAsync(recipe => recipe.Id == recipeId);
        return recipe;
    }

    public async Task UpdateRecipe(RecipeRequest recipeRequest, int recipeId)
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

    public async Task Delete(int recipeId)
    {
        Recipe recipe = await _context.Recipes.SingleAsync(recipe => recipe.Id == recipeId);
        _context.Recipes.Remove(recipe);
        await _context.SaveChangesAsync();
    }

}



