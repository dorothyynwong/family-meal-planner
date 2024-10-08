using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FamilyMealPlanner.Models;
using FamilyMealPlanner.Models.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using NLog;

namespace FamilyMealPlanner.Services;

public interface IAuthenticationService
{
    void SetTokensInsideCookie(string accessToken, string refreshToken, HttpContext context);
    Task<JwtAuthResultViewModel> GenerateTokens(User user, IEnumerable<Claim> claims, DateTime now);
}

public class AuthenticationService(IConfiguration configuration, UserManager<User> userManager) : IAuthenticationService
{
    private readonly IConfiguration _configuration = configuration;
    private readonly UserManager<User> _userManager = userManager;
    private SigningCredentials CreateSigningCredentials()
    {
        
        string secret = _configuration["JWT:SECRET"];
        if (secret == null)
            throw new InvalidOperationException("Unable to find JWT Secret");

        return new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)), 
            SecurityAlgorithms.HmacSha256);
    }

    public async Task<JwtAuthResultViewModel> GenerateTokens(User user, IEnumerable<Claim> authClaims, DateTime now)
    {

        var jwt = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    audience: _configuration["Jwt:Audience"],
                    claims: authClaims,
                    expires: DateTime.UtcNow.AddHours(1),
                    signingCredentials: CreateSigningCredentials()
                    );

        var accessTokenString = new JwtSecurityTokenHandler().WriteToken(jwt);
        var refreshTokenString = await _userManager.GenerateUserTokenAsync(user, _configuration["Jwt:AppName"], _configuration["Jwt:RefreshTokenName"]);

        var refreshTokenModel = new RefreshTokenViewModel
        {
            UserName = user.UserName,
            TokenString = refreshTokenString,
            ExpireAt = now.AddMinutes(5)
        };

        return new JwtAuthResultViewModel
        {
            AccessToken = accessTokenString,
            RefreshToken = refreshTokenModel
        };
    }

    public void SetTokensInsideCookie(string accessToken, string refreshToken, HttpContext context)
    {
        context.Response.Cookies.Append("accessToken", accessToken,
            new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddMinutes(5),
                HttpOnly = true,
                IsEssential = true,
                Secure = true,
                SameSite = SameSiteMode.None
            });

        context.Response.Cookies.Append("refreshToken", refreshToken,
            new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddDays(7),
                HttpOnly = true,
                IsEssential = true,
                Secure = true,
                SameSite = SameSiteMode.None
            });
    }
}