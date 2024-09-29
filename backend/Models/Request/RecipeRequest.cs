using System.ComponentModel.DataAnnotations;

namespace FamilyMealPlanner.Models;

public class RecipeRequest
{
    [Required]
    public string Name { get; set; }
    public List<string>? Images { get; set; }
    public string? Notes { get; set; }
    public string? Description { get; set; }
    public List<string> RecipeIngredients { get; set; }
    public List<string> RecipeInstructions { get; set; } 
    public DateTime CreationDateTime {get; set; }
    public DateTime? LastUpdatedTime {get; set;} = DateTime.UtcNow;
    public string? DefaultImageUrl   { get; set; }
}
