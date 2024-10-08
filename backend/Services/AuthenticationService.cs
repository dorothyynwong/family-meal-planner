using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FamilyMealPlanner.Models;
using FamilyMealPlanner.Models.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using NLog;

namespace FamilyMealPlanner.Services;

public interface IAuthenticationService
{
    void SetTokensInsideCookie(string accessToken, string refreshToken, string userName, HttpContext context);
    Task<JwtAuthResultViewModel> AuthenticateUserAsync(User user, string password);
    Task<JwtAuthResultViewModel> GenerateTokens(User user, IEnumerable<Claim> claims, DateTime now);
    Task<JwtAuthResultViewModel> RefreshTokensAsync(string refreshToken, string userName);
}

public class AuthenticationService(IConfiguration configuration, UserManager<User> userManager) : IAuthenticationService
{
    private readonly IConfiguration _configuration = configuration;
    private readonly UserManager<User> _userManager = userManager;
    private int _accessTokenExpiry = int.Parse(configuration["Jwt:AccessTokenExpiryMinutes"]);
    private int _refreshTokenExpiry = int.Parse(configuration["Jwt:RefreshTokenExpiryDays"]);
    private string _issuer = configuration["Jwt:Issuer"];
    private string _audience = configuration["Jwt:Audience"];
    private string _appName = configuration["Jwt:AppName"];
    private string _refreshTokenName = configuration["Jwt:RefreshTokenName"];
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
                    issuer: _issuer,
                    audience: _audience,
                    claims: authClaims,
                    expires: DateTime.UtcNow.AddMinutes(_accessTokenExpiry),
                    signingCredentials: CreateSigningCredentials()
                    );

        var accessTokenString = new JwtSecurityTokenHandler().WriteToken(jwt);
        var refreshTokenString = await _userManager.GenerateUserTokenAsync(user, _appName, _refreshTokenName);

        var refreshTokenModel = new RefreshTokenViewModel
        {
            UserName = user.UserName,
            TokenString = refreshTokenString,
            ExpireAt = now.AddDays(_refreshTokenExpiry)
        };

        return new JwtAuthResultViewModel
        {
            AccessToken = accessTokenString,
            RefreshToken = refreshTokenModel
        };
    }

    public async Task<JwtAuthResultViewModel> AuthenticateUserAsync(User user, string password)
    {
        if (user != null && await _userManager.CheckPasswordAsync(user, password))
        {
            var authClaims = await GetUserClaims(user);

            JwtAuthResultViewModel jwtAuthResult = await GenerateTokens(user, authClaims, DateTime.Now);

            await _userManager.SetAuthenticationTokenAsync(
                                                            user,
                                                            _configuration["Jwt:AppName"],
                                                            _configuration["Jwt:RefreshTokenName"],
                                                            jwtAuthResult.RefreshToken.TokenString
                                                        );

            return jwtAuthResult;
        }
        return null;
    }

    public void SetTokensInsideCookie(string accessToken, string refreshToken, string userName, HttpContext context)
    {
        context.Response.Cookies.Append("accessToken", accessToken,
            new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddMinutes(_accessTokenExpiry),
                HttpOnly = true,
                IsEssential = true,
                Secure = true,
                SameSite = SameSiteMode.None
            });

        context.Response.Cookies.Append("refreshToken", refreshToken,
            new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddDays(_refreshTokenExpiry),
                HttpOnly = true,
                IsEssential = true,
                Secure = true,
                SameSite = SameSiteMode.None
            });

        context.Response.Cookies.Append("username", userName,
            new CookieOptions { HttpOnly = true, SameSite = SameSiteMode.Strict });

    }

    public async Task<JwtAuthResultViewModel> RefreshTokensAsync(string refreshToken, string userName)
    {
        var matchingUser = await _userManager.FindByNameAsync(userName);

        var isValid = await userManager.VerifyUserTokenAsync(matchingUser,
                                                            _appName,
                                                            _refreshTokenName,
                                                            refreshToken);

        if (!isValid)
        {
            return null;
        }

        var authClaims = await GetUserClaims(matchingUser);

        JwtAuthResultViewModel jwtAuthResult = await GenerateTokens(matchingUser, authClaims, DateTime.Now);
        await userManager.SetAuthenticationTokenAsync(
                                                 matchingUser,
                                                 _appName,
                                                 _refreshTokenName,
                                                 jwtAuthResult.RefreshToken.TokenString
                                             );
        return jwtAuthResult;
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