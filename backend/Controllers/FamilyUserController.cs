using System.Text.Json;
using FamilyMealPlanner.Models;
using FamilyMealPlanner.Models.Data;
using FamilyMealPlanner.Services;
using Microsoft.AspNetCore.Mvc;
using NLog;

namespace FamilyMealPlanner.Controllers;

[ApiController]
[Route("/familyUsers")]
public class FamilyUserController(IFamilyUserService familyUserService) : Controller
{
    private readonly IFamilyUserService _familyUserService = familyUserService;

    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

    [HttpGet]
    public async Task<IActionResult> GetFamilyUser([FromQuery] int familyId, int userId)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            FamilyUser familyUser = await _familyUserService.GetFamilyUser(familyId, userId);

            return Ok(familyUser);
        }
        catch (Exception ex)
        {
            Logger.Error($"Failed to get family-users of {familyId}: {ex.Message}");
            return BadRequest($"Unable to get family-users of {familyId}: {ex.Message}");
        }

    }

    [HttpGet("by-family")]
    public async Task<IActionResult> GetFamilyUsersByFamilyId([FromQuery] int familyId)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            List<FamilyUserResponse> familyUserResponses = await _familyUserService.GetFamilyUsersByFamilyId(familyId);

            return Ok(familyUserResponses);
        }
        catch (Exception ex)
        {
            Logger.Error($"Failed to get family-users of {familyId}: {ex.Message}");
            return BadRequest($"Unable to get family-users of {familyId}: {ex.Message}");
        }

    }

    [HttpGet("by-user")]
    public async Task<IActionResult> GetFamilyUsersByUserId([FromQuery] int userId)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            List<FamilyUserResponse> familyUserResponses = await _familyUserService.GetFamilyUsersByUserId(userId);

            return Ok(familyUserResponses);
        }
        catch (Exception ex)
        {
            Logger.Error($"Failed to get family-users of {userId}: {ex.Message}");
            return BadRequest($"Unable to get family-users of {userId}: {ex.Message}");
        }

    }

    [HttpPost]
    public async Task<IActionResult> Add(FamilyUserRequest familyUserRequest)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            await _familyUserService.AddFamilyUser(familyUserRequest);

            return Ok(familyUserRequest);
        }
        catch (Exception ex)
        {
            Logger.Error($"Failed to add family user: {ex.Message}");
            return BadRequest($"Unable to add family user: {ex.Message}");
        }

    }

    [HttpPut]
    public async Task<IActionResult> Approve(int familyId, int userId)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            await _familyUserService.ApproveFamilyUser(familyId, userId);

            return Ok();
        }
        catch (Exception ex)
        {
            Logger.Error($"Failed to approve family user with family Id {familyId} and user Id {userId}: {ex.Message}");
            return BadRequest($"Unable to approve family user with family Id {familyId} and user Id {userId}: {ex.Message}");
        }

    }


    [HttpDelete]
    public async Task<IActionResult> Delete([FromQuery] int familyId, int userId)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            await _familyUserService.DeleteFamilyUser(familyId, userId);
            return Ok();
        }
        catch (Exception ex)
        {
            Logger.Error($"Failed to delete family {familyId} and user {userId}: {ex.Message}");
            return BadRequest($"Unable to delete family {familyId} and user {userId}:: {ex.Message}");
        }
    }
}