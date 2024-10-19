using FamilyMealPlanner;
using FamilyMealPlanner.Enums;
using FamilyMealPlanner.Models;
using FamilyMealPlanner.Models.Data;
using FamilyMealPlanner.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;

[TestFixture]
public class MealServiceTests
{
    private IMealService _mealService;
    // private IFamilyUserService _familyUserService;
    private Mock<IFamilyUserService> _mockFamilyUserService;
    private FamilyMealPlannerContext _context;
    // private UserManager<User> _userManager;
    // private RoleManager<Role> _roleManager;
    private DateTime _dateTime = new DateTime(2024, 10, 14, 09, 00, 00);
    private int _defaultUserId = 1;

    [SetUp]
    public void Setup()
    {
        // var serviceCollection = new ServiceCollection();
        // serviceCollection.AddDbContext<FamilyMealPlannerContext>(options =>
        //     options.UseSqlite("DataSource=:memory:"));

        // serviceCollection.AddIdentity<User, Role>()
        //     .AddEntityFrameworkStores<FamilyMealPlannerContext>()
        //     .AddDefaultTokenProviders();

        // var mockUserManagerLogger = new Mock<ILogger<UserManager<User>>>();
        // var mockRoleManagerLogger = new Mock<ILogger<RoleManager<Role>>>();
        // var mockDataProtectorTokenProviderLogger = new Mock<ILogger<DataProtectorTokenProvider<User>>>();

        // serviceCollection.AddSingleton(mockUserManagerLogger.Object);
        // serviceCollection.AddSingleton(mockRoleManagerLogger.Object);
        // serviceCollection.AddSingleton(mockDataProtectorTokenProviderLogger.Object);

        // var serviceProvider = serviceCollection.BuildServiceProvider();

        // _context = serviceProvider.GetService<FamilyMealPlannerContext>();
        // _userManager = serviceProvider.GetService<UserManager<User>>();
        // _roleManager = serviceProvider.GetService<RoleManager<Role>>();

        // _context.Database.OpenConnection();

        // _context.Database.EnsureCreated();

        // var builder = new ConfigurationBuilder();
        // IConfigurationRoot configuration = builder.Build();

        _mockFamilyUserService = new Mock<IFamilyUserService>();

        var options = new DbContextOptionsBuilder<FamilyMealPlannerContext>()
            .UseInMemoryDatabase(databaseName: "TestDatabase")
            .Options;

        _context = new FamilyMealPlannerContext(options);

        _mealService = new MealService(_context, _mockFamilyUserService.Object);

        // SeedDatabaseAsync(_context).Wait();
        SeedDatabase(_context);
    }

    // private async Task SeedDatabaseAsync(FamilyMealPlannerContext context)
    private void SeedDatabase(FamilyMealPlannerContext context)
    {
        // var user1 = new User { Email = "user1@abc.com", UserName = "user1@abc.com", Nickname = "user1" };
        // var user2 = new User { Email = "user2@abc.com", UserName = "user2@abc.com", Nickname = "user2" };
        // var user3 = new User { Email = "user3@abc.com", UserName = "user3@abc.com", Nickname = "user3" };
        // var password = "Pa$$word1";

        // await _userManager.CreateAsync(user1, password);
        // await _userManager.CreateAsync(user2, password);
        // await _userManager.CreateAsync(user3, password);

        // var initialFamilies = new List<Family>
        // {
        //     new Family { FamilyName = "Family 1", FamilyShareCode = Guid.Parse("dfe6a97e-b4c7-43de-990c-448b80632a69")},
        //     new Family { FamilyName = "Family 2", FamilyShareCode = Guid.Parse("bddd8146-5b02-443e-8844-c047b3373254")},
        //     new Family { FamilyName = "Family 3", FamilyShareCode = Guid.Parse("99a888f2-5ce7-47da-8ef6-ea2fc2bd4ab6")},
        // };

        // if (!context.Families.Any())
        // {
        //     context.Families.AddRange(initialFamilies);
        //     context.SaveChanges();
        // }
        // var initialFamilyUsers = new List<FamilyUser>
        // {
        //     new FamilyUser { UserId = 1, FamilyId = 1, FamilyRole = FamilyRoleType.Cook, IsApproved=true },
        //     new FamilyUser { UserId = 1, FamilyId = 2, FamilyRole = FamilyRoleType.Eater, IsApproved=true },
        //     new FamilyUser { UserId = 2, FamilyId = 1, FamilyRole = FamilyRoleType.Eater, IsApproved=false },
        //     new FamilyUser { UserId = 3, FamilyId = 1, FamilyRole = FamilyRoleType.Eater, IsApproved=true },
        // };

        // if (!context.FamilyUsers.Any())
        // {
        //     context.FamilyUsers.AddRange(initialFamilyUsers);
        //     context.SaveChanges();
        // }

        var initialRecipes = new List<Recipe>
        {
            new Recipe { Name = "Recipe 1", CreationDateTime = _dateTime, LastUpdatedDateTime = _dateTime, AddedByUserId = 1 },
            new Recipe { Name = "Recipe 2", CreationDateTime = _dateTime, LastUpdatedDateTime = _dateTime, AddedByUserId = 1 }
        };

        if (!context.Recipes.Any())
        {
            context.Recipes.AddRange(initialRecipes);
            context.SaveChanges();
        }

        var initialMeals = new List<Meal>
        {
            new Meal { Date = new DateOnly(2024,10,14), RecipeId = 1, MealType = MealType.Breakfast, UserId = 1, AddedByUserId = _defaultUserId },
            new Meal { Date = new DateOnly(2024,10,14), Notes = "meal 2", MealType = MealType.Lunch, UserId = 1, AddedByUserId = _defaultUserId },
            new Meal { Date = new DateOnly(2024,10,14), RecipeId = 1, MealType = MealType.Breakfast, FamilyId = 1, AddedByUserId = _defaultUserId },
            new Meal { Date = new DateOnly(2024,10,14), Notes = "meal 3", MealType = MealType.Lunch, FamilyId = 1, AddedByUserId = _defaultUserId },
        };

        if (!context.Meals.Any())
        {
            context.Meals.AddRange(initialMeals);
            context.SaveChanges();
        }
    }

