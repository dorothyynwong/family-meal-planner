namespace FamilyMealPlanner.Models;

public class ImportRecipeResponse
{
    public string Name { get; set; } = "";
    public List<string> Images { get; set; } = [];
    public string Author { get; set; } = "";
    public string Url { get; set; } = "";
    public string Description { get; set; } = "";
    public string RecipeCuisine { get; set; } = "";
    public string PrepTime { get; set; } = "";
    public string CookTime { get; set; } = "";
    public string TotalTime { get; set; } = "";
    public string Keywords { get; set; } = "";
    public string RecipeYield { get; set; } = "";
    public string RecipeCategory { get; set; } = "";
    public List<string> RecipeIngredients { get; set; } = [];
    public List<string> RecipeInstructions { get; set; }  = [];
}
