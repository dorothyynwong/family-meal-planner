using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FamilyMealPlanner.Enums;

namespace FamilyMealPlanner.Models;

public class SchoolMealUpdateRequest
{
    public int? SchoolMenuId { get; set; }

    public DayType? Day { get; set; }

    public string? MealName { get; set; }

    public string? Category { get; set; }

    public string? Allergens { get; set; }

}

