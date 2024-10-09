using System.Diagnostics;
using FamilyMealPlanner.Models;
using Microsoft.EntityFrameworkCore;
using NLog;


namespace FamilyMealPlanner.Services;

public interface IMealService
{
    Task<int> AddMeal(MealRequest mealRequest, int userId);
    Task<List<MealResponse>> GetMealByDateUserId(DateOnly fromDate, DateOnly toDate, int userId);
    Task UpdateMeal(MealRequest mealRequest, int mealId, int userId);
    Task Delete(int mealId, int userId);
}

public class MealService(FamilyMealPlannerContext context) : IMealService
{
    private readonly FamilyMealPlannerContext _context = context;
    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

    public async Task<int> AddMeal(MealRequest mealRequest, int userId)
    {
        try
        {
            Meal meal = new Meal()
            {
                Date = mealRequest.Date,
                RecipeId = mealRequest.RecipeId,
                UserId = userId,
                FamilyId = mealRequest.FamilyId,
                MealType = mealRequest.GetMealTypeEnum(),
                AddedByUserId = userId,
                Notes = mealRequest.Notes,
            };

            Logger.Debug(userId);

            _context.Meals.Add(meal);
            await _context.SaveChangesAsync();
            return meal.Id;
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

    public async Task<List<MealResponse>> GetMealByDateUserId(DateOnly fromDate, DateOnly toDate, int userId)
    {
        List<Meal> meals = await _context.Meals
                                                .Include(meal => meal.Recipe)
                                                .Where(meal => meal.Date >= fromDate &&
                                                        meal.Date <= toDate &&
                                                        meal.UserId == userId)
                                                .ToListAsync();
        List<MealResponse> mealResponses = new();

        Logger.Debug(meals[0].Recipe.DefaultImageUrl);

        foreach (Meal meal in meals)
        {
            MealResponse mealResponse = new MealResponse
            {
                Id = meal.Id,
                Date = meal.Date,
                RecipeId = meal.RecipeId,
                RecipeName = meal.Recipe != null ? meal.Recipe.Name : "",
                RecipeDefaultImage = meal.Recipe != null ? meal.Recipe.DefaultImageUrl : "",
                UserId = meal.UserId,
                FamilyId = meal.FamilyId,
                MealType = meal.MealType.ToString(),
                AddedByUserId = meal.AddedByUserId,
                Notes = meal.Notes,
            };
            mealResponses.Add(mealResponse);
        }

        if (meals == null || meals.Count == 0)
        {
            Logger.Error($"No meals between {fromDate} to {toDate} for user {userId}");
            throw new InvalidOperationException($"No meals between {fromDate} to {toDate} for user {userId}");
        }

        return mealResponses;
    }

    private async Task<Meal> GetMealById(int mealId)
    {
        Meal meal = await _context.Meals.SingleAsync(meal => meal.Id == mealId);
        return meal;
    }

    public async Task UpdateMeal(MealRequest mealRequest, int mealId, int userId)
    {
        try
        {
            Meal meal = await GetMealById(mealId);

            meal.Date = mealRequest.Date;
            meal.RecipeId = mealRequest.RecipeId != null? mealRequest.RecipeId: meal.RecipeId;
            meal.MealType = mealRequest.GetMealTypeEnum();
            meal.Notes = mealRequest.Notes;

            _context.Meals.Update(meal);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            Logger.Error($"Database error on mealId {mealId}: {ex.Message}");
            throw new Exception("An error occurred while updating the database.", ex);
        }
        catch (Exception ex)
        {
            Logger.Error($"Unexpected error on mealId {mealId}: {ex.Message}");
            throw new Exception("Unexpected error while updating record to database", ex);
        }
    }


    public async Task Delete(int mealId, int userId)
    {
        try
        {
            Meal meal = await GetMealById(mealId);
            _context.Meals.Remove(meal);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            Logger.Error($"Database error on mealId {mealId}: {ex.Message}");
            throw new Exception("An error occurred while updating the database.", ex);
        }
        catch (Exception ex)
        {
            Logger.Error($"Unexpected error on mealId {mealId}: {ex.Message}");
            throw new Exception("Unexpected error while deleting record to database", ex);
        }
    }

}



