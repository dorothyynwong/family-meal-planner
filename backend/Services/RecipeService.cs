using FamilyMealPlanner.Models;
using Microsoft.EntityFrameworkCore;
using NLog;


namespace FamilyMealPlanner.Services;

public interface IRecipeService
{
    Task<int> AddRecipe(RecipeRequest recipeRequest, int userId);
    Task<Recipe> GetRecipeById(int recipeId, int userId);
    Task<List<RecipeResponse>> GetRecipeByUserId(int userId);
    Task<IEnumerable<RecipeResponse>> SearchRecipe(RecipeSearchRequest recipeSearchRequest, int requestUserId);
    Task<int> Count(int userId);
    Task UpdateRecipe(RecipeRequest recipeRequest, int recipeId, int userId);
    Task Delete(int recipeId, int userId);
}

public class RecipeService(FamilyMealPlannerContext context, IFamilyUserService familyUserService, IFamilyService familyService) : IRecipeService
{
    private readonly FamilyMealPlannerContext _context = context;
    private readonly IFamilyUserService _familyUserService = familyUserService;
    private readonly IFamilyService _familyService = familyService;
    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

    private void ValidateRequest(RecipeRequest recipeRequest, int userId)
    {
        if (recipeRequest == null || userId <= 0)
        {
            throw new ArgumentNullException(nameof(recipeRequest), "Request cannot be null");
        }

        if (string.IsNullOrWhiteSpace(recipeRequest.Name))
            throw new ArgumentException("Name cannot be empty");

    }

