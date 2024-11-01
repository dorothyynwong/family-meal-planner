using FamilyMealPlanner.Models.Data;

namespace FamilyMealPlanner.Models;

public class RecipeResponse
{
    public int Id { get; set; }

    public string Name { get; set; }

    public string? Notes {get ; set;}
    public List<string>? Images { get; set; }
    public string? Description { get; set; }
    public List<string>? RecipeIngredients { get; set; }
    public List<string>? RecipeInstructions { get; set; } 
    public DateTime CreationDateTime {get; set; }
    public DateTime? LastUpdatedDateTime {get; set;} = DateTime.UtcNow;
    public string? DefaultImageUrl   { get; set; }
    public string? RecipeUrl {get; set;}
    public int AddedByUserId {get; set; }

    public string AddedByUserNickname {get; set; }
    public bool IsOwner {get; set;}
}
