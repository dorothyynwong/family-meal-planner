
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
using Microsoft.IdentityModel.Tokens;
using NLog;

namespace FamilyMealPlanner.Controllers;

[ApiController]
[Route("/auth")]
public class AuthController(UserManager<User> userManager, RoleManager<Role> roleManager, IConfiguration configuration, IAuthenticationService authenticationService)
    : Controller
{
    private readonly UserManager<User> _userManager = userManager;
    private readonly RoleManager<Role> _roleManager = roleManager;
    private readonly IConfiguration _configuration = configuration;
    private readonly IAuthenticationService _authenticationService = authenticationService;


    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginRequest loginRequest)
    {
        var matchingUser = await _userManager.FindByNameAsync(loginRequest.UserName);
        if (matchingUser != null && await _userManager.CheckPasswordAsync(matchingUser, loginRequest.Password))
        {
            var authClaims = await GetUserClaims(matchingUser);
            JwtAuthResultViewModel jwtAuthResult = await _authenticationService.GenerateTokens(matchingUser, authClaims, DateTime.Now);

            await userManager.SetAuthenticationTokenAsync(
                                                            matchingUser,
                                                            _configuration["Jwt:AppName"],
                                                            _configuration["Jwt:RefreshTokenName"],
                                                            jwtAuthResult.RefreshToken.TokenString
                                                        );

            _authenticationService.SetTokensInsideCookie(jwtAuthResult.AccessToken, jwtAuthResult.RefreshToken.TokenString, matchingUser.UserName, HttpContext);

            return Ok(
                new UserLoginResponse
                {
                    UserName = matchingUser.UserName,
                    AccessToken = jwtAuthResult.AccessToken,
                    RefreshToken = jwtAuthResult.RefreshToken.TokenString,
                    FirstName = matchingUser.FirstName,
                    LastName = matchingUser.LastName,
                }
            );
        }
        return Unauthorized();
    }

    [HttpPost("register")]
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
                FirstName = userRequest.FirstName,
                LastName = userRequest.LastName,
                Email = userRequest.Email,
                UserName = userRequest.UserName,
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
                FirstName = user.FirstName,
                LastName = user.LastName,
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

        var matchingUser = await _userManager.FindByNameAsync(userName);

        var isValid = await userManager.VerifyUserTokenAsync(matchingUser,
                                                            _configuration["Jwt:AppName"],
                                                            _configuration["Jwt:RefreshTokenName"],
                                                            refreshToken);

        if (!isValid)
        {
            return null;
        }

        var authClaims = await GetUserClaims(matchingUser);

        JwtAuthResultViewModel jwtAuthResult = await _authenticationService.GenerateTokens(matchingUser, authClaims, DateTime.Now);
        await userManager.SetAuthenticationTokenAsync(
                                                        matchingUser,
                                                        _configuration["Jwt:AppName"],
                                                        _configuration["Jwt:RefreshTokenName"],
                                                        jwtAuthResult.RefreshToken.TokenString
                                                    );

        _authenticationService.SetTokensInsideCookie(jwtAuthResult.AccessToken, jwtAuthResult.RefreshToken.TokenString, matchingUser.UserName, HttpContext);

        return Ok(jwtAuthResult);
    }

    private async Task<List<Claim>> GetUserClaims(User matchingUser)
    {
        var matchingUserRoles = await _userManager.GetRolesAsync(matchingUser);
        var authClaims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, matchingUser.Id.ToString()),
                new(ClaimTypes.Name, matchingUser.UserName!),
                // new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };
        foreach (var role in matchingUserRoles)
        {
            authClaims.Add(new Claim(ClaimTypes.Role, role));
        }

        return authClaims;
    }
}
