using System.Security.Claims;
using System.Text.Json;
using FamilyMealPlanner.Enums;
using FamilyMealPlanner.Models;
using FamilyMealPlanner.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NLog;

namespace FamilyMealPlanner.Controllers;

[Authorize]
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
    public async Task<IActionResult> GetByDateUserId([FromQuery] DateOnly fromDate, DateOnly toDate)
    {
        int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)); 
        
        try
        {
            List<MealResponse> meals = await _mealService.GetMealByDateUserId(fromDate, toDate, userId);
            return Ok(meals);
        }
        catch (Exception ex)
        {
            Logger.Error($"Failed to get meals bewteen {fromDate} to {toDate} for {userId}: {ex.Message}");
            return BadRequest($"Failed to get meals bewteen {fromDate} to {toDate} for {userId}: {ex.Message}");
        }

    }

    [HttpPut("{mealId}")]
    public async Task<IActionResult> Update(MealRequest mealRequest, [FromRoute] int mealId)
    {
        try
        {
            await _mealService.UpdateMeal(mealRequest, mealId);
            return Ok(mealRequest);
        }
        catch (Exception ex)
        {
            string requestJson = JsonSerializer.Serialize(mealRequest, new JsonSerializerOptions { WriteIndented = true });
            Logger.Error($"Failed to update meal {mealId}, {requestJson}: {ex.Message}");
            return BadRequest($"Unable to update meal {mealId}: {ex.Message}");
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

    [HttpGet("mealTypes")]
    public async Task<IActionResult> GetMealTypes()
    {
        return Ok(Enum.GetNames(typeof(MealType)));
    }
}