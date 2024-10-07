using System.Text.Json;
using FamilyMealPlanner.Models;
using FamilyMealPlanner.Models.Data;
using FamilyMealPlanner.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NLog;

namespace FamilyMealPlanner.Controllers;

[Authorize]
[ApiController]
[Route("/users")]
public class UserController(IUserService userService) : Controller
{
    private readonly IUserService _userService = userService;

    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetById([FromRoute] int userId)
    {
        try
        {
            User user = await _userService.GetUserById(userId);

            if (user == null)
            {
                return BadRequest(NotFound());
            }

            UserResponse userResponse = new UserResponse
            {
                Id = userId,
                UserName = user.UserName,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName
            };

            return Ok(userResponse);
        }
        catch (Exception ex)
        {
            Logger.Error($"Failed to get user {userId}: {ex.Message}");
            return BadRequest($"Unable to get user {userId}: {ex.Message}");
        }

    }

    [HttpGet]
    public async Task<IActionResult> GetUserByFamilyId([FromQuery] int familyId)
    {
        try
        {
            List<UserResponse> userResponses = await _userService.GetUserByFamilyId(familyId);
            
            return Ok(userResponses);
        }
        catch (Exception ex)
        {
            Logger.Error($"Failed to get users of {familyId}: {ex.Message}");
            return BadRequest($"Unable to get users of {familyId}: {ex.Message}");
        }

    }

    [HttpPut("{userId}")]
    public async Task<IActionResult> Update(UserUpdateRequest userRequest, [FromRoute] int userId)
    {
        if(!ModelState.IsValid) 
        {
            return BadRequest(ModelState);
        }

        try
        {
            await _userService.UpdateUser(userRequest, userId);
            return Ok(userRequest);
        }
        catch (Exception ex)
        {
            string requestJson = JsonSerializer.Serialize(userRequest, new JsonSerializerOptions { WriteIndented = true });
            Logger.Error($"Failed to update user {userId}, {requestJson}: {ex.Message}");
            return BadRequest($"Unable to update user {userId}: {ex.Message}");
        }
    }


    [HttpDelete("{userId}")]
    public async Task<IActionResult> Delete([FromRoute] int userId)
    {
        try
        {
            await _userService.DeleteUser(userId);
            return Ok();
        }
        catch (Exception ex)
        {
            Logger.Error($"Failed to get user {userId}: {ex.Message}");
            return BadRequest($"Unable to get user {userId}: {ex.Message}");
        }
    }
}