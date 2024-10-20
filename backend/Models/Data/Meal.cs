using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FamilyMealPlanner.Enums;
using FamilyMealPlanner.Models.Data;

namespace FamilyMealPlanner.Models;

public class Meal
{
    [Key]
    public int Id { get; set; }

    [DataType(DataType.Date)] 
    public DateOnly Date {get; set;}

    [ForeignKey("Recipe")]
    public int? RecipeId {get; set;}
    [ForeignKey("SchoolMeal")]
    public int? SchoolMealId {get; set;}

    [ForeignKey("User")]
    public int? UserId {get; set;}
    
    [ForeignKey("Family")]
    public int? FamilyId {get; set;}

    [Required]
    public MealType MealType  {get; set;}

    [Required]
    public int AddedByUserId {get; set;}
    public string? Notes {get; set;}

    public Recipe? Recipe {get; set;}
    public SchoolMeal? SchoolMeal {get; set;}
    public User? User {get; set;}
    public Family? Family {get; set;}
    public User AddedByUser {get; set;}
}