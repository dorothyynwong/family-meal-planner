using FamilyMealPlanner;
using FamilyMealPlanner.Models;
using FamilyMealPlanner.Services;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;

[TestFixture]
public class RecipeServiceTests
{
    private IRecipeService _recipeService;
    private Mock<IFamilyUserService> _mockFamilyUserService;
    private Mock<IFamilyService> _mockFamilyService;
    private FamilyMealPlannerContext _context;
    private DateTime _dateTime = new DateTime(2024, 10, 14, 09, 00, 00);

    [SetUp]
    public void Setup()
    {
        _mockFamilyUserService = new Mock<IFamilyUserService>();
        _mockFamilyService = new Mock<IFamilyService>();

        var options = new DbContextOptionsBuilder<FamilyMealPlannerContext>()
            .UseInMemoryDatabase(databaseName: "TestDatabase")
            .Options;

        _context = new FamilyMealPlannerContext(options);

        _recipeService = new RecipeService(_context, _mockFamilyUserService.Object, _mockFamilyService.Object);

        SeedDatabase(_context);
    }

    private void SeedDatabase(FamilyMealPlannerContext context)
    {

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

    }

    [Test]
    public async Task AddRecipe_ReturnsRecipId_GetRecipe_ReturnsCorrectRecipe()
    {
        RecipeRequest recipe = new RecipeRequest();
        int userId = 1;

        recipe.Name = "Air fryer chicken kyiv";
        recipe.Images = [
                        "https://food-images.files.bbci.co.uk/food/recipes/air_fryer_chicken_kyiv_98492_16x9.jpg",
                        "https://ibb.co/Csc8CJQ"
                        ];
        recipe.Description = "A crispy chicken classic that works perfectly in the air fryer! Freeze the garlic butter in advance for an easy midweek meal.";
        recipe.RecipeIngredients = [
                                    "80g/2¾oz butter, softened ",
                                    "1 garlic clove, crushed",
                                    "10g⅓oz fresh parsley leaves, roughly chopped",
                                    "freshly grated nutmeg, to taste",
                                    "salt and freshly ground black pepper",
                                    "4 chicken breasts, the chunkier the better",
                                    "2 free-range eggs, beaten",
                                    "80g/2¾oz plain flour",
                                    "100g/3½oz panko breadcrumbs",
                                    "olive oil spray",
                                    "salt and freshly ground black pepper",
                                    "green salad",
                                    "1 lemon, cut into wedges"
                                  ];
        recipe.RecipeInstructions = [
                                    "To make the garlic butter, mix the softened butter in a bowl with the garlic, parsley and nutmeg. Season well with salt and pepper. Wrap the butter in cling film to form a log shape, then place in the freezer until hard, about 20 minutes.",
                                    "To make the chicken kyivs, use a sharp knife to cut a slit into the side of each chicken breast to make a pocket, starting from the thicker end of the breast and cutting down as far as you can go without making any holes. ",
                                    "Slice the garlic butter into 1cm/½in-thick pieces, then divide between the chicken breasts and stuff into the pockets. Secure well with a few toothpicks or butcher’s twine.",
                                    "Preheat the air fryer to 200C.",
                                    "Place the flour on a large plate and season with salt and pepper. Place the breadcrumbs on another plate. Place the beaten eggs in a shallow bowl.",
                                    "Dip the chicken breasts in the flour, egg and finally the panko breadcrumbs. Spray the crumbed breasts all over with the olive oil spray, then place in the air fryer to bake for 20 minutes.",
                                    "Serve with a green salad and a big wedge of lemon. "
                                    ];
        recipe.DefaultImageUrl = "https://food-images.files.bbci.co.uk/food/recipes/air_fryer_chicken_kyiv_98492_16x9.jpg";
        recipe.Notes = "This is a note";
        
        var nowDateTime = DateTime.UtcNow;

        var recipeId = await _recipeService.AddRecipe(recipe, userId);
        _mockFamilyUserService.Setup(s => s.IsSameFamily(userId, userId))
            .ReturnsAsync(true);

        var newRecipe = await _recipeService.GetRecipeById(recipeId, userId);

        recipeId.Should().BePositive();
        newRecipe.Name.Should().BeEquivalentTo(recipe.Name);
        newRecipe.Images.Should().BeEquivalentTo(recipe.Images);
        newRecipe.Notes.Should().BeEquivalentTo(recipe.Notes);
        newRecipe.Description.Should().BeEquivalentTo(recipe.Description);
        newRecipe.RecipeIngredients.Should().BeEquivalentTo(recipe.RecipeIngredients);
        newRecipe.RecipeInstructions.Should().BeEquivalentTo(recipe.RecipeInstructions);
        newRecipe.DefaultImageUrl.Should().BeEquivalentTo(recipe.DefaultImageUrl);
        newRecipe.CreationDateTime.Should().BeAfter(nowDateTime);
        newRecipe.LastUpdatedDateTime.Should().BeAfter(nowDateTime);
    }

