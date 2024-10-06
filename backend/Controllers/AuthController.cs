
using System.Security.Claims;
using FamilyMealPlanner.Enums;
using FamilyMealPlanner.Models;
using FamilyMealPlanner.Models.Data;
using FamilyMealPlanner.Models.Request;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FamilyMealPlanner.Controllers;

[ApiController]
[Route("/auth")]
public class AuthController(UserManager<User> userManager, RoleManager<Role> roleManager, IConfiguration configuration)
    : Controller
{
    private readonly UserManager<User> _userManager = userManager;
    private readonly RoleManager<Role> _roleManager = roleManager;
    private readonly IConfiguration _configuration = configuration;

    // [HttpPost("login")]
    // public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
    // {
    //     var matchingUser = await _userManager.FindByNameAsync(loginRequest.UserName);
    //     if (matchingUser != null && await _userManager.CheckPasswordAsync(matchingUser, loginRequest.Password))
    //     {
    //         var matchingUserRoles = await _userManager.GetRolesAsync(matchingUser);
    //         var authClaims = new List<Claim>
    //         {
    //             new(ClaimTypes.NameIdentifier, matchingUser.Id.ToString()),
    //             new(ClaimTypes.Name, matchingUser.UserName!),
    //             new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
    //         };
    //         foreach (var role in matchingUserRoles)
    //         {
    //             authClaims.Add(new Claim(ClaimTypes.Role, role));
    //         }
    //         var token = new JwtSecurityToken(
    //             issuer: _configuration["Jwt:Issuer"],
    //             audience: _configuration["Jwt:Audience"],
    //             expires: DateTime.UtcNow.AddHours(1),
    //             claims: authClaims,
    //             signingCredentials: new SigningCredentials(
    //                 new SymmetricSecurityKey(Encoding.Default.GetBytes(_configuration["Jwt:Secret"]!)),
    //                 SecurityAlgorithms.HmacSha256
    //             )
    //         );
    //         return Ok(
    //             new TokenResponse
    //             {
    //                 Token = new JwtSecurityTokenHandler().WriteToken(token),
    //                 Expiration = token.ValidTo,
    //                 RoleType = token.Claims.ElementAt(3).Value
    //             }
    //         );
    //     }
    //     return Unauthorized();
    // }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRequest userRequest)
    {
        User user = new User
        {
            FirstName = userRequest.FirstName,
            LastName = userRequest.LastName,
            Email = userRequest.Email,
            UserName = userRequest.UserName,
        };

        var result = await _userManager.CreateAsync(user, userRequest.Password);
        
        await _userManager.AddToRoleAsync(user, RoleType.User.ToString());

        UserResponse userResponse = new UserResponse
        {
            Id = user.Id,
            UserName  = user.UserName,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
        };

        return Ok(userResponse);
    }
}
