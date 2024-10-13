using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using FamilyMealPlanner.Models.Data;
using FamilyMealPlanner.Enums;

namespace FamilyMealPlanner.Models;
public class SchoolMenu
{
    [Key]
    public int Id { get; set; }

    public DateOnly WeekCommercing { get; set; }

    public ICollection<SchoolMeal> SchoolMeals { get; set; }

    public SchoolMenuStatus Status { get; set; }

    public int FamilyId { get; set; }
    public int UserId { get; set; }

    public Family Family { get; set; }
    public User User { get; set; }
}