    [Test]
    public async Task UpdateRecipe_ReturnsRecipe()
    {
        int recipeId = 1;
        int userId = 1;

        RecipeRequest recipe = new RecipeRequest();
        recipe.Name = "Air fryer chicken kyiv";
        recipe.Images = [
                        "https://food-images.files.bbci.co.uk/food/recipes/air_fryer_chicken_kyiv_98492_16x9.jpg",
                        "https://ibb.co/Csc8CJQ"
                        ];
        recipe.Description = "A crispy chicken classic that works perfectly in the air fryer! Freeze the garlic butter in advance for an easy midweek meal.";
        recipe.RecipeIngredients = [
                                    "80g/2¾oz butter, softened ",
                                    "1 garlic clove, crushed",
                                    "10g⅓oz fresh parsley leaves, roughly chopped",
                                    "freshly grated nutmeg, to taste",
                                    "salt and freshly ground black pepper",
                                    "4 chicken breasts, the chunkier the better",
                                    "2 free-range eggs, beaten",
                                    "80g/2¾oz plain flour",
                                    "100g/3½oz panko breadcrumbs",
                                    "olive oil spray",
                                    "salt and freshly ground black pepper",
                                    "green salad",
                                    "1 lemon, cut into wedges"
                                  ];
        recipe.RecipeInstructions = [
                                    "To make the garlic butter, mix the softened butter in a bowl with the garlic, parsley and nutmeg. Season well with salt and pepper. Wrap the butter in cling film to form a log shape, then place in the freezer until hard, about 20 minutes.",
                                    "To make the chicken kyivs, use a sharp knife to cut a slit into the side of each chicken breast to make a pocket, starting from the thicker end of the breast and cutting down as far as you can go without making any holes. ",
                                    "Slice the garlic butter into 1cm/½in-thick pieces, then divide between the chicken breasts and stuff into the pockets. Secure well with a few toothpicks or butcher’s twine.",
                                    "Preheat the air fryer to 200C.",
                                    "Place the flour on a large plate and season with salt and pepper. Place the breadcrumbs on another plate. Place the beaten eggs in a shallow bowl.",
                                    "Dip the chicken breasts in the flour, egg and finally the panko breadcrumbs. Spray the crumbed breasts all over with the olive oil spray, then place in the air fryer to bake for 20 minutes.",
                                    "Serve with a green salad and a big wedge of lemon. "
                                    ];
        recipe.DefaultImageUrl = "https://food-images.files.bbci.co.uk/food/recipes/air_fryer_chicken_kyiv_98492_16x9.jpg";
        recipe.Notes = "This is a note";

        var nowDateTime = DateTime.UtcNow;

        _mockFamilyUserService.Setup(s => s.IsSameFamily(userId, userId))
            .ReturnsAsync(true);

        await _recipeService.UpdateRecipe(recipe, recipeId, userId);

        var newRecipe = await _recipeService.GetRecipeById(recipeId, userId);

        newRecipe.Id.Should().Be(recipeId);
        newRecipe.Name.Should().BeEquivalentTo(recipe.Name);
        newRecipe.Images.Should().BeEquivalentTo(recipe.Images);
        newRecipe.Notes.Should().BeEquivalentTo(recipe.Notes);
        newRecipe.Description.Should().BeEquivalentTo(recipe.Description);
        newRecipe.RecipeIngredients.Should().BeEquivalentTo(recipe.RecipeIngredients);
        newRecipe.RecipeInstructions.Should().BeEquivalentTo(recipe.RecipeInstructions);
        newRecipe.DefaultImageUrl.Should().BeEquivalentTo(recipe.DefaultImageUrl);
        newRecipe.CreationDateTime.Should().Be(_dateTime);
        newRecipe.LastUpdatedDateTime.Should().BeAfter(nowDateTime);
    }

    [Test]
    public async Task DeleteRecipe()
    {
        int recipeId = 2;
        int userId = 1;

        await _recipeService.Delete(recipeId, userId);

        var exception = Assert.ThrowsAsync<InvalidOperationException>(async () =>
        {
            _mockFamilyUserService.Setup(s => s.IsSameFamily(userId, userId))
                .ReturnsAsync(true);

            await _recipeService.GetRecipeById(recipeId, userId);
        });
    }

