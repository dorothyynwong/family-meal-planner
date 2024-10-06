using System.Text.Json;
using FamilyMealPlanner.Enums;
using FamilyMealPlanner.Models;
using FamilyMealPlanner.Models.Data;
using FamilyMealPlanner.Services;
using Microsoft.AspNetCore.Mvc;
using NLog;

namespace FamilyMealPlanner.Controllers;

[ApiController]
[Route("/families")]
public class FamilyController(IFamilyService familyService, IFamilyUserService familyUserService) : Controller
{
    private readonly IFamilyService _familyService = familyService;
    private readonly IFamilyUserService _familyUserSerivce = familyUserService;

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

    [HttpPost]
    public async Task<IActionResult> Add(FamilyRequest familyRequest, [FromRoute] int userId)
    {
        if(!ModelState.IsValid) 
        {
            return BadRequest(ModelState);
        }

        try
        {
            int familyId = await _familyService.AddFamily(familyRequest);
            FamilyUserRequest familyUserRequest = new FamilyUserRequest
            {
                FamilyId = familyId,
                UserId = userId,
                FamilyRole = FamilyRoleType.Cook,
                IsApproved = true
            };
            await _familyUserSerivce.AddFamilyUser(familyUserRequest);
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
        if(!ModelState.IsValid) 
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
}