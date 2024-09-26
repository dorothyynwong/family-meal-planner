using System.ComponentModel.DataAnnotations;

namespace FamilyMealPlanner.Models;

public class Recipe
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string Name { get; set; }

    public string? Notes {get ; set;}
    public List<string>? Images { get; set; }
    public string? Description { get; set; }
    public List<string>? RecipeIngredients { get; set; }
    public List<string>? RecipeInstructions { get; set; } 
}
