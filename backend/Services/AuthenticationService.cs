using FamilyMealPlanner.Models;
using Microsoft.AspNetCore.Mvc;
using NLog;

namespace FamilyMealPlanner.Services;

public interface IAuthenticationService
{
    void SetTokensInsideCookie(string token, HttpContext context);
}

public class AuthenticationService : IAuthenticationService
{
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