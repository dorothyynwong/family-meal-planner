using FamilyMealPlanner.Enums;
using FamilyMealPlanner.Models;
using Microsoft.EntityFrameworkCore;
using NLog;


namespace FamilyMealPlanner.Services;

public interface ISchoolMenuService
{
    Task AddSchoolMenu(SchoolMenuResponse schoolMenuResponse, string weekCommencings, int familyId, int userId);
    Task<List<SchoolMenu>> GetSchoolMenus(int familyId, int userId);
    Task<List<SchoolMenuWeek>> GetSchoolMenuByDate(int familyId, int userId, DateOnly menuDate);
}

public class SchoolMenuService(FamilyMealPlannerContext context) : ISchoolMenuService
{
    private readonly FamilyMealPlannerContext _context = context;
    public async Task AddSchoolMenu(SchoolMenuResponse schoolMenuResponse, string weekCommencings, int familyId, int userId)
    {
        var dates = weekCommencings.Split(",");

        foreach (var weekMenuResponse in schoolMenuResponse.WeekMenu)
        {
            SchoolMenu schoolMenu = new SchoolMenu
            {
                Status = SchoolMenuStatus.Draft,
                FamilyId = familyId,
                UserId = userId,
            };

            _context.SchoolMenus.Add(schoolMenu);
            await _context.SaveChangesAsync();
            int schoolMenuId = schoolMenu.Id;

            foreach( var weekCommence in dates)
            {
                SchoolMenuWeek schoolMenuWeek = new SchoolMenuWeek
                {
                    WeekCommercing = DateOnly.Parse(weekCommence),
                    SchoolMenuId = schoolMenuId
                };

                _context.SchoolMenuWeeks.Add(schoolMenuWeek);
                await _context.SaveChangesAsync();
                
            }

            foreach (var dayMenuResponse in weekMenuResponse.DayMenus)
            {
                if (!Enum.TryParse<DayType>(dayMenuResponse.Day, true, out var mealDay))
                    throw new InvalidOperationException("Invalid DayType");

                foreach (var mealResponse in dayMenuResponse.SchoolMeals)
                {
                    var mealName = mealResponse.MealName;
                    var mealCategory = mealResponse.Category;
                    var allergens = string.Join(", ", mealResponse.Allergens);
                    SchoolMeal schoolMeal = new SchoolMeal
                    {
                        Day = mealDay,
                        SchoolMenuId = schoolMenuId,
                        MealName = mealName,
                        Category = mealCategory,
                        Allergens = allergens
                    };

                    _context.SchoolMeals.Add(schoolMeal);
                    await _context.SaveChangesAsync();
                }
            }
        }
    }

    public async Task<List<SchoolMenu>> GetSchoolMenus(int familyId, int userId)
    {
        var schoolMenu = await _context.SchoolMenus
                                        .Include(schoolMenu => schoolMenu.SchoolMeals)
                                        .Where(schoolMenu => schoolMenu.FamilyId == familyId 
                                                            && schoolMenu.UserId == userId)
                                        .ToListAsync();

        return schoolMenu;
    }

    public async Task<List<SchoolMenuWeek>> GetSchoolMenuByDate(int familyId, int userId, DateOnly menuDate)
    {
        var schoolMenuWeeks = await _context.SchoolMenuWeeks
                                        .Include(sw => sw.SchoolMenu)
                                        .ThenInclude(sm => sm.SchoolMeals)
                                        .Where(sw => sw.WeekCommercing == menuDate)
                                        .ToListAsync();

        return schoolMenuWeeks;
    }
}