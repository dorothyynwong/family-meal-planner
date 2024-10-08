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
    void SetTokensInsideCookie(string token, HttpContext context);
    Task<JwtAuthResultViewModel> GenerateTokens(User user, IEnumerable<Claim> claims, DateTime now);
}

public class AuthenticationService(IConfiguration configuration) : IAuthenticationService
{
    private readonly IConfiguration _configuration = configuration;
    private readonly UserManager<User> userManager;

    private SigningCredentials CreateSigningCredentials()
    {
        
        string secret = _configuration["JWT:SECRET"];
        if (secret == null)
            throw new InvalidOperationException("Unable to find JWT Secret");

        return new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)), 
            SecurityAlgorithms.HmacSha256);
    }

    public async Task<JwtAuthResultViewModel> GenerateTokens(User user, IEnumerable<Claim> claims, DateTime now)
    {

        var jwt = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    audience: _configuration["Jwt:Audience"],
                    claims: claims,
                    expires: DateTime.UtcNow.AddHours(1),
                    signingCredentials: CreateSigningCredentials()
                    );

        var accessTokenString = new JwtSecurityTokenHandler().WriteToken(jwt);
        var refreshTokenstring = await userManager.GenerateUserTokenAsync(user, "AppName", "RefreshTokenName");

        var refreshTokenModel = new RefreshTokenViewModel
        {
            UserName = user.UserName,
            TokenString = refreshTokenstring,
            ExpireAt = now.AddMinutes(5)
        };

        return new JwtAuthResultViewModel
        {
            AccessToken = accessTokenString,
            RefreshToken = refreshTokenModel
        };
    }

    public void SetTokensInsideCookie(string token, HttpContext context)
    {
        context.Response.Cookies.Append("accessToken", token,
            new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddMinutes(5),
                HttpOnly = true,
                IsEssential = true,
                Secure = true,
                SameSite = SameSiteMode.None
            });

        // context.Response.Cookies.Append("refreshToken", tokenDto.RefreshToken,
        //     new CookieOptions
        //     {
        //         Expires = DateTimeOffset.UtcNow.AddDays(7),
        //         HttpOnly = true,
        //         IsEssential = true,
        //         Secure = true,
        //         SameSite = SameSiteMode.None
        //     });
    }
}