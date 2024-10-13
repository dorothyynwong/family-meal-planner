using System.Security.Claims;
using System.Text.Json;
using FamilyMealPlanner.Enums;
using FamilyMealPlanner.Models;
using FamilyMealPlanner.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NLog;

namespace FamilyMealPlanner.Controllers;

[ApiController]
[Route("/schoolmenus")]
public class SchoolMenuController(IPdfService pdfService, IOpenAIService aiService) : Controller
{
    private readonly IPdfService _pdfService = pdfService;
    private readonly IOpenAIService _aiService = aiService;
    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

    [HttpGet]
    public async Task<IActionResult> Import([FromQuery] int familyId, int userId)
    {
        var text = _pdfService.ImportPdf("");
        List<string> jsonList = new List<string>();

        foreach (var item in text)
        {
            var result = _aiService.GetModelResponseAsync(item, familyId, userId);
            var json = JsonSerializer.Serialize(result);
            jsonList.Add(json);
            Logger.Debug(item);
        }

        try
        {
            return Ok(jsonList);
        }
        catch (Exception ex)
        {
            Logger.Error($"Failed to add meal: {ex.Message}");
            return BadRequest($"Unable to add meal: {ex.Message}");
        }

    }
}