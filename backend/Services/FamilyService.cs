using FamilyMealPlanner.Models;
using Microsoft.EntityFrameworkCore;
using NLog;


namespace FamilyMealPlanner.Services;

public interface IFamilyService
{
    Task<int> AddFamily(FamilyRequest familyRequest);
    Task<Family> GetFamilyById(int familyId);
    Task<List<Family>> GetFamilyByUserId(int userId);
    Task UpdateFamily(FamilyRequest familyRequest, int familyId);
    Task DeleteFamily(int familyId);
}

public class FamilyService(FamilyMealPlannerContext context) : IFamilyService
{
    private readonly FamilyMealPlannerContext _context = context;
    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

    public async Task<int> AddFamily(FamilyRequest familyRequest)
    {

        try
        {
            Family family = new Family()
            {
                FamilyName = familyRequest.FamilyName,
            };

            _context.Families.Add(family);
            await _context.SaveChangesAsync();
            return family.Id;
        }
        catch (DbUpdateException ex)
        {
            Logger.Error($"Database error: {ex.Message}");
            throw new Exception("An error occurred while updating the database.", ex);
        }
        catch (Exception ex)
        {
            Logger.Error($"Unexpected error: {ex.Message}");
            throw new Exception("Unexpected error while adding record to database", ex);
        }

    }

    public async Task<Family> GetFamilyById(int familyId)
    {
        Family family = await _context.Families.SingleAsync(family => family.Id == familyId);
        if (family == null)
        {
            Logger.Error($"Family not found {familyId}");
            throw new InvalidOperationException($"Family with id {familyId} is not found.");
        }
        return family;
    }

    public async Task<List<Family>> GetFamilyByUserId(int userId)
    {
        List<Family> families = await _context.Families
                                                .Include(family => family.FamilyUsers)  
                                                .Where(family => family.FamilyUsers.Any(fu => fu.UserId == userId))  
                                                .ToListAsync();
                                                
        if (families == null || families.Count == 0)
        {
            Logger.Error($"No families for {userId}");
            throw new InvalidOperationException($"No families for {userId}");
        }

        return families;
    }

    public async Task UpdateFamily(FamilyRequest familyRequest, int familyId)
    {
        try
        {
            Family family = await GetFamilyById(familyId);

            family.Id = familyId;
            family.FamilyName = familyRequest.FamilyName;

            _context.Families.Update(family);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            Logger.Error($"Database error on familyId {familyId}: {ex.Message}");
            throw new Exception("An error occurred while updating the database.", ex);
        }
        catch (Exception ex)
        {
            Logger.Error($"Unexpected error on familyId {familyId}: {ex.Message}");
            throw new Exception("Unexpected error while updating record to database", ex);
        }
    }

    public async Task DeleteFamily(int familyId)
    {
        try
        {
            Family family = await GetFamilyById(familyId);
            _context.Families.Remove(family);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            Logger.Error($"Database error on familyId {familyId}: {ex.Message}");
            throw new Exception("An error occurred while updating the database.", ex);
        }
        catch (Exception ex)
        {
            Logger.Error($"Unexpected error on familyId {familyId}: {ex.Message}");
            throw new Exception("Unexpected error while deleting record to database", ex);
        }
    }

}



