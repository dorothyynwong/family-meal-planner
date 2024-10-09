
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FamilyMealPlanner.Enums;
using FamilyMealPlanner.Models;
using FamilyMealPlanner.Models.Data;
using FamilyMealPlanner.Models.Request;
using FamilyMealPlanner.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NLog;

namespace FamilyMealPlanner.Controllers;

[ApiController]
[Route("/auth")]
public class AuthController(UserManager<User> userManager, RoleManager<Role> roleManager, IConfiguration configuration, IAuthenticationService authenticationService)
    : Controller
{
    private readonly UserManager<User> _userManager = userManager;
    private readonly RoleManager<Role> _roleManager = roleManager;
    private readonly IAuthenticationService _authenticationService = authenticationService;


    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginRequest loginRequest)
    {
        var matchingUser = await _userManager.FindByNameAsync(loginRequest.UserName);

        var jwtAuthResult = await _authenticationService.AuthenticateUserAsync(matchingUser, loginRequest.Password);

        if (jwtAuthResult == null)
        {
            return Unauthorized();
        }

        _authenticationService
                .SetTokensInsideCookie(
                    jwtAuthResult.AccessToken, 
                    jwtAuthResult.RefreshToken.TokenString, 
                    matchingUser.UserName, 
                    HttpContext
                );

        return Ok(
            new UserLoginResponse
            {
                UserName = matchingUser.UserName,
                AccessToken = jwtAuthResult.AccessToken,
                RefreshToken = jwtAuthResult.RefreshToken.TokenString,
                Nickname = matchingUser.Nickname,
            }
        );
    }

    [HttpPost("signup")]
    public async Task<IActionResult> Register([FromBody] UserRegisterRequest userRequest)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            User user = new User
            {
                Nickname = userRequest.Nickname,
                Email = userRequest.Email,
                UserName = userRequest.Email,
            };

            var result = await _userManager.CreateAsync(user, userRequest.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            var roleResult = await _userManager.AddToRoleAsync(user, RoleType.User.ToString());

            if (!roleResult.Succeeded)
            {
                return BadRequest(roleResult.Errors);
            }

            UserResponse userResponse = new UserResponse
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Nickname = user.Nickname,
            };
            return Ok(userResponse);
        }
        catch (Exception ex)
        {
            Logger.Error($"Unable to register user: {ex.Message}");
            return BadRequest($"Unable to register user: {ex.Message}");
        }


    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        Logger.Debug("refresh toekn");
        var refreshToken = Request.Cookies["refreshToken"];
        var userName = Request.Cookies["username"];

        Logger.Debug(userName);

        JwtAuthResultViewModel jwtAuthResult = await _authenticationService.RefreshTokensAsync(refreshToken, userName);

        _authenticationService.SetTokensInsideCookie(jwtAuthResult.AccessToken, jwtAuthResult.RefreshToken.TokenString, userName, HttpContext);

        return Ok(jwtAuthResult);
    }


}
