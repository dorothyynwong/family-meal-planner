// using FamilyMealPlanner.Models;
// using FamilyMealPlanner.Services;
// using FluentAssertions;

// [TestFixture]
// public class WebScrappingServiceTests
// {
//     private WebScrappingService _service = new WebScrappingService();

//     [SetUp]
//     public void Setup()
//     {
//     }

//     [Test]
//     public async Task ImportRecipe_ValidUrl_ReturnsRecipe()
//     {
//         var url = "https://www.bbc.co.uk/food/recipes/air_fryer_chicken_27325";

//         Recipe recipe = new Recipe();
//         recipe.Name = "Air fryer sticky chicken drumsticks";
//         recipe.Images = [
//                         "https://food-images.files.bbci.co.uk/food/recipes/air_fryer_chicken_27325_16x9.jpg"
//                         ];
//         recipe.Description =  "This sticky marinade is a winner – super quick to make and adds a wonderfully sweet and rich flavour to chicken pieces.";
//         recipe.RecipeIngredients = [
//                                     "2 tbsp light soy sauce",
//                                     "3 tbsp tomato chutney (or any type will work)",
//                                     "2 tbsp runny honey",
//                                     "1 tsp Worcestershire sauce",
//                                     "8 chicken legs (see recipe tip)",
//                                     "potato salad and green crunchy leaves",
//                                   ];
//         recipe.RecipeInstructions = [
//                                     "In a large bowl, mix together the marinade ingredients, then add the chicken and coat well with the marinade. Cover and keep in the fridge for anything from 20 minutes up to 24 hours.",
//                                     "When ready to cook, preheat the air fryer to 180C.",
//                                     "Lay the drumsticks in a single layer in the basket and cook for 10 minutes, then turn over and cook for another 10–12 minutes until they are crispy and charred.",
//                                     "Serve with a potato salad and green crunchy leaves.",
//                                     ];
//         recipe.DefaultImageUrl = "https://food-images.files.bbci.co.uk/food/recipes/air_fryer_chicken_27325_16x9.jpg";


//         var result = await _service.GetRecipeFromUrl(url);
//         Assert.That(result, Is.Not.Null);

//         result.Name.Should().BeEquivalentTo(recipe.Name);
//         result.Images.Should().BeEquivalentTo(recipe.Images);
//         result.Description.Should().BeEquivalentTo(recipe.Description);
//         result.RecipeIngredients.Should().BeEquivalentTo(recipe.RecipeIngredients);
//         result.RecipeInstructions.Should().BeEquivalentTo(recipe.RecipeInstructions);
//         result.DefaultImageUrl.Should().BeEquivalentTo(recipe.DefaultImageUrl);
//     }

//     [Test]
//     public void ImportRecipe_InValidUrl_ReturnsRecipe()
//     {
//         var url = "http://google.com";
        
//         var exception = Assert.ThrowsAsync<Exception>(async () =>
//         await _service.GetRecipeFromUrl(url));

//         Assert.That(exception.Message, Does.Contain("invalid recipe"));
//     }
// }
