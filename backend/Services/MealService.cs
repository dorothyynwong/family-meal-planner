using FamilyMealPlanner.Models;
using Microsoft.EntityFrameworkCore;
using NLog;


namespace FamilyMealPlanner.Services;

public interface IMealService
{
    Task<int> AddMeal(MealRequest mealRequest);
    Task<List<MealResponse>> GetMealByDateUserId(DateOnly fromDate, DateOnly toDate, int userId);
    Task Delete(int mealId);
}

public class MealService(FamilyMealPlannerContext context) : IMealService
{
    private readonly FamilyMealPlannerContext _context = context;
    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

    public async Task<int> AddMeal(MealRequest mealRequest)
    {

        try
        {
            Meal meal = new Meal()
            {
                Date = mealRequest.Date,
                Name = mealRequest.Name,
                RecipeId = mealRequest.RecipeId,
                UserId = mealRequest.UserId,
                FamilyId = mealRequest.FamilyId,
                MealType = mealRequest.MealType,
                AddedByUserId = mealRequest.AddedByUserId
            };

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
        List<Meal> meals =  await _context.Meals
                                                .Where(meal => meal.Date >= fromDate && 
                                                        meal.Date <= toDate &&
                                                        meal.UserId == userId)
                                                .ToListAsync();
        List<MealResponse> mealResponses = new ();

        foreach(Meal meal in meals) 
        {
            MealResponse mealResponse = new MealResponse{
                Id = meal.Id,
                Date = meal.Date,
                Name = meal.Name,
                RecipeId = meal.RecipeId,
                UserId = meal.UserId,
                FamilyId = meal.FamilyId,
                MealType = meal.MealType.ToString(),
                AddedByUserId = meal.AddedByUserId
            };
            mealResponses.Add(mealResponse);
        }

        if (meals== null || meals.Count == 0)
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

    public async Task Delete(int mealId)
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


