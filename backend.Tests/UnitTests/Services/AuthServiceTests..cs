using FamilyMealPlanner;
using FamilyMealPlanner.Enums;
using FamilyMealPlanner.Models;
using FamilyMealPlanner.Models.Data;
using FamilyMealPlanner.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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

        _mockCookies.Verify(c => c.Append("email", email, It.Is<CookieOptions>(o => 
            o.HttpOnly && o.SameSite == SameSiteMode.Strict)), Times.Once);
    }

    [Test]
    public void RemoveTokensFromCookie_ShouldRemoveCookiesCorrectly()
    {
        _authService.RemoveTokensFromCookie(_mockHttpContext.Object);

    
        _mockCookies.Verify(c => c.Append("accessToken", "", It.Is<CookieOptions>(o => 
            o.Expires <= DateTimeOffset.UtcNow)), Times.Once);

        _mockCookies.Verify(c => c.Append("refreshToken", "", It.Is<CookieOptions>(o => 
            o.Expires <= DateTimeOffset.UtcNow)), Times.Once);

        _mockCookies.Verify(c => c.Append("email", "", It.Is<CookieOptions>(o => 
            o.Expires <= DateTimeOffset.UtcNow)), Times.Once);
    }

    // private void SeedDatabase(FamilyMealPlannerContext context)
    // {
    //     var initialRecipes = new List<Recipe>
    //     {
    //         new Recipe { Name = "Recipe 1", CreationDateTime = _dateTime, LastUpdatedDateTime = _dateTime },
    //         new Recipe { Name = "Recipe 2", CreationDateTime = _dateTime, LastUpdatedDateTime = _dateTime }
    //     };

    //     context.Recipes.AddRange(initialRecipes);

    //     var initialMeals = new List<Meal>
    //     {
    //         new Meal { Date = new DateOnly(2024,10,14), RecipeId = 1, MealType = MealType.Breakfast, AddedByUserId = _defaultUserId },
    //         new Meal { Date = new DateOnly(2024,10,14), Notes = "meal 2", MealType = MealType.Lunch, AddedByUserId = _defaultUserId },
    //     };

    //     context.Meals.AddRange(initialMeals);
    //     context.SaveChanges();
    // }

    // [Test]
    // public async Task AddMeal_ReturnsMealId_GetMeal_ReturnsCorrectMeal()
    // {
    //     var mealDate = new DateOnly(2024, 10, 14);

    //     MealRequest meal = new MealRequest();
    //     meal.Date = mealDate;
    //     meal.RecipeId = 1;
    //     meal.FamilyId = 2;
    //     meal.MealType = MealType.Breakfast.ToString();
    //     meal.AddedByUserId = _defaultUserId;
    //     meal.Notes = "notes";


    //     var mealId = await _mealService.AddMeal(meal, 1);

    //     var newMeal = await _mealService.GetMealById(mealId);

    //     mealId.Should().BePositive();
    //     newMeal.RecipeId.Should().Be(meal.RecipeId);
    //     newMeal.FamilyId.Should().Be(meal.FamilyId);
    //     newMeal.MealType.ToString().Should().BeEquivalentTo(meal.MealType);
    //     newMeal.AddedByUserId.Should().Be(meal.AddedByUserId);
    //     newMeal.Notes.Should().BeEquivalentTo(meal.Notes);

    // }

    // [Test]
    // public async Task UpdateMeal_ReturnsMeal()
    // {
    //     var mealDate = new DateOnly(2024, 10, 14);
    //     int mealId = 1;

    //     MealRequest meal = new MealRequest();
    //     meal.Date = mealDate;
    //     meal.RecipeId = 2;
    //     // meal.FamilyId = 3;
    //     meal.MealType = MealType.Lunch.ToString();
    //     meal.AddedByUserId = 4;
    //     meal.Notes = "notes";

    //     await _mealService.UpdateMeal(meal, mealId, _defaultUserId);

    //     var newMeal = await _mealService.GetMealById(mealId);

    //     mealId.Should().BePositive();
    //     newMeal.RecipeId.Should().Be(meal.RecipeId);
    //     // newMeal.FamilyId.Should().Be(meal.FamilyId);
    //     newMeal.MealType.ToString().Should().BeEquivalentTo(meal.MealType);
    //     newMeal.AddedByUserId.Should().Be(_defaultUserId);
    //     newMeal.Notes.Should().BeEquivalentTo(meal.Notes);
    // }

    // [Test]
    // public async Task DeleteMeal()
    // {
    //     int mealId = 2;

    //     await _mealService.Delete(mealId, _defaultUserId);

    //     var exception = Assert.ThrowsAsync<InvalidOperationException>(async () =>
    //     {
    //         await _mealService.GetMealById(mealId);
    //     });
    // }

    // [Test]
    // public void AddMeal_WithoutRequest()
    // {
    //     var exception = Assert.ThrowsAsync<ArgumentNullException>(async () =>
    //     {
    //         var mealId = await _mealService.AddMeal(null,_defaultUserId);
    //     });
    // }

    // [Test]
    // public void AddMeal_WithoutDate()
    // {
    //     var mealDate = new DateOnly(2024, 10, 14);

    //     MealRequest meal = new MealRequest();
    //     meal.RecipeId = 1;
    //     meal.FamilyId = 2;
    //     meal.MealType = MealType.Breakfast.ToString();
    //     meal.AddedByUserId = _defaultUserId;
    //     meal.Notes = "notes";

    //     var exception = Assert.ThrowsAsync<ArgumentException>(async () =>
    //     {
    //         var mealId = await _mealService.AddMeal(meal, _defaultUserId);
    //     });
    // }

    // [Test]
    // public void AddMeal_WithoutMealType()
    // {
    //     var mealDate = new DateOnly(2024, 10, 14);

    //     MealRequest meal = new MealRequest();
    //     meal.Date = mealDate;
    //     meal.RecipeId = 1;
    //     meal.FamilyId = 2;
    //     meal.AddedByUserId = _defaultUserId;
    //     meal.Notes = "notes";

    //     var exception = Assert.ThrowsAsync<ArgumentException>(async () =>
    //     {
    //         var mealId = await _mealService.AddMeal(meal, _defaultUserId);
    //     });
    // }

    // [Test]
    // public void AddMeal_WithoutAddByUserId()
    // {
    //     var mealDate = new DateOnly(2024, 10, 14);

    //     MealRequest meal = new MealRequest();
    //     meal.Date = mealDate;
    //     meal.RecipeId = 1;
    //     meal.FamilyId = 2;
    //     meal.MealType = MealType.Breakfast.ToString();
    //     meal.Notes = "notes";

    //     var exception = Assert.ThrowsAsync<ArgumentException>(async () =>
    //     {
    //         var mealId = await _mealService.AddMeal(meal, _defaultUserId);
    //     });
    // }


    // [Test]
    // public void UpdateNonExistMeal()
    // {
    //     var mealDate = new DateOnly(2024, 10, 14);
    //     int mealId = 100;

    //     MealRequest meal = new MealRequest();
    //     meal.Date = mealDate;
    //     meal.RecipeId = 2;
    //     // meal.FamilyId = 3;
    //     meal.MealType = MealType.Lunch.ToString();
    //     meal.AddedByUserId = 4;
    //     meal.Notes = "notes";

    //     var exception = Assert.ThrowsAsync<Exception>(async () =>
    //     {
    //         await _mealService.UpdateMeal(meal, mealId, _defaultUserId);
    //     });
    // }

    // [Test]
    // public void DeleteNonExistRecipe()
    // {
    //     int mealId = 100;

    //     var exception = Assert.ThrowsAsync<Exception>(async () =>
    //     {
    //         await _mealService.Delete(mealId, _defaultUserId);
    //     });
    // }

    // [TearDown]
    // public void TearDown()
    // {
    //     _context.Dispose();
    // }
}
