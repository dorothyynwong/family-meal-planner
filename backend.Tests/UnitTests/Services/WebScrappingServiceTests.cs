using FamilyMealPlanner.Services;

[TestFixture]
public class WebScrappingServiceTests
{
    private WebScrappingService _service = new WebScrappingService();

    [SetUp]
    public void Setup()
    {
    }

    [Test]
    public async Task ImportRecipe_ValidUrl_ReturnsJson()
    {
        var url = "https://www.bbc.co.uk/food/recipes/air_fryer_chicken_kyiv_98492";
        
        string expectedJson = "{\"@context\":\"https://schema.org\",\"@type\":\"Recipe\",\"aggregateRating\":{\"ratingCount\":1,\"ratingValue\":5},\"author\":{\"@type\":\"Person\",\"name\":\"Jules Mercer\"},\"cookTime\":\"PT30M\",\"description\":\"A crispy chicken classic that works perfectly in the air fryer! Freeze the garlic butter in advance for an easy midweek meal.\",\"image\":[\"https://food-images.files.bbci.co.uk/food/recipes/air_fryer_chicken_kyiv_98492_16x9.jpg\"],\"keywords\":\"air fryer chicken, air fryer chicken, air fryer family food , air fryer, all things breaded, easy family dinners, chicken kyiv, chicken breast, nut free, pregnancy friendly\",\"name\":\"Air fryer chicken kyiv\",\"prepTime\":\"PT1H\",\"recipeCategory\":\"Main course\",\"recipeCuisine\":\"East European\",\"recipeIngredient\":[\"80g/2¾oz butter, softened \",\"1 garlic clove, crushed\",\"10g⅓oz fresh parsley leaves, roughly chopped\",\"freshly grated nutmeg, to taste\",\"salt and freshly ground black pepper\",\"4 chicken breasts, the chunkier the better\",\"2 free-range eggs, beaten\",\"80g/2¾oz plain flour\",\"100g/3½oz panko breadcrumbs\",\"olive oil spray\",\"salt and freshly ground black pepper\",\"green salad\",\"1 lemon, cut into wedges\"],\"recipeInstructions\":[\"To make the garlic butter, mix the softened butter in a bowl with the garlic, parsley and nutmeg. Season well with salt and pepper. Wrap the butter in cling film to form a log shape, then place in the freezer until hard, about 20 minutes.\",\"To make the chicken kyivs, use a sharp knife to cut a slit into the side of each chicken breast to make a pocket, starting from the thicker end of the breast and cutting down as far as you can go without making any holes. \",\"Slice the garlic butter into 1cm/½in-thick pieces, then divide between the chicken breasts and stuff into the pockets. Secure well with a few toothpicks or butcher’s twine.\",\"Preheat the air fryer to 200C.\",\"Place the flour on a large plate and season with salt and pepper. Place the breadcrumbs on another plate. Place the beaten eggs in a shallow bowl.\",\"Dip the chicken breasts in the flour, egg and finally the panko breadcrumbs. Spray the crumbed breasts all over with the olive oil spray, then place in the air fryer to bake for 20 minutes.\",\"Serve with a green salad and a big wedge of lemon. \"],\"recipeYield\":\"Serves 4\",\"suitableForDiet\":[]}";


        var result = await _service.GetRecipeJson(url);
        Assert.That(result, Is.Not.Null);

        Assert.That(expectedJson, Is.EqualTo(result)); 
    }

    [Test]
    public async Task ImportRecipe_InValidUrl_ReturnsJson()
    {
        var url = "http://google.com";

        var exception = Assert.ThrowsAsync<Exception>(async () => 
        await _service.GetRecipeJson(url));

        Assert.That(exception.Message, Does.Contain("invalid recipe"));
    }
}