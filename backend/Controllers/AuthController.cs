
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

    // private SigningCredentials CreateSigningCredentials()
    // {
        
    //     string secret = _configuration["JWT:SECRET"];
    //     if (secret == null)
    //         throw new InvalidOperationException("Unable to find JWT Secret");

    //     return new SigningCredentials(
    //         new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)), 
    //         SecurityAlgorithms.HmacSha256);
    // }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginRequest loginRequest)
    {
        var matchingUser = await _userManager.FindByNameAsync(loginRequest.UserName);
        if (matchingUser != null && await _userManager.CheckPasswordAsync(matchingUser, loginRequest.Password))
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

            JwtAuthResultViewModel jwtAuthResult = await _authenticationService.GenerateTokens(matchingUser,authClaims, DateTime.Now);

            // var jwt = new JwtSecurityToken(
            //             issuer:  _configuration["Jwt:Issuer"],
            //             audience: _configuration["Jwt:Audience"],
            //             claims: authClaims,
            //             expires: DateTime.UtcNow.AddHours(1),
            //             signingCredentials: CreateSigningCredentials()
            //             );

            // var token = new JwtSecurityTokenHandler().WriteToken(jwt);
            _authenticationService.SetTokensInsideCookie(jwtAuthResult.AccessToken, HttpContext);

            return Ok(
                jwtAuthResult
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
}
