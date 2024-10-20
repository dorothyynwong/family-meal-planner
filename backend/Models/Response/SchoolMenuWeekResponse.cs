using FamilyMealPlanner.Enums;

namespace FamilyMealPlanner.Models;

public class SchoolMenuWeekResponse
{
    public List<DateOnly> WeekCommencing {get; set;}
    public int SchoolMenuId {get; set;}
    public SchoolMenuStatus Status  {get; set;}
    public int FamilyId {get; set;}
    public int UserId {get; set;}
    public List<SchoolMeal> SchoolMeals {get; set;}
}