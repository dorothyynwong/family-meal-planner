using System.Diagnostics;
using FamilyMealPlanner.Models;
using Microsoft.EntityFrameworkCore;
using NLog;


namespace FamilyMealPlanner.Services;

public interface IMealService
{
    Task<int> AddMeal(MealRequest mealRequest, int userId);
    Task<List<MealResponse>> GetMealByDateUserId(DateOnly fromDate, DateOnly toDate, int familyId, int userId, int requestUserId);
    Task<List<MealResponse>> GetMealByDateFamilyId(DateOnly fromDate, DateOnly toDate, int familyId, int requestUserId);
    Task UpdateMeal(MealRequest mealRequest, int mealId, int userId);
    Task Delete(int mealId, int userId);
    Task<Meal> GetMealById(int mealId);
}

public class MealService(FamilyMealPlannerContext context, IFamilyUserService familyUserService) : IMealService
{
    private readonly FamilyMealPlannerContext _context = context;
    private readonly IFamilyUserService _familyUserService = familyUserService;
    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

    private void ValidateRequest(MealRequest mealRequest)
    {
        if (mealRequest == null)
        {
            throw new ArgumentNullException(nameof(mealRequest), "Request cannot be null");
        }

        if (mealRequest.Date == default || string.IsNullOrEmpty(mealRequest.MealType) || mealRequest.AddedByUserId <= 0)
        {
            throw new ArgumentException($"Meal Date , Meal Type and AddedByUserId are required, {mealRequest.Date}, {mealRequest.MealType}, {mealRequest.AddedByUserId} are given");
        }
    }

    public async Task<int> AddMeal(MealRequest mealRequest, int userId)
    {
        ValidateRequest(mealRequest);

        if (mealRequest.FamilyId > 0 && !await _familyUserService.IsCook((int)mealRequest.FamilyId, userId))
        {
            Logger.Error($"Unauthorised access of family {mealRequest.FamilyId} by {userId}");
            throw new UnauthorizedAccessException($"Unauthorised access of family {mealRequest.FamilyId} by {userId}");
        }

        try
        {
            Meal meal = new Meal();
            meal.Date = mealRequest.Date;
            meal.RecipeId = mealRequest.RecipeId;

            if (mealRequest.FamilyId > 0)
            {
                meal.FamilyId = mealRequest.FamilyId;
            }
            else
            {
                meal.UserId = userId;
            }

            meal.MealType = mealRequest.GetMealTypeEnum();
            meal.AddedByUserId = userId;
            meal.Notes = mealRequest.Notes;

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

    public async Task<List<MealResponse>> GetMealByDateUserId(DateOnly fromDate, DateOnly toDate, int familyId, int userId, int requestUserId)
    {
        if (requestUserId != userId && !await _familyUserService.IsCook(familyId, requestUserId))
        {
            Logger.Error($"Unauthorised Access for user {userId} by user {requestUserId}");
            throw new UnauthorizedAccessException("Unathorised Access");
        }

        try
        {
            List<Meal> meals = await _context.Meals
                                                    .Include(meal => meal.Recipe)
                                                    .Where(meal => meal.Date >= fromDate &&
                                                            meal.Date <= toDate &&
                                                            meal.UserId == userId)
                                                    .ToListAsync();

            if (meals == null || meals.Count <= 0) return [];

            List<MealResponse> mealResponses = new();

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
                throw new ArgumentNullException($"No meals between {fromDate} to {toDate} for user {userId}");
            }

            return mealResponses;
        }
        catch (Exception ex)
        {
            Logger.Error($"Error while getting meals from database from {fromDate} to {toDate} for user {userId}, {ex}");
            throw new Exception($"Error while getting meals from database");
        }
    }
    public async Task<List<MealResponse>> GetMealByDateFamilyId(DateOnly fromDate, DateOnly toDate, int familyId, int requestUserId)
    {
        if (!await _familyUserService.IsCook(familyId, requestUserId))
        {
            Logger.Error($"Unauthorised Access for family {familyId} by user {requestUserId}");
            throw new UnauthorizedAccessException("Unathorised Access");
        }

        try
        {
            List<Meal> meals = await _context.Meals
                                                    .Include(meal => meal.Recipe)
                                                    .Where(meal => meal.Date >= fromDate &&
                                                            meal.Date <= toDate &&
                                                            meal.FamilyId == familyId)
                                                    .ToListAsync();

            if (meals == null || meals.Count <= 0) return [];

            List<MealResponse> mealResponses = new();

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
                Logger.Error($"No meals between {fromDate} to {toDate} for family {familyId}");
                throw new ArgumentNullException($"No meals between {fromDate} to {toDate} for family {familyId}");
            }

            return mealResponses;
        }
        catch (Exception ex)
        {
            Logger.Error($"Error while getting meals from database from {fromDate} to {toDate} for family {familyId}, {ex}");
            throw new Exception($"Error while getting meals from database");
        }
    }
    public async Task<Meal> GetMealById(int mealId)
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
            meal.RecipeId = mealRequest.RecipeId != null ? mealRequest.RecipeId : meal.RecipeId;
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



