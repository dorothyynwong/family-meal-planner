using FamilyMealPlanner.Models;
using FamilyMealPlanner.Services;
using Microsoft.AspNetCore.Mvc;
using NLog;

namespace FamilyMealPlanner.Controllers;

[ApiController]
[Route("/meals")]
public class MealController(IMealService mealService) : Controller
{
    private readonly IMealService _mealService = mealService;
    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

    [HttpPost("")]
    public async Task<IActionResult> Add(MealRequest meal)
    {
        try
        {
            int mealId = await _mealService.AddMeal(meal);
            return Ok(mealId);
        }
        catch (Exception ex)
        {
            Logger.Error($"Failed to add meal: {ex.Message}");
            return BadRequest($"Unable to add meal: {ex.Message}");
        }

    }

    [HttpGet]
    public async Task<IActionResult> GetByDateUserId([FromQuery] DateOnly date, int userId)
    {
        try
        {
            List<MealResponse> meals = await _mealService.GetMealByDateUserId(date, userId);
            return Ok(meals);
        }
        catch (Exception ex)
        {
            Logger.Error($"Failed to get meals of {date} for {userId}: {ex.Message}");
            return BadRequest($"Unable to meals of {date} for {userId}: {ex.Message}");
        }

    }

    [HttpDelete("{mealId}")]
    public async Task<IActionResult> Delete([FromRoute] int mealId)
    {
        try
        {
            await _mealService.Delete(mealId);
            return Ok();
        }
        catch (Exception ex)
        {
            Logger.Error($"Failed to get meal {mealId}: {ex.Message}");
            return BadRequest($"Unable to get meal {mealId}: {ex.Message}");
        }
    }
}