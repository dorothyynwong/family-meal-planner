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
                                    IUserService userService,
                                    ISchoolMenuService schoolMenuService
                                 ) : Controller
{
    private readonly IPdfService _pdfService = pdfService;
    private readonly IOpenAIService _aiService = aiService;
    private readonly IFamilyUserService _familyUserService = familyUserService;
    private readonly IUserService _userService = userService;
    private readonly ISchoolMenuService _schoolMenuService = schoolMenuService;

    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

    [HttpPost("import")]
    public async Task<IActionResult> Import(IFormFile file, [FromQuery] int familyId)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        var filePath = Path.Combine("Uploads", file.FileName);

        if (!Directory.Exists("Uploads"))
        {
            Directory.CreateDirectory("Uploads");
        }

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            return Unauthorized();

        if (await _userService.GetUserById(userId) == null)
            return Unauthorized();

        FamilyUser familyUser = await _familyUserService.GetFamilyUser(familyId, userId);
        if (familyUser == null || familyUser.FamilyRole != Enums.FamilyRoleType.Cook)
            return Unauthorized();

        try
        {
            var text = _pdfService.ImportPdf(filePath);
            List<string> jsonList = new List<string>();
            int i = 0;
            List<string> weekCommencings = new List<string>();
            string weekCommencing = "2024-09-02, 2024-09-23, 2024-10-14, 2024-11-04, 2024-11-25, 2024-12-16, 2025-01-06, 2025-01-27, 2025-02-17, 2025-03-10, 2025-03-31";
            weekCommencings.Add(weekCommencing);

            weekCommencing = "2024-09-09, 2024-09-30, 2024-10-21, 2024-11-11, 2024-12-02, 2025-01-13, 2025-02-03, 2025-02-24, 2025-03-17";
            weekCommencings.Add(weekCommencing);

            weekCommencing = "2024-08-26, 2024-09-16, 2024-10-07, 2024-10-28, 2024-11-18, 2024-12-09, 2024-12-30, 2025-01-20, 2025-02-10, 2025-03-03, 2025-03-24";
            weekCommencings.Add(weekCommencing);

            foreach (var item in text)
            {
                var openAIResponse = await _aiService.GetModelResponseAsync(item, familyId, userId);

                foreach (var choice in openAIResponse.Choices)
                {
                    var nestedJson = choice.Message.Content;
                    nestedJson = nestedJson.Replace("```json\n", "").Replace("\n```", "").Replace("\\n", "").Replace("\\\"", "\"");
                    try
                    {
                        var schoolMenuResponse = JsonSerializer.Deserialize<SchoolMenuResponse>(nestedJson);
                        if (schoolMenuResponse != null)
                            await _schoolMenuService.AddSchoolMenu(schoolMenuResponse, weekCommencings[i], familyId, userId);
                    }
                    catch (Exception ex)
                    {
                        Logger.Error($"Error parsing JSON content: {ex.Message}");
                    }

                }
                var json = JsonSerializer.Serialize(openAIResponse);
                jsonList.Add(json);
                i++;
            }

            // return Ok(jsonList);
            return Ok(text);
        }
        catch (Exception ex)
        {
            Logger.Error($"Failed to import school menu: {ex.Message}");
            return BadRequest($"Unable to import school menu: {ex.Message}");
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetSchoolMenus([FromQuery] int familyId)
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            return Unauthorized();

        var schoolMenus = await _schoolMenuService.GetSchoolMenus(familyId, userId);

        return Ok(schoolMenus);
    }

    [HttpGet("weekmenu-by-date")]
    public async Task<IActionResult> GetSchoolMenusByDate([FromQuery] int familyId, DateOnly menuDate)
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            return Unauthorized();

        var schoolMenus = await _schoolMenuService.GetSchoolWeekMenuByDate(familyId, userId, menuDate);
        return Ok(schoolMenus);
    }

    [HttpGet("meals-by-date")]
    public async Task<IActionResult> GetSchoolMealsByDate([FromQuery] int familyId, DateOnly menuDate)
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            return Unauthorized();

        var schoolMenus = await _schoolMenuService.GetSchoolMealsByDate(familyId, userId, menuDate);
        return Ok(schoolMenus);
    }
}