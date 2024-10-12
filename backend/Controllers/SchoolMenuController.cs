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
[Route("/schoolmenus")]
public class SchoolMenuController(IPdfService pdfService, IAIService aiService) : Controller
{
    private readonly IPdfService _pdfService = pdfService;
    private readonly IAIService _aiService = aiService;
    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

    [HttpGet]
    public async Task<IActionResult> Import()
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            return Unauthorized();

        // var text = _pdfService.ImportPdf("");
        string text = "Monday: Spaghetti\nTuesday: Pizza\nWednesday: Salad";
        var result = _aiService.GetModelResponseAsync(text);
        var json = System.Text.Json.JsonSerializer.Serialize(result); 

        try
        {
            return Ok(json);
        }
        catch (Exception ex)
        {
            Logger.Error($"Failed to add meal: {ex.Message}");
            return BadRequest($"Unable to add meal: {ex.Message}");
        }

    }
}