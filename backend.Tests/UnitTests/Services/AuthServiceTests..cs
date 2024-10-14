using FamilyMealPlanner;
using FamilyMealPlanner.Enums;
using FamilyMealPlanner.Models;
using FamilyMealPlanner.Services;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;

[TestFixture]
public class AuthServiceTests
{
    private IMealService _mealService;
    private FamilyMealPlannerContext _context;
    private DateTime _dateTime = new DateTime(2024, 10, 14, 09, 00, 00);
    private int _defaultUserId = 1;

    [SetUp]
    public void Setup()
    {
        var options = new DbContextOptionsBuilder<FamilyMealPlannerContext>()
            .UseInMemoryDatabase(databaseName: "TestDatabase")
            .Options;

        _context = new FamilyMealPlannerContext(options);

        _mealService = new MealService(_context);

        SeedDatabase(_context);
    }

    private void SeedDatabase(FamilyMealPlannerContext context)
    {
        var initialRecipes = new List<Recipe>
        {
            new Recipe { Name = "Recipe 1", CreationDateTime = _dateTime, LastUpdatedDateTime = _dateTime },
            new Recipe { Name = "Recipe 2", CreationDateTime = _dateTime, LastUpdatedDateTime = _dateTime }
        };

        context.Recipes.AddRange(initialRecipes);

        var initialMeals = new List<Meal>
        {
            new Meal { Date = new DateOnly(2024,10,14), RecipeId = 1, MealType = MealType.Breakfast, AddedByUserId = _defaultUserId },
            new Meal { Date = new DateOnly(2024,10,14), Notes = "meal 2", MealType = MealType.Lunch, AddedByUserId = _defaultUserId },
        };

        context.Meals.AddRange(initialMeals);
        context.SaveChanges();
    }

    [Test]
    public async Task AddMeal_ReturnsMealId_GetMeal_ReturnsCorrectMeal()
    {
        var mealDate = new DateOnly(2024, 10, 14);

        MealRequest meal = new MealRequest();
        meal.Date = mealDate;
        meal.RecipeId = 1;
        meal.FamilyId = 2;
        meal.MealType = MealType.Breakfast.ToString();
        meal.AddedByUserId = _defaultUserId;
        meal.Notes = "notes";


        var mealId = await _mealService.AddMeal(meal, 1);

        var newMeal = await _mealService.GetMealById(mealId);

        mealId.Should().BePositive();
        newMeal.RecipeId.Should().Be(meal.RecipeId);
        newMeal.FamilyId.Should().Be(meal.FamilyId);
        newMeal.MealType.ToString().Should().BeEquivalentTo(meal.MealType);
        newMeal.AddedByUserId.Should().Be(meal.AddedByUserId);
        newMeal.Notes.Should().BeEquivalentTo(meal.Notes);

    }

    [Test]
    public async Task UpdateMeal_ReturnsMeal()
    {
        var mealDate = new DateOnly(2024, 10, 14);
        int mealId = 1;

        MealRequest meal = new MealRequest();
        meal.Date = mealDate;
        meal.RecipeId = 2;
        // meal.FamilyId = 3;
        meal.MealType = MealType.Lunch.ToString();
        meal.AddedByUserId = 4;
        meal.Notes = "notes";

        await _mealService.UpdateMeal(meal, mealId, _defaultUserId);

        var newMeal = await _mealService.GetMealById(mealId);

        mealId.Should().BePositive();
        newMeal.RecipeId.Should().Be(meal.RecipeId);
        // newMeal.FamilyId.Should().Be(meal.FamilyId);
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
        var exception = Assert.ThrowsAsync<ArgumentNullException>(async () =>
        {
            var mealId = await _mealService.AddMeal(null,_defaultUserId);
        });
    }

    [Test]
    public void AddMeal_WithoutDate()
    {
        var mealDate = new DateOnly(2024, 10, 14);

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
    public void DeleteNonExistRecipe()
    {
        int mealId = 100;

        var exception = Assert.ThrowsAsync<Exception>(async () =>
        {
            await _mealService.Delete(mealId, _defaultUserId);
        });
    }

    [TearDown]
    public void TearDown()
    {
        _context.Dispose();
    }
}
