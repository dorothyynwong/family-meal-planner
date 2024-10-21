using FamilyMealPlanner.Enums;
using FamilyMealPlanner.Models;
using Microsoft.EntityFrameworkCore;
using NLog;


namespace FamilyMealPlanner.Services;

public interface ISchoolMenuService
{
    Task<List<int>> AddSchoolMenu(SchoolMenuResponse schoolMenuResponse, string weekCommencings, int familyId, int userId);
    Task<List<SchoolMenu>> GetSchoolMenus(int familyId, int userId);
    Task<List<SchoolMenuWeek>> GetSchoolWeekMenuByDate(int familyId, int userId, DateOnly menuDate);
    Task<List<SchoolMeal>> GetSchoolMealsByDate(int familyId, int userId, DateOnly menuDate);
    Task<SchoolMenu> GetSchoolMenuById(int schoolMenuId);
    Task<List<SchoolMenuWeek>> GetWeekCommencingBySchoolMenuId(int schoolMenuId);
    Task UpdateSchoolMeal(SchoolMealUpdateRequest schoolMeal, int schoolMealId);
}

public class SchoolMenuService(FamilyMealPlannerContext context) : ISchoolMenuService
{
    private readonly FamilyMealPlannerContext _context = context;
    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();
    public async Task<List<int>> AddSchoolMenu(SchoolMenuResponse schoolMenuResponse, string weekCommencings, int familyId, int userId)
    {
        var dates = weekCommencings.Split(",");
        List<int> menuIds = new List<int>();

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
            menuIds.Add(schoolMenuId);

            foreach (var weekCommence in dates)
            {
                SchoolMenuWeek schoolMenuWeek = new SchoolMenuWeek
                {
                    WeekCommencing = DateOnly.Parse(weekCommence),
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
        return menuIds;
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

    public async Task<SchoolMenu> GetSchoolMenuById(int schoolMenuId)
    {
        var schoolMenu = await _context.SchoolMenus
                                       .Include(schoolMenu => schoolMenu.SchoolMeals)
                                       .SingleOrDefaultAsync(schoolMenu => schoolMenu.Id == schoolMenuId);


        return schoolMenu;
    }


    public async Task<List<SchoolMenuWeek>> GetWeekCommencingBySchoolMenuId(int schoolMenuId)
    {
        var schoolMenuWeek = await _context.SchoolMenuWeeks
                                        .Where(sw => sw.SchoolMenuId == schoolMenuId)
                                        .ToListAsync();

        return schoolMenuWeek;
    }

    public async Task<List<SchoolMenuWeek>> GetSchoolWeekMenuByDate(int familyId, int userId, DateOnly menuDate)
    {
        var dayOfWeek = menuDate.DayOfWeek;
        DateOnly monday = menuDate.AddDays(-(int)dayOfWeek + (int)DayOfWeek.Monday);

        var schoolMenuWeeks = await _context.SchoolMenuWeeks
                                        .Include(sw => sw.SchoolMenu)
                                        .ThenInclude(sm => sm.SchoolMeals)
                                        .Where(sw => sw.WeekCommencing == monday)
                                        .ToListAsync();


        return schoolMenuWeeks;
    }

    public async Task<List<SchoolMeal>> GetSchoolMealsByDate(int familyId, int userId, DateOnly menuDate)
    {
        var dayOfWeek = menuDate.DayOfWeek;
        DayType day = (DayType)dayOfWeek;

        DateOnly monday = menuDate.AddDays(-(int)dayOfWeek + (int)DayOfWeek.Monday);

        var schoolMeals = await _context.SchoolMenuWeeks
                                .Include(sw => sw.SchoolMenu)
                                .ThenInclude(sm => sm.SchoolMeals)
                                .Where(sw => sw.WeekCommencing == monday)
                                .SelectMany(sw => sw.SchoolMenu.SchoolMeals)
                                .Where(sm => sm.Day == day)
                                .ToListAsync();

        return schoolMeals;
    }

    public async Task UpdateSchoolMeal(SchoolMealUpdateRequest schoolMeal, int schoolMealId)
    {
        SchoolMeal meal =  _context.SchoolMeals.SingleOrDefault(sm => sm.Id == schoolMealId);
        if (meal == null)
        {
            Logger.Error($"School meal {schoolMealId} not found");
            throw new ArgumentException($"School meal {schoolMealId} not found");
        }

        meal.MealName = schoolMeal.MealName != null && schoolMeal.MealName != "" ? schoolMeal.MealName : meal.MealName;
        meal.Day = schoolMeal.Day != null && schoolMeal.Day != 0 ? (DayType)schoolMeal.Day : meal.Day;
        meal.Category = schoolMeal.Category != null && schoolMeal.Category != "" ? schoolMeal.Category : meal.Category;
        meal.Allergens = schoolMeal.Allergens != null && schoolMeal.Allergens != "" ? schoolMeal.Allergens : meal.Allergens;

        _context.SchoolMeals.Update(meal);
        await _context.SaveChangesAsync();
    }
}