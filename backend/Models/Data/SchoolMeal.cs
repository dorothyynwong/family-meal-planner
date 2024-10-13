using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FamilyMealPlanner.Enums;

namespace FamilyMealPlanner.Models;

public class SchoolMeal
{
    [Key]
    public int Id { get; set; }
    [ForeignKey("SchoolMenu")]
    public int SchoolMenuId { get; set; }

    public SchoolMenu SchoolMenu { get; set; }

    public DayType Day { get; set; }

    public string MealName { get; set; }

    public string Category { get; set; }

    public List<string> Allergens { get; set; }


}

