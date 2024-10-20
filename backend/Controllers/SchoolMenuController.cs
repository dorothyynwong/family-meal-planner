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
    public async Task<IActionResult> Import(IFormFile pdfFile, IFormFile txtFile, [FromQuery] int familyId)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (pdfFile == null || pdfFile.Length == 0 || txtFile == null || txtFile.Length == 0)
            return BadRequest("No file uploaded.");

        var pdfFilePath = Path.Combine("Uploads", pdfFile.FileName);
        var txtFilePath = Path.Combine("Uploads", txtFile.FileName);

        if (!Directory.Exists("Uploads"))
        {
            Directory.CreateDirectory("Uploads");
        }

        using (var stream = new FileStream(pdfFilePath, FileMode.Create))
        {
            await pdfFile.CopyToAsync(stream);
        }

        using (var stream = new FileStream(txtFilePath, FileMode.Create))
        {
            await txtFile.CopyToAsync(stream);
        }

        string[] lines = System.IO.File.ReadAllLines(txtFilePath);
        List<string> weekCommencings = new List<string>();
        List<int> menuIds = new List<int>();

        foreach (var line in lines)
        {
            string cleanedLine = line.Trim();
            weekCommencings.Add(cleanedLine);
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
            var text = _pdfService.ImportPdf(pdfFilePath);
            List<string> jsonList = new List<string>();
            int i = 0;
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
                        {
                            var menus = await _schoolMenuService.AddSchoolMenu(schoolMenuResponse, weekCommencings[i], familyId, userId);
                            foreach (var menuId in menus)
                                menuIds.Add(menuId);
                        }

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

            return Ok(menuIds);
        }
        catch (Exception ex)
        {
            Logger.Error($"Failed to import school menu: {ex.Message}");
            return BadRequest($"Unable to import school menu: {ex.Message}");
        }
    }

    [HttpGet("{schoolMenuId}")]
    public async Task<IActionResult> GetSchoolMenusById([FromRoute] int schoolMenuId)
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            return Unauthorized();

        var schoolMenus = await _schoolMenuService.GetSchoolMenuById(schoolMenuId);
        var schoolMenuWeeks = await _schoolMenuService.GetWeekCommencingBySchoolMenuId(schoolMenuId);

        List<DateOnly> weekCommencings = new List<DateOnly>();
        foreach (var schoolMenuWeek in schoolMenuWeeks)
        {
            if (schoolMenuWeek.WeekCommercing != null)
                weekCommencings.Add((DateOnly)schoolMenuWeek.WeekCommercing);
        }

        SchoolMenuWeekResponse schoolMenuWeekResponse = new SchoolMenuWeekResponse
        {
            WeekCommencing = weekCommencings,
            SchoolMenuId = schoolMenus.Id,
            Status = schoolMenus.Status,
            FamilyId = schoolMenus.FamilyId,
            UserId = schoolMenus.UserId,
            SchoolMeals = schoolMenus.SchoolMeals.ToList() 
        };

        return Ok(schoolMenuWeekResponse);
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

    [HttpGet("days-of-week")]
    public async Task<IActionResult> GetMealDays()
    {
        return Ok(Enum.GetNames(typeof(DayType)));
    }   

    [HttpPut("meal/{schoolMealId}")]
    public async Task<IActionResult> UpdateSchoolMeal(SchoolMealUpdateRequest schoolMeal, [FromRoute] int schoolMealId)
    {
        await _schoolMenuService.UpdateSchoolMeal(schoolMeal, schoolMealId);

        return Ok();
    }
}
