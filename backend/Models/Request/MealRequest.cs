using System.ComponentModel.DataAnnotations;
using FamilyMealPlanner.Enums;

namespace FamilyMealPlanner.Models;

public class MealRequest
{
    [Required]
    public DateOnly Date {get; set;}

    public string? Name {get; set;}

    public int? RecipeId {get; set;}

    public int? UserId {get; set;}
    
    public int? FamilyId {get; set;}

    [Required]
    public string MealType  {get; set;}

    [Required]
    public int AddedByUserId {get; set;}

    public MealType GetMealTypeEnum()
    {
        if (Enum.TryParse<MealType>(MealType, true, out var mealTypeEnum))
        {
            return mealTypeEnum;
        }

        throw new ArgumentException("Invalid MealType");
    }

}