   [Test]
    public void AddRecipe_WithoutName()
    {
        int userId = 1;
        RecipeRequest recipe = new RecipeRequest();
        recipe.Name = "";
        recipe.Images = [
                        "https://food-images.files.bbci.co.uk/food/recipes/air_fryer_chicken_kyiv_98492_16x9.jpg",
                        "https://ibb.co/Csc8CJQ"
                        ];
        recipe.Description = "A crispy chicken classic that works perfectly in the air fryer! Freeze the garlic butter in advance for an easy midweek meal.";
        recipe.RecipeIngredients = [
                                    "80g/2¾oz butter, softened ",
                                    "1 garlic clove, crushed",
                                    "10g⅓oz fresh parsley leaves, roughly chopped",
                                    "freshly grated nutmeg, to taste",
                                    "salt and freshly ground black pepper",
                                    "4 chicken breasts, the chunkier the better",
                                    "2 free-range eggs, beaten",
                                    "80g/2¾oz plain flour",
                                    "100g/3½oz panko breadcrumbs",
                                    "olive oil spray",
                                    "salt and freshly ground black pepper",
                                    "green salad",
                                    "1 lemon, cut into wedges"
                                  ];
        recipe.RecipeInstructions = [
                                    "To make the garlic butter, mix the softened butter in a bowl with the garlic, parsley and nutmeg. Season well with salt and pepper. Wrap the butter in cling film to form a log shape, then place in the freezer until hard, about 20 minutes.",
                                    "To make the chicken kyivs, use a sharp knife to cut a slit into the side of each chicken breast to make a pocket, starting from the thicker end of the breast and cutting down as far as you can go without making any holes. ",
                                    "Slice the garlic butter into 1cm/½in-thick pieces, then divide between the chicken breasts and stuff into the pockets. Secure well with a few toothpicks or butcher’s twine.",
                                    "Preheat the air fryer to 200C.",
                                    "Place the flour on a large plate and season with salt and pepper. Place the breadcrumbs on another plate. Place the beaten eggs in a shallow bowl.",
                                    "Dip the chicken breasts in the flour, egg and finally the panko breadcrumbs. Spray the crumbed breasts all over with the olive oil spray, then place in the air fryer to bake for 20 minutes.",
                                    "Serve with a green salad and a big wedge of lemon. "
                                    ];
        recipe.DefaultImageUrl = "https://food-images.files.bbci.co.uk/food/recipes/air_fryer_chicken_kyiv_98492_16x9.jpg";
        recipe.Notes = "This is a note";

        var nowDateTime = DateTime.UtcNow;

        var exception = Assert.ThrowsAsync<ArgumentException>(async () =>
        {
            var recipeId = await _recipeService.AddRecipe(recipe, userId);
        });
    }

     [Test]
    public void AddRecipe_WithoutRequest()
    {
        var exception = Assert.ThrowsAsync<ArgumentNullException>(async () =>
        {
            var recipeId = await _recipeService.AddRecipe(null, 0);
        });
    }

    [Test]
    public void UpdateNonExistRecipe()
    {
        int recipeId = 100;
        int userId = 1;

        RecipeRequest recipe = new RecipeRequest();
        recipe.Name = "Air fryer chicken kyiv";
        recipe.Images = [
                        "https://food-images.files.bbci.co.uk/food/recipes/air_fryer_chicken_kyiv_98492_16x9.jpg",
                        "https://ibb.co/Csc8CJQ"
                        ];
        recipe.Description = "A crispy chicken classic that works perfectly in the air fryer! Freeze the garlic butter in advance for an easy midweek meal.";
        recipe.RecipeIngredients = [
                                    "80g/2¾oz butter, softened ",
                                    "1 garlic clove, crushed",
                                    "10g⅓oz fresh parsley leaves, roughly chopped",
                                    "freshly grated nutmeg, to taste",
                                    "salt and freshly ground black pepper",
                                    "4 chicken breasts, the chunkier the better",
                                    "2 free-range eggs, beaten",
                                    "80g/2¾oz plain flour",
                                    "100g/3½oz panko breadcrumbs",
                                    "olive oil spray",
                                    "salt and freshly ground black pepper",
                                    "green salad",
                                    "1 lemon, cut into wedges"
                                  ];
        recipe.RecipeInstructions = [
                                    "To make the garlic butter, mix the softened butter in a bowl with the garlic, parsley and nutmeg. Season well with salt and pepper. Wrap the butter in cling film to form a log shape, then place in the freezer until hard, about 20 minutes.",
                                    "To make the chicken kyivs, use a sharp knife to cut a slit into the side of each chicken breast to make a pocket, starting from the thicker end of the breast and cutting down as far as you can go without making any holes. ",
                                    "Slice the garlic butter into 1cm/½in-thick pieces, then divide between the chicken breasts and stuff into the pockets. Secure well with a few toothpicks or butcher’s twine.",
                                    "Preheat the air fryer to 200C.",
                                    "Place the flour on a large plate and season with salt and pepper. Place the breadcrumbs on another plate. Place the beaten eggs in a shallow bowl.",
                                    "Dip the chicken breasts in the flour, egg and finally the panko breadcrumbs. Spray the crumbed breasts all over with the olive oil spray, then place in the air fryer to bake for 20 minutes.",
                                    "Serve with a green salad and a big wedge of lemon. "
                                    ];
        recipe.DefaultImageUrl = "https://food-images.files.bbci.co.uk/food/recipes/air_fryer_chicken_kyiv_98492_16x9.jpg";
        recipe.Notes = "This is a note";

        var nowDateTime = DateTime.UtcNow;

        var exception = Assert.ThrowsAsync<Exception>(async () =>
        {
             await _recipeService.UpdateRecipe(recipe, recipeId, userId);
        });
    }

