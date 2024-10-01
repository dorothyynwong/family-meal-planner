using System.ComponentModel.DataAnnotations;
using FamilyMealPlanner.Enums;

namespace FamilyMealPlanner.Models;

public class MealResponse
{
    public int Id {get; set;}
    public DateOnly Date {get; set;}

    public string? Name {get; set;}

    public int? RecipeId {get; set;}

    public int? UserId {get; set;}
    
    public int? FamilyId {get; set;}

    public string MealType  {get; set;}

    public int AddedByUserId {get; set;}

}
