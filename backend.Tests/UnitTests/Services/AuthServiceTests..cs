using FamilyMealPlanner.Models.Data;
using FamilyMealPlanner.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Moq;

[TestFixture]
public class AuthServiceTests
{
    private Mock<HttpContext> _mockHttpContext;
    private Mock<IResponseCookies> _mockCookies;
    private Mock<IConfiguration> _mockConfiguration;
    private Mock<UserManager<User>> _mockUserManager;
    private AuthenticationService _authService; 

    [SetUp]
    public void SetUp()
    {
        _mockHttpContext = new Mock<HttpContext>();
        _mockCookies = new Mock<IResponseCookies>();
        _mockHttpContext.Setup(c => c.Response.Cookies).Returns(_mockCookies.Object);
        _mockConfiguration = new Mock<IConfiguration>();
        _mockConfiguration.SetupGet(x => x["Jwt:AccessTokenExpiryMinutes"]).Returns("15");
        _mockConfiguration.SetupGet(x => x["Jwt:RefreshTokenExpiryDays"]).Returns("7");
        _mockConfiguration.SetupGet(x => x["Jwt:Issuer"]).Returns("FamilyMealPlannerTest");
        _mockConfiguration.SetupGet(x => x["Jwt:Audience"]).Returns("audience");
        _mockConfiguration.SetupGet(x => x["Jwt:RefreshTokenName"]).Returns("TokenName");
        _mockUserManager = new Mock<UserManager<User>>(
            new Mock<IUserStore<User>>().Object, 
            null, null, null, null, null, null, null, null
        );

        _authService = new AuthenticationService(_mockConfiguration.Object, _mockUserManager.Object);
    }

    [Test]
    public void SetTokensInsideCookie_ShouldSetCookiesCorrectly()
    {
        var accessToken = "testAccessToken";
        var refreshToken = "testRefreshToken";
        var email = "test@example.com";

        _authService.SetTokensInsideCookie(accessToken, refreshToken, email, _mockHttpContext.Object);

        _mockCookies.Verify(c => c.Append("accessToken", accessToken, It.Is<CookieOptions>(o => 
            o.HttpOnly && o.IsEssential && o.Secure && o.SameSite == SameSiteMode.None)), Times.Once);

        _mockCookies.Verify(c => c.Append("refreshToken", refreshToken, It.Is<CookieOptions>(o => 
            o.HttpOnly && o.IsEssential && o.Secure && o.SameSite == SameSiteMode.None)), Times.Once);

        // _mockCookies.Verify(c => c.Append("email", email, It.Is<CookieOptions>(o => 
        //     o.HttpOnly && o.SameSite == SameSiteMode.Strict)), Times.Once);
    }

    [Test]
    public void RemoveTokensFromCookie_ShouldRemoveCookiesCorrectly()
    {
        _authService.RemoveTokensFromCookie(_mockHttpContext.Object);

    
        _mockCookies.Verify(c => c.Append("accessToken", "", It.Is<CookieOptions>(o => 
            o.Expires <= DateTimeOffset.UtcNow)), Times.Once);

        _mockCookies.Verify(c => c.Append("refreshToken", "", It.Is<CookieOptions>(o => 
            o.Expires <= DateTimeOffset.UtcNow)), Times.Once);

        // _mockCookies.Verify(c => c.Append("email", "", It.Is<CookieOptions>(o => 
        //     o.Expires <= DateTimeOffset.UtcNow)), Times.Once);
    }
}
