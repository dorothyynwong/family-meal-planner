using System.Text.Json;
using FamilyMealPlanner.Enums;
using FamilyMealPlanner.Models;
using FamilyMealPlanner.Models.Data;
using FamilyMealPlanner.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using NLog;
using System.Security.Claims;

namespace FamilyMealPlanner.Controllers;

[Authorize]
[ApiController]
[Route("/families")]
public class FamilyController(IFamilyService familyService, 
                                IEmailService emailService, 
                                IUserService userService,
                                IFamilyUserService familyUserService) : ControllerBase
{
    private readonly IFamilyService _familyService = familyService;
    private readonly IEmailService _emailService = emailService;
    private readonly IUserService _userService = userService;
    private readonly IFamilyUserService _familyUserService = familyUserService;

    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

    [HttpGet("{familyId}")]
    public async Task<IActionResult> GetById([FromRoute] int familyId)
    {
        try
        {
            Family family = await _familyService.GetFamilyById(familyId);

            if (family == null)
            {
                return BadRequest(NotFound());
            }

            FamilyResponse familyResponse = new FamilyResponse
            {
                Id = familyId,
                FamilyName = family.FamilyName,
            };

            return Ok(familyResponse);
        }
        catch (Exception ex)
        {
            Logger.Error($"Failed to get family {familyId}: {ex.Message}");
            return BadRequest($"Unable to get family {familyId}: {ex.Message}");
        }

    }

    [HttpGet]
    public async Task<IActionResult> GetFamilyByUserId([FromQuery] int userId)
    {
        try
        {
            List<FamilyResponse> familyResponses = await _familyService.GetFamilyByUserId(userId);

            return Ok(familyResponses);
        }
        catch (Exception ex)
        {
            Logger.Error($"Failed to get families of {userId}: {ex.Message}");
            return BadRequest($"Unable to get families of {userId}: {ex.Message}");
        }

    }

    [HttpGet("by-code")]
    public async Task<IActionResult> GetFamilyByGuid([FromQuery] Guid guid)
    {
        try
        {
            Family family = await _familyService.GetFamilyByGuid(guid);

            return Ok(family);
        }
        catch (Exception ex)
        {
            Logger.Error($"Failed to get families of {guid}: {ex.Message}");
            return BadRequest($"Unable to get families of {guid}: {ex.Message}");
        }

    }

    [HttpPost]
    public async Task<IActionResult> Add(FamilyRequest familyRequest)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            return Unauthorized();

        try
        {
            int familyId = await _familyService.AddFamilyWithUser(familyRequest, userId);
            return Ok(familyId);
        }
        catch (Exception ex)
        {
            string requestJson = JsonSerializer.Serialize(familyRequest, new JsonSerializerOptions { WriteIndented = true });
            Logger.Error($"Failed to add family, {requestJson}: {ex.Message}");
            return BadRequest($"Unable to add family: {ex.Message}");
        }
    }

    [HttpPut("{familyId}")]
    public async Task<IActionResult> Update(FamilyRequest familyRequest, [FromRoute] int familyId)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            await _familyService.UpdateFamily(familyRequest, familyId);
            return Ok(familyRequest);
        }
        catch (Exception ex)
        {
            string requestJson = JsonSerializer.Serialize(familyRequest, new JsonSerializerOptions { WriteIndented = true });
            Logger.Error($"Failed to update family {familyId}, {requestJson}: {ex.Message}");
            return BadRequest($"Unable to update family {familyId}: {ex.Message}");
        }
    }


    [HttpDelete("{familyId}")]
    public async Task<IActionResult> Delete([FromRoute] int familyId)
    {
        try
        {
            await _familyService.DeleteFamily(familyId);
            return Ok();
        }
        catch (Exception ex)
        {
            Logger.Error($"Failed to get family {familyId}: {ex.Message}");
            return BadRequest($"Unable to get family {familyId}: {ex.Message}");
        }
    }

    [HttpPost("share-code")]
    public async Task<IActionResult> ShareFamilyCode(FamilyShareCodeRequest familyShareCodeRequest)
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            return Unauthorized();

        User user = await _userService.GetUserById(userId);
        Family family = await _familyService.GetFamilyById(familyShareCodeRequest.FamilyId);
        FamilyUser familyUser = await _familyUserService.GetFamilyUser(familyShareCodeRequest.FamilyId, userId);

        if (familyUser == null || familyUser.FamilyRole != FamilyRoleType.Cook)
            return Unauthorized();

        string familyCode = family.FamilyShareCode.ToString();
        string familyName = family.FamilyName;
        string familyLink = $"http://localhost:3000/families/join/{familyCode}";

        string subject = $"Join {familyShareCodeRequest.SenderName}'s family in {familyName} of Family Meal Planner";
        string plainTextContent = $"Please the below link to join: {familyLink}";
        string htmlTextContent = $"Please click <a href=\"{familyLink}\">here</a> to join";
        await _emailService.SendEmailAsync(familyShareCodeRequest.RecipentEmail, familyShareCodeRequest.RecipentName, subject, plainTextContent, htmlTextContent);

        return Ok();
    }
}