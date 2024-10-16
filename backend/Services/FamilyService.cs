using FamilyMealPlanner.Models;
using Microsoft.EntityFrameworkCore;
using NLog;


namespace FamilyMealPlanner.Services;

public interface IFamilyService
{
    Task<int> AddFamilyWithUser(FamilyRequest familyRequest, int userId);
    Task<Family> GetFamilyById(int familyId);
    Task<Family?> GetFamilyByGuid(Guid guid);
    Task<List<FamilyResponse>> GetFamilyByUserId(int userId);
    Task UpdateFamily(FamilyRequest familyRequest, int familyId);
    Task DeleteFamily(int familyId);
}

public class FamilyService(FamilyMealPlannerContext context) : IFamilyService
{
    private readonly FamilyMealPlannerContext _context = context;
    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

    private void ValidateRequest(FamilyRequest familyRequest, int userId)
    {
        if (userId <=0)
        {
            throw new ArgumentException("User Id is required");
        }

        if (familyRequest == null)
        {
            throw new ArgumentNullException(nameof(familyRequest), "Request cannot be null");
        }

        if (familyRequest.FamilyName == null || familyRequest.FamilyName == "")
        {
            throw new ArgumentException("Name is required");
        }
    }


    public async Task<int> AddFamilyWithUser(FamilyRequest familyRequest, int userId)
    {
        ValidateRequest(familyRequest, userId);

        Guid guid;
        int counter = 5;
        Family? familyGuid = null;
        do
        {
            guid = Guid.NewGuid();
            familyGuid = await GetFamilyByGuid(guid);
            counter--;
        }
        while (familyGuid != null && counter > 0);

        if (counter <= 0)
        {
            Logger.Error("Unable to generate unique Guid");
            throw new InvalidOperationException("Unable to generate unique Guid");
        }

        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            Family family = new Family()
            {
                FamilyName = familyRequest.FamilyName,
                FamilyShareCode = guid
            };

            _context.Families.Add(family);
            await _context.SaveChangesAsync();

            FamilyUser familyUser = new FamilyUser()
            {
                FamilyId = family.Id,
                UserId = userId,
                FamilyRole = Enums.FamilyRoleType.Cook,
                IsApproved = true,
            };

            _context.FamilyUsers.Add(familyUser);
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();
            return family.Id;
        }
        catch (DbUpdateException ex)
        {
            await transaction.RollbackAsync();
            Logger.Error($"Database error: {ex.Message}");
            throw new Exception("An error occurred while updating the database.", ex);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            Logger.Error($"Unexpected error: {ex.Message}");
            throw new Exception("Unexpected error while adding record to database", ex);
        }

    }

    public async Task<Family> GetFamilyById(int familyId)
    {
        Logger.Debug(familyId);
        Family family = await _context.Families.SingleAsync(family => family.Id == familyId);
        if (family == null)
        {
            Logger.Error($"Family not found {familyId}");
            throw new InvalidOperationException($"Family with id {familyId} is not found.");
        }
        return family;
    }

    public async Task<Family?> GetFamilyByGuid(Guid guid)
    {
        Family? family = await _context.Families.FirstOrDefaultAsync(family => family.FamilyShareCode == guid);
        return family;
    }


    public async Task<List<FamilyResponse>> GetFamilyByUserId(int userId)
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

        List<FamilyResponse> familyResponses = new List<FamilyResponse>();
        foreach (Family family in families)
        {
            FamilyResponse familyResponse = new FamilyResponse
            {
                FamilyId = family.Id,
                FamilyName = family.FamilyName,
                FamilyShareCode = family.FamilyShareCode
            };
            familyResponses.Add(familyResponse);

        }

        return familyResponses;
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



