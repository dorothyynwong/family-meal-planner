using FamilyMealPlanner.Models;
using FamilyMealPlanner.Services;
using FluentAssertions;

[TestFixture]
public class WebScrappingServiceTests
{
    private WebScrappingService _service = new WebScrappingService();

    [SetUp]
    public void Setup()
    {
    }

    [Test]
    public async Task ImportRecipe_ValidUrl_ReturnsRecipe()
    {
        var url = "https://www.allrecipes.com/recipe/45396/easy-pancakes/";

        Recipe recipe = new Recipe();
        recipe.Name = "Easy Pancakes";
        recipe.Images = [
                        "https://www.allrecipes.com/thmb/pZtxkWhiaZdUmdhgv-Pj9EIMbVY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/45396-easy-pancakes-DDMFS-4x3-44411f993d7841d9b2b89bcc65bdd178.jpg"
                        ];
        recipe.Description =  "This easy pancake recipe is quick to make with simple pantry ingredients. They cook up nice and fluffy for a family-pleasing breakfast or brunch.";
        recipe.RecipeIngredients = [
                                    "1 cup all-purpose flour",
                                    "2 tablespoons white sugar",
                                    "2 teaspoons baking powder",
                                    "1 teaspoon salt, or to taste",
                                    "1 cup milk",
                                    "2 tablespoons vegetable oil",
                                    "1 egg, beaten"
                                  ];
        recipe.RecipeInstructions = [
                                    "Gather the ingredients.",
                                    "Combine flour, sugar, baking powder, and salt in a large bowl. Make a well in the center, and pour in milk, oil, and egg. Mix until smooth.",
                                    "Heat a lightly oiled griddle or frying pan over medium-high heat. Pour or scoop batter onto the griddle, using approximately 1/4 cup for each pancake; cook until bubbles form and the edges are dry, 1 to 2 minutes. Flip and cook until browned on the other side. Repeat with remaining batter.",
                                    "Serve hot and enjoy!",
                                    ];
        recipe.DefaultImageUrl = "https://www.allrecipes.com/thmb/pZtxkWhiaZdUmdhgv-Pj9EIMbVY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/45396-easy-pancakes-DDMFS-4x3-44411f993d7841d9b2b89bcc65bdd178.jpg";
        recipe.RecipeUrl = url;


        var result = await _service.GetRecipeFromUrl(url);
        Assert.That(result, Is.Not.Null);

        result.Name.Should().BeEquivalentTo(recipe.Name);
        result.Images.Should().BeEquivalentTo(recipe.Images);
        result.Description.Should().BeEquivalentTo(recipe.Description);
        result.RecipeIngredients.Should().BeEquivalentTo(recipe.RecipeIngredients);
        result.RecipeInstructions.Should().BeEquivalentTo(recipe.RecipeInstructions);
        result.DefaultImageUrl.Should().BeEquivalentTo(recipe.DefaultImageUrl);
        result.RecipeUrl.Should().BeEquivalentTo(recipe.RecipeUrl);
    }

    [Test]
    public void ImportRecipe_InValidUrl_ReturnsRecipe()
    {
        var url = "http://google.com";
        
        var exception = Assert.ThrowsAsync<Exception>(async () =>
        await _service.GetRecipeFromUrl(url));

        Assert.That(exception.Message, Does.Contain("invalid recipe"));
    }
}