    [Test]
    public async Task AddMeal_ReturnsMealId_GetMeal_ReturnsCorrectMeal()
    {
        var mealDate = new DateOnly(2024, 10, 14);
        int familyId = 0;

        MealRequest meal = new MealRequest();
        meal.Date = mealDate;
        meal.RecipeId = 1;
        meal.UserId = _defaultUserId;
        meal.MealType = MealType.Breakfast.ToString();
        meal.AddedByUserId = _defaultUserId;
        meal.Notes = "notes";

        _mockFamilyUserService.Setup(s => s.IsCook(familyId, _defaultUserId))
            .ReturnsAsync(true);

        var mealId = await _mealService.AddMeal(meal, _defaultUserId);

        var newMeal = await _mealService.GetMealById(mealId);

        mealId.Should().BePositive();
        newMeal.RecipeId.Should().Be(meal.RecipeId);
        newMeal.MealType.ToString().Should().BeEquivalentTo(meal.MealType);
        newMeal.AddedByUserId.Should().Be(meal.AddedByUserId);
        newMeal.Notes.Should().BeEquivalentTo(meal.Notes);

    }

    [Test]
    public async Task UpdateMeal_ReturnsMeal()
    {
        var mealDate = new DateOnly(2024, 10, 14);
        int mealId = 1;
        int familyId = 0;

        MealRequest meal = new MealRequest();
        meal.Date = mealDate;
        meal.RecipeId = 2;
        meal.MealType = MealType.Lunch.ToString();
        meal.AddedByUserId = 4;
        meal.Notes = "notes";

        await _mealService.UpdateMeal(meal, mealId, _defaultUserId);

        var newMeal = await _mealService.GetMealById(mealId);

        mealId.Should().BePositive();
        newMeal.RecipeId.Should().Be(meal.RecipeId);
        newMeal.MealType.ToString().Should().BeEquivalentTo(meal.MealType);
        newMeal.AddedByUserId.Should().Be(_defaultUserId);
        newMeal.Notes.Should().BeEquivalentTo(meal.Notes);
    }

    [Test]
    public async Task DeleteMeal()
    {
        int mealId = 2;

        await _mealService.Delete(mealId, _defaultUserId);

        var exception = Assert.ThrowsAsync<InvalidOperationException>(async () =>
        {
            await _mealService.GetMealById(mealId);
        });
    }

    [Test]
    public void AddMeal_WithoutRequest()
    {
        _mockFamilyUserService.Setup(s => s.IsCook(1, _defaultUserId))
            .ReturnsAsync(true);

        var exception = Assert.ThrowsAsync<ArgumentNullException>(async () =>
        {
            var mealId = await _mealService.AddMeal(null, _defaultUserId);
        });
    }

