using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using FamilyMealPlanner.Models.Data;
using FamilyMealPlanner.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace FamilyMealPlanner.Models;
public class SchoolMenuWeek
{
    public DateOnly? WeekCommercing { get; set; }

    [ForeignKey("SchoolMenu")]
    public int SchoolMenuId {get ; set;}

    public SchoolMenu SchoolMenu { get; set; }
}