    public async Task<int> AddRecipe(RecipeRequest recipeRequest, int userId)
    {
        ValidateRequest(recipeRequest, userId);
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
                CreationDateTime = DateTime.UtcNow,
                DefaultImageUrl = recipeRequest.DefaultImageUrl,
                AddedByUserId = userId
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

    public async Task<Recipe> GetRecipeById(int recipeId, int userId)
    {
        Recipe recipe = await _context.Recipes.SingleAsync(recipe => recipe.Id == recipeId);

        if (recipe == null)
        {
            Logger.Error($"Recipe not found {recipeId}");
            throw new InvalidOperationException($"Recipe with id {recipeId} is not found.");
        }

        if (recipe.AddedByUserId != userId && !await _familyUserService.IsSameFamily(recipe.AddedByUserId, userId))
        {
            Logger.Error($"Unauthroised access of user {userId} to recipe {recipeId}");
            throw new UnauthorizedAccessException($"Unauthroised access of user {userId} to recipe {recipeId}");
        }

        return recipe;
    }

    public async Task<List<RecipeResponse>> GetRecipeByUserId(int userId)
    {
        List<FamilyResponse> familyList = await _familyService.GetFamilyByUserId(userId);
        List<int> familyIds = familyList.Select(family => family.FamilyId).ToList();

        List<RecipeResponse> recipes = await _context.Recipes
                                                .Include(recipe => recipe.AddedByUser)
                                                    .ThenInclude(user => user.FamilyUsers)
                                                .Where(recipe =>
                                                    recipe.AddedByUserId == userId ||
                                                    recipe.AddedByUser.FamilyUsers.Any(fu => familyIds.Contains(fu.FamilyId))
                                                )
                                                .Select(
                                                    recipe => new RecipeResponse
                                                    {
                                                        Id = recipe.Id,
                                                        Name = recipe.Name,
                                                        Notes = recipe.Notes,
                                                        Images = recipe.Images,
                                                        Description = recipe.Description,
                                                        DefaultImageUrl = recipe.DefaultImageUrl,
                                                        RecipeIngredients = recipe.RecipeIngredients,
                                                        RecipeInstructions = recipe.RecipeInstructions,
                                                        CreationDateTime = recipe.CreationDateTime,
                                                        LastUpdatedDateTime = recipe.LastUpdatedDateTime,
                                                        AddedByUserId = recipe.AddedByUserId,
                                                        AddedByUserNickname = recipe.AddedByUser.Nickname,
                                                        IsOwner = recipe.AddedByUserId == userId,
                                                    }
                                                )
                                                .ToListAsync();

        if (recipes == null || recipes.Count == 0)
        {
            Logger.Error($"No recipes for {userId}");
            throw new InvalidOperationException($"No recipes for {userId}");
        }

        return recipes;
    }

    public async Task<IEnumerable<RecipeResponse>> SearchRecipe(RecipeSearchRequest search, int requestUserId)
    {
        List<FamilyResponse> familyList = await _familyService.GetFamilyByUserId(requestUserId);
        List<int> familyIds = familyList.Select(family => family.FamilyId).ToList();

        List<RecipeResponse> recipes = await _context.Recipes
                                                .Include(r => r.AddedByUser)
                                                    .ThenInclude(u => u.FamilyUsers)
                                                .Where(r =>
                                                    r.AddedByUserId == requestUserId ||
                                                    r.AddedByUser.FamilyUsers.Any(fu => familyIds.Contains(fu.FamilyId))
                                                )
                                                .Where(r => search.AddedByUserId == null || r.AddedByUserId == search.AddedByUserId)
                                                .Where(r => search.RecipeName == null || r.Name.Contains(search.RecipeName))
                                                .Where(r => search.FamilyId == null || r.AddedByUser.FamilyUsers.Any(fu => fu.FamilyId == search.FamilyId))
                                                .Select(
                                                    recipe => new RecipeResponse
                                                    {
                                                        Id = recipe.Id,
                                                        Name = recipe.Name,
                                                        Notes = recipe.Notes,
                                                        Images = recipe.Images,
                                                        Description = recipe.Description,
                                                        DefaultImageUrl = recipe.DefaultImageUrl,
                                                        RecipeIngredients = recipe.RecipeIngredients,
                                                        RecipeInstructions = recipe.RecipeInstructions,
                                                        CreationDateTime = recipe.CreationDateTime,
                                                        LastUpdatedDateTime = recipe.LastUpdatedDateTime,
                                                        AddedByUserId = recipe.AddedByUserId,
                                                        AddedByUserNickname = recipe.AddedByUser.Nickname,
                                                        IsOwner = recipe.AddedByUserId == requestUserId,
                                                    }
                                                )
                                                .ToListAsync();

        if (recipes == null || recipes.Count == 0)
        {
            Logger.Error($"No recipes for {requestUserId}");
            throw new InvalidOperationException($"No recipes for {requestUserId}");
        }

        IEnumerable<RecipeResponse> filteredAndOrderedRecipes = recipes
                                                        .Skip((search.Page - 1) * search.PageSize)
                                                        .Take(search.PageSize);

        return recipes;
    }

    public async Task<int> Count(int userId)
    {
        List<RecipeResponse> recipes = await GetRecipeByUserId(userId);
        return recipes != null ? recipes.Count() : 0;
    }

    public async Task UpdateRecipe(RecipeRequest recipeRequest, int recipeId, int userId)
    {
        ValidateRequest(recipeRequest, userId);

        try
        {
            Recipe recipe = await GetRecipeById(recipeId, userId);

            recipe.Id = recipeId;
            recipe.Name = recipeRequest.Name;
            recipe.Notes = recipeRequest.Notes;
            recipe.Images = recipeRequest.Images;
            recipe.Description = recipeRequest.Description;
            recipe.RecipeIngredients = recipeRequest.RecipeIngredients;
            recipe.RecipeInstructions = recipeRequest.RecipeInstructions;
            recipe.LastUpdatedDateTime = DateTime.UtcNow;
            recipe.DefaultImageUrl = recipeRequest.DefaultImageUrl;

            _context.Recipes.Update(recipe);
            await _context.SaveChangesAsync();
        }
        catch (UnauthorizedAccessException ex)
        {
            Logger.Error($"{userId} is not authorised to update recipe {recipeId}: {ex.Message}");
            throw new UnauthorizedAccessException($"{userId} is not authorised to update recipe {recipeId}");
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

    public async Task Delete(int recipeId, int userId)
    {
        try
        {
            Recipe recipe = await GetRecipeById(recipeId, userId);
            _context.Recipes.Remove(recipe);
            await _context.SaveChangesAsync();
        }
        catch (UnauthorizedAccessException ex)
        {
            Logger.Error($"{userId} is not authorised to update recipe {recipeId}: {ex.Message}");
            throw new UnauthorizedAccessException($"{userId} is not authorised to update recipe {recipeId}");
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