    [Test]
    public void AddMeal_WithoutDate()
    {
        var mealDate = new DateOnly(2024, 10, 14);

        _mockFamilyUserService.Setup(s => s.IsCook(1, _defaultUserId))
            .ReturnsAsync(true);

        MealRequest meal = new MealRequest();
        meal.RecipeId = 1;
        meal.FamilyId = 2;
        meal.MealType = MealType.Breakfast.ToString();
        meal.AddedByUserId = _defaultUserId;
        meal.Notes = "notes";

        var exception = Assert.ThrowsAsync<ArgumentException>(async () =>
        {
            var mealId = await _mealService.AddMeal(meal, _defaultUserId);
        });
    }

    [Test]
    public void AddMeal_WithoutMealType()
    {
        var mealDate = new DateOnly(2024, 10, 14);

        _mockFamilyUserService.Setup(s => s.IsCook(1, _defaultUserId))
            .ReturnsAsync(true);

        MealRequest meal = new MealRequest();
        meal.Date = mealDate;
        meal.RecipeId = 1;
        meal.FamilyId = 2;
        meal.AddedByUserId = _defaultUserId;
        meal.Notes = "notes";

        var exception = Assert.ThrowsAsync<ArgumentException>(async () =>
        {
            var mealId = await _mealService.AddMeal(meal, _defaultUserId);
        });
    }

    [Test]
    public void AddMeal_WithoutAddByUserId()
    {
        var mealDate = new DateOnly(2024, 10, 14);

        _mockFamilyUserService.Setup(s => s.IsCook(1, _defaultUserId))
            .ReturnsAsync(true);

        MealRequest meal = new MealRequest();
        meal.Date = mealDate;
        meal.RecipeId = 1;
        meal.FamilyId = 2;
        meal.MealType = MealType.Breakfast.ToString();
        meal.Notes = "notes";

        var exception = Assert.ThrowsAsync<ArgumentException>(async () =>
        {
            var mealId = await _mealService.AddMeal(meal, _defaultUserId);
        });
    }


    [Test]
    public void UpdateNonExistMeal()
    {
        var mealDate = new DateOnly(2024, 10, 14);
        int mealId = 100;

        MealRequest meal = new MealRequest();
        meal.Date = mealDate;
        meal.RecipeId = 2;
        // meal.FamilyId = 3;
        meal.MealType = MealType.Lunch.ToString();
        meal.AddedByUserId = 4;
        meal.Notes = "notes";

        var exception = Assert.ThrowsAsync<Exception>(async () =>
        {
            await _mealService.UpdateMeal(meal, mealId, _defaultUserId);
        });
    }

    [Test]
    public void DeleteNonExistMeal()
    {
        int mealId = 100;

        var exception = Assert.ThrowsAsync<Exception>(async () =>
        {
            await _mealService.Delete(mealId, _defaultUserId);
        });
    }

    // [Test]
    // public async Task GetMealByDateFamilyId_ReturnListAsync()
    // {
    //     int familyId = 1;
    //     int userId = 1;
    //     DateOnly fromDate = new DateOnly(2024,10,14);
    //     DateOnly toDate = new DateOnly(2024,10,14);
    //     var mealResponses = await _mealService.GetMealByDateFamilyId(fromDate, toDate, familyId, userId);
    //     var mealResponse1 = mealResponses[0];
    //     var mealResponse2 = mealResponses[1];

    //     mealResponse1.Id.Should().Be(3);
    //     mealResponse2.Id.Should().Be(4);
    //     mealResponse1.Date.Should().Be(fromDate);
    //     mealResponse2.Date.Should().Be(toDate);
    //     mealResponse1.RecipeId.Should().Be(1);
    //     mealResponse2.Notes.Should().Be("meal 3");
    //     mealResponse1.FamilyId.Should().Be(familyId);
    //     mealResponse2.FamilyId.Should().Be(familyId);
    //     mealResponse1.MealType.Should().Be(MealType.Breakfast.ToString());
    //     mealResponse2.MealType.Should().Be(MealType.Lunch.ToString());
    //     mealResponse1.AddedByUserId.Should().Be(_defaultUserId);
    //     mealResponse2.AddedByUserId.Should().Be(_defaultUserId);
    // }

    [TearDown]
    public void TearDown()
    {
        _context.Dispose();
        // _userManager.Dispose();
        // _roleManager.Dispose();
    }
}
