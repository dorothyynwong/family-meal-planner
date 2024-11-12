using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using FamilyMealPlanner.Models;
using FamilyMealPlanner.Models.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NLog;

namespace FamilyMealPlanner.Services;

public interface IAuthenticationService
{
    void SetTokensInsideCookie(string accessToken, string refreshToken, string email, HttpContext context);
    void RemoveTokensFromCookie(HttpContext context);
    Task<JwtAuthResultViewModel> AuthenticateUserAsync(User user, string password);
    Task<JwtAuthResultViewModel> GenerateTokens(User user, IEnumerable<Claim> claims, DateTime now);
    Task<JwtAuthResultViewModel> RefreshTokensAsync(string refreshToken, string email);
    Task<bool> ValidateAccessToken(string accessToken);
    Task RevokeLastRefreshToken(string refreshTokenString);
}

public class AuthenticationService(IConfiguration configuration, UserManager<User> userManager, FamilyMealPlannerContext context) : IAuthenticationService
{
    private readonly FamilyMealPlannerContext _context = context;
    private readonly IConfiguration _configuration = configuration;
    private readonly UserManager<User> _userManager = userManager;
    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();
    private int _accessTokenExpiry = int.Parse(configuration["Jwt:AccessTokenExpiryMinutes"]);
    private int _refreshTokenExpiry = int.Parse(configuration["Jwt:RefreshTokenExpiryDays"]);
    private int _emailExpiry = int.Parse(configuration["Jwt:EmailExpiryDays"]);
    private string _issuer = configuration["Jwt_Issuer"];
    private string _audience = configuration["Jwt_Audience"];

    private SymmetricSecurityKey CreateSymmetricSecurityKey()
    {
        string secret = _configuration["Jwt_Secret"];
        if (string.IsNullOrWhiteSpace(secret))
            throw new InvalidOperationException("Unable to find JWT Secret");

        return new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
    }

    private SigningCredentials CreateSigningCredentials()
    {

        return new SigningCredentials(
            CreateSymmetricSecurityKey(),
            SecurityAlgorithms.HmacSha256);
    }

    private string GenerateAccessToken(IEnumerable<Claim> authClaims, DateTime now)
    {
        var jwt = new JwtSecurityToken(
            issuer: _issuer,
            audience: _audience,
            claims: authClaims,
            expires: now.AddMinutes(_accessTokenExpiry),
            signingCredentials: CreateSigningCredentials()
            );

        return new JwtSecurityTokenHandler().WriteToken(jwt);
    }

