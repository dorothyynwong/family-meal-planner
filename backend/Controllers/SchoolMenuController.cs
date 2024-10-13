using System.Security.Claims;
using System.Text.Json;
using FamilyMealPlanner.Models;
using FamilyMealPlanner.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NLog;

namespace FamilyMealPlanner.Controllers;

[ApiController]
[Authorize]
[Route("/schoolmenus")]
public class SchoolMenuController(IPdfService pdfService,
                                    IOpenAIService aiService,
                                    IFamilyUserService familyUserService,
                                    IUserService userService
                                 ) : Controller
{
    private readonly IPdfService _pdfService = pdfService;
    private readonly IOpenAIService _aiService = aiService;
    private readonly IFamilyUserService _familyUserService = familyUserService;
    private readonly IUserService _userService = userService;

    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

    [HttpGet]
    public async Task<IActionResult> Import([FromQuery] int familyId)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            return Unauthorized();

        if (_userService.GetUserById(userId) == null)
            return Unauthorized();

        FamilyUser familyUser = await _familyUserService.GetFamilyUser(familyId, userId);
        if (familyUser == null || familyUser.FamilyRole != Enums.FamilyRoleType.Cook)
            return Unauthorized();

        try
        {
            var text = _pdfService.ImportPdf("");
            List<string> jsonList = new List<string>();

            foreach (var item in text)
            {
                var result = await _aiService.GetModelResponseAsync(item, familyId, userId);
                var json = JsonSerializer.Serialize(result);
                jsonList.Add(json);
            }

            return Ok(jsonList);
        }
        catch (Exception ex)
        {
            Logger.Error($"Failed to import school menu: {ex.Message}");
            return BadRequest($"Unable to import school menu: {ex.Message}");
        }
    }
}