    [Test]
    public void DeleteNonExistRecipe()
    {
        int recipeId = 100;
        int userId = 1;

        var exception = Assert.ThrowsAsync<Exception>(async () =>
        {
            await _recipeService.Delete(recipeId, userId);
        });
    }

    [Test]
    public void DeleteRecipe_Unauthorised()
    {
        int recipeId = 1;
        int userId = 2;

        var exception = Assert.ThrowsAsync<UnauthorizedAccessException>(async () =>
        {
            await _recipeService.Delete(recipeId, userId);
        });
    }

    [Test]
    public void UpdateRecipe_Unauthorised()
    {
        int recipeId = 1;
        int userId = 2;

        RecipeRequest recipe = new RecipeRequest();
        recipe.Name = "Air fryer chicken kyiv";
        recipe.Images = [
                        "https://food-images.files.bbci.co.uk/food/recipes/air_fryer_chicken_kyiv_98492_16x9.jpg",
                        "https://ibb.co/Csc8CJQ"
                        ];
        recipe.Description = "A crispy chicken classic that works perfectly in the air fryer! Freeze the garlic butter in advance for an easy midweek meal.";
        recipe.RecipeIngredients = [
                                    "80g/2¾oz butter, softened ",
                                    "1 garlic clove, crushed",
                                    "10g⅓oz fresh parsley leaves, roughly chopped",
                                    "freshly grated nutmeg, to taste",
                                    "salt and freshly ground black pepper",
                                    "4 chicken breasts, the chunkier the better",
                                    "2 free-range eggs, beaten",
                                    "80g/2¾oz plain flour",
                                    "100g/3½oz panko breadcrumbs",
                                    "olive oil spray",
                                    "salt and freshly ground black pepper",
                                    "green salad",
                                    "1 lemon, cut into wedges"
                                  ];
        recipe.RecipeInstructions = [
                                    "To make the garlic butter, mix the softened butter in a bowl with the garlic, parsley and nutmeg. Season well with salt and pepper. Wrap the butter in cling film to form a log shape, then place in the freezer until hard, about 20 minutes.",
                                    "To make the chicken kyivs, use a sharp knife to cut a slit into the side of each chicken breast to make a pocket, starting from the thicker end of the breast and cutting down as far as you can go without making any holes. ",
                                    "Slice the garlic butter into 1cm/½in-thick pieces, then divide between the chicken breasts and stuff into the pockets. Secure well with a few toothpicks or butcher’s twine.",
                                    "Preheat the air fryer to 200C.",
                                    "Place the flour on a large plate and season with salt and pepper. Place the breadcrumbs on another plate. Place the beaten eggs in a shallow bowl.",
                                    "Dip the chicken breasts in the flour, egg and finally the panko breadcrumbs. Spray the crumbed breasts all over with the olive oil spray, then place in the air fryer to bake for 20 minutes.",
                                    "Serve with a green salad and a big wedge of lemon. "
                                    ];
        recipe.DefaultImageUrl = "https://food-images.files.bbci.co.uk/food/recipes/air_fryer_chicken_kyiv_98492_16x9.jpg";
        recipe.Notes = "This is a note";

        var nowDateTime = DateTime.UtcNow;

        var exception = Assert.ThrowsAsync<UnauthorizedAccessException>(async () =>
        {
             await _recipeService.UpdateRecipe(recipe, recipeId, userId);
        });
    }

    [TearDown]
    public void TearDown()
    {
        _context.Dispose();
    }
}
