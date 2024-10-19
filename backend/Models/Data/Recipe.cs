using System.ComponentModel.DataAnnotations;

namespace FamilyMealPlanner.Models;

public class Recipe
{
    [Key]
    public int Id { get; set; }

    [Required(ErrorMessage = "Name cannot be blank")]
    [MinLength(1, ErrorMessage = "Name cannot be blank")]
    public string Name { get; set; }

    public string? Notes {get ; set;}
    public List<string>? Images { get; set; }
    public string? Description { get; set; }
    public List<string>? RecipeIngredients { get; set; }
    public List<string>? RecipeInstructions { get; set; } 
    public DateTime CreationDateTime {get; set; }
    public DateTime? LastUpdatedDateTime {get; set;} = DateTime.UtcNow;
    public string? DefaultImageUrl   { get; set; }
    public int AddedByUserId {get; set; }
}