    private RefreshToken GenerateRefreshToken(User user, DateTime now)
    {
        var refreshTokenString = "";

        var randomNumber = new byte[32];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomNumber);
            refreshTokenString = Convert.ToBase64String(randomNumber);
        }

        return new RefreshToken
        {
            Token = refreshTokenString,
            Username = user.Email,
            ExpirationTime = now.AddDays(_refreshTokenExpiry)
        };
    }

    private async Task RemoveExpiredTokens(DateTime now)
    {
        List<RefreshToken> refreshTokens = await _context.RefreshTokens.Where(rt => rt.ExpirationTime < now).ToListAsync();

        if (refreshTokens.Count != 0)
        {
            _context.RefreshTokens.RemoveRange(refreshTokens);
            await _context.SaveChangesAsync();
        }
    }

    public async Task RevokeLastRefreshToken(string refreshTokenString)
    {
        try
        {
            RefreshToken refreshToken = await _context.RefreshTokens
                        .FirstOrDefaultAsync(rt => rt.Token == refreshTokenString);

            if(refreshToken != null)
            {
                _context.RefreshTokens.Remove(refreshToken);
                await _context.SaveChangesAsync();
            }
        }
        catch (DbUpdateException ex)
        {
            Logger.Error($"Database error on deleting refresh token : {ex.Message}");
            throw new Exception("An error occurred while updating the database.", ex);
        }
        catch (Exception ex)
        {
            Logger.Error($"Unexpected error deleting refresh token: {ex.Message}");
            throw new Exception("Unexpected error while deleting record to database", ex);
        }

    }

    private async Task<RefreshToken?> ValidateRefreshToken(string refreshTokenString, string email)
    {
        RefreshToken? refreshToken = await _context.RefreshTokens.FirstOrDefaultAsync(
                                        rt => rt.Token == refreshTokenString &&
                                                rt.Username == email &&
                                                rt.ExpirationTime > DateTime.UtcNow
                                    );

        return refreshToken;
    }

    public async Task<JwtAuthResultViewModel> GenerateTokens(User user, IEnumerable<Claim> authClaims, DateTime now)
    {
        await RemoveExpiredTokens(now);

        var accessTokenString = GenerateAccessToken(authClaims, now);
        var refreshToken = GenerateRefreshToken(user, now);

        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();

        return new JwtAuthResultViewModel
        {
            AccessToken = accessTokenString,
            RefreshToken = refreshToken
        };
    }

    public async Task<JwtAuthResultViewModel> AuthenticateUserAsync(User user, string password)
    {
        if (user != null && await _userManager.CheckPasswordAsync(user, password))
        {
            var authClaims = await GetUserClaims(user);

            JwtAuthResultViewModel jwtAuthResult = await GenerateTokens(user, authClaims, DateTime.UtcNow);

            return jwtAuthResult;
        }
        return null;
    }

    public void SetTokensInsideCookie(string accessToken, string refreshToken, string email, HttpContext context)
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

        context.Response.Cookies.Append("email", email,
            new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddDays(_emailExpiry),
                HttpOnly = true,
                IsEssential = true,
                Secure = true,
                SameSite = SameSiteMode.None
            });

    }

    public void RemoveTokensFromCookie(HttpContext context)
    {
        context.Response.Cookies.Append("accessToken", "",
            new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddDays(-1),
                HttpOnly = true,
                IsEssential = true,
                Secure = true,
                SameSite = SameSiteMode.None
            });

        context.Response.Cookies.Append("refreshToken", "",
            new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddDays(-1),
                HttpOnly = true,
                IsEssential = true,
                Secure = true,
                SameSite = SameSiteMode.None
            });

        context.Response.Cookies.Append("email", "",
            new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddDays(-1),
                HttpOnly = true,
                IsEssential = true,
                Secure = true,
                SameSite = SameSiteMode.None
            });
    }


    public async Task<JwtAuthResultViewModel> RefreshTokensAsync(string refreshTokenString, string email)
    {

        var matchingUser = await _userManager.FindByEmailAsync(email);

        if (matchingUser == null) return null;

        RefreshToken? refreshToken = await ValidateRefreshToken(refreshTokenString, email);
        if (refreshToken == null) return null;

        await RevokeLastRefreshToken(refreshTokenString);

        var authClaims = await GetUserClaims(matchingUser);

        JwtAuthResultViewModel jwtAuthResult = await GenerateTokens(matchingUser, authClaims, DateTime.UtcNow);

        return jwtAuthResult;
    }

    public async Task<bool> ValidateAccessToken(string accessToken)
    {
        var tokenHandler = new JwtSecurityTokenHandler();

        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = _issuer,

            ValidateAudience = true,
            ValidAudience = _audience,

            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = CreateSymmetricSecurityKey()
        };

        try
        {
            var principal = tokenHandler.ValidateToken(accessToken, tokenValidationParameters, out SecurityToken validatedToken);
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Token validation failed: {ex.Message}");
            return false;
        }
    }


    private async Task<List<Claim>> GetUserClaims(User matchingUser)
    {
        var matchingUserRoles = await _userManager.GetRolesAsync(matchingUser);
        var authClaims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, matchingUser.Id.ToString()),
                new(ClaimTypes.Name, matchingUser.Email),
            };
        foreach (var role in matchingUserRoles)
        {
            authClaims.Add(new Claim(ClaimTypes.Role, role));
        }

        return authClaims;
    }
}