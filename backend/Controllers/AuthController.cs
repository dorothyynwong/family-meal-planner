
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
public class AuthController(
                            UserManager<User> userManager,
                            RoleManager<Role> roleManager,
                            IConfiguration configuration,
                            IAuthenticationService authenticationService,
                            IFamilyUserService familyUserService
                        )
    : Controller
{
    private readonly UserManager<User> _userManager = userManager;
    private readonly RoleManager<Role> _roleManager = roleManager;
    private readonly IAuthenticationService _authenticationService = authenticationService;
    private readonly IFamilyUserService _familyUserService = familyUserService;


    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginRequest loginRequest)
    {
        var matchingUser = await _userManager.FindByEmailAsync(loginRequest.Email);

        var jwtAuthResult = await _authenticationService.AuthenticateUserAsync(matchingUser, loginRequest.Password);

        if (jwtAuthResult == null)
        {
            return Unauthorized();
        }

        _authenticationService
                .SetTokensInsideCookie(
                    jwtAuthResult.AccessToken,
                    jwtAuthResult.RefreshToken.Token,
                    matchingUser.Email,
                    HttpContext
                );

        return Ok(
            new UserLoginResponse
            {
                Email = matchingUser.Email,
                AccessToken = jwtAuthResult.AccessToken,
                RefreshToken = jwtAuthResult.RefreshToken.Token,
                Nickname = matchingUser.Nickname,
                AvatarColor = matchingUser.AvatarColor,
                AvatarUrl = matchingUser.AvatarUrl,
                AvatarFgColor = matchingUser.AvatarFgColor,
            }
        );
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var refreshTokenString = Request.Cookies["refreshToken"];
        if (refreshTokenString != null)
            await _authenticationService.RevokeLastRefreshToken(refreshTokenString);
        _authenticationService.RemoveTokensFromCookie(HttpContext);

        return Ok();
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
                UserName = userRequest.Email,
                Nickname = userRequest.Nickname,
                Email = userRequest.Email,
                AvatarColor = userRequest.AvatarColor,
                AvatarUrl = userRequest.AvatarUrl,
                AvatarFgColor = userRequest.AvatarFgColor,
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
                Email = user.Email,
                Nickname = user.Nickname,
                AvatarColor = user.AvatarColor,
                AvatarUrl = user.AvatarUrl,
                AvatarFgColor = user.AvatarFgColor,
            };

            if (userRequest.FamilyCode != null && userRequest.FamilyCode != "")
            {
                FamilyUserRequest familyUserRequest = new FamilyUserRequest
                {
                    FamilyShareCode = Guid.Parse(userRequest.FamilyCode!),
                    FamilyRole = FamilyRoleType.Eater.ToString()
                };

                await _familyUserService.AddFamilyUser(familyUserRequest, user.Id);
            }
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
        try
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var email = Request.Cookies["email"];

            if (refreshToken == null || refreshToken == "" || email == null || email == "")
                return Unauthorized("Refresh token is missing");

            JwtAuthResultViewModel jwtAuthResult = await _authenticationService.RefreshTokensAsync(refreshToken, email);

            _authenticationService.SetTokensInsideCookie(jwtAuthResult.AccessToken, jwtAuthResult.RefreshToken.Token, email, HttpContext);

            return Ok(jwtAuthResult);
        }
        catch(Exception ex)
        {
            Logger.Error($"Unable to refresh token {ex.Message} ");
            return BadRequest($"Unable to refresh token {ex.Message} ");
        }
    }

    [HttpGet]
    public async Task<IActionResult> ValidateAccessToken()
    {
        var accessToken = Request.Cookies["accessToken"];

        if (await _authenticationService.ValidateAccessToken(accessToken))
        {
            return Ok(true);
        }
        else
        {
            return Unauthorized("Invalid Access Token");
        }
    }
}
