using System.ComponentModel.DataAnnotations;
using FamilyMealPlanner.Enums;

namespace FamilyMealPlanner.Models;

public class MealRequest
{
    [Required]
    public DateTime Date {get; set;}

    public string? Name {get; set;}

    public int? RecipeId {get; set;}

    public int? UserId {get; set;}
    
    public int? FamilyId {get; set;}

    [Required]
    public MealType MealType  {get; set;}

    [Required]
    public int AddedByUserId {get; set;}

}
