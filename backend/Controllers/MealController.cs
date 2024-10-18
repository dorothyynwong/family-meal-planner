using System.Security.Claims;
using System.Text.Json;
using FamilyMealPlanner.Enums;
using FamilyMealPlanner.Models;
using FamilyMealPlanner.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using NLog;

namespace FamilyMealPlanner.Controllers;

[Authorize]
[ApiController]
[Route("/meals")]
public class MealController(IMealService mealService, IFamilyUserService familyUserService) : Controller
{
    private readonly IMealService _mealService = mealService;
    private readonly IFamilyUserService _familyUserService = familyUserService;
    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

    [HttpPost("")]
    public async Task<IActionResult> Add(MealRequest meal)
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            return Unauthorized();

        try
        {
            meal.AddedByUserId = userId;
            int mealId = await _mealService.AddMeal(meal, userId);
            return Ok(mealId);
        }
        catch (Exception ex)
        {
            Logger.Error($"Failed to add meal: {ex.Message}");
            return BadRequest($"Unable to add meal: {ex.Message}");
        }

    }

    [HttpGet]
    public async Task<IActionResult> GetByDateUserId([FromQuery] DateOnly fromDate, DateOnly toDate, int familyId, int userId)
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int requestUserId))
            return Unauthorized();
            
        if (userId == 0) userId = requestUserId;

        Logger.Debug($"Meal Controller {familyId}, {userId}, {requestUserId}");

        try
        {
            List<MealResponse> meals = await _mealService.GetMealByDateUserId(fromDate, toDate, familyId, userId, requestUserId);

            if (meals == null || meals.Count <= 0) return NoContent();  
            return Ok(meals);
        }
        catch (UnauthorizedAccessException ex)
        {
            Logger.Error($"Unauthorised Access for user {userId} by user {requestUserId}");
            return Unauthorized();
        }
        catch (ArgumentNullException ex)
        {
            Logger.Info($"No meals bewteen {fromDate} to {toDate} for {userId}: {ex.Message}");
            return NoContent(); 
            
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
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            return Unauthorized();

        try
        {
            await _mealService.UpdateMeal(mealRequest, mealId, userId);
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
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            return Unauthorized();

        try
        {
            await _mealService.Delete(mealId, userId);
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