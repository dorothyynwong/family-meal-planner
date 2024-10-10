using FamilyMealPlanner.Models;
using FamilyMealPlanner.Models.Data;
using Microsoft.EntityFrameworkCore;
using NLog;


namespace FamilyMealPlanner.Services;

public interface IFamilyUserService
{
    Task<FamilyUser> GetFamilyUser(int familyId, int userId);
    Task<List<FamilyUserResponse>> GetFamilyUsersByUserId(int userId);
    Task<List<FamilyUserResponse>> GetFamilyUsersByFamilyId(int familyId);
    Task AddFamilyUser(FamilyUserRequest familyUserRequest, int userId);
    Task ApproveFamilyUser(int familyId, int userId);
    Task DeleteFamilyUser(int familyId, int userId);
}

public class FamilyUserService(FamilyMealPlannerContext context, IFamilyService familyService) : IFamilyUserService
{
    private readonly FamilyMealPlannerContext _context = context;
    private readonly IFamilyService _familyService = familyService;
    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

    public async Task<FamilyUser> GetFamilyUser(int familyId, int userId)
    {
        FamilyUser familyUser = await _context.FamilyUsers.SingleAsync(fu => fu.FamilyId == familyId && fu.UserId == userId);
        if (familyUser == null)
        {
            Logger.Error($"Family User relationship not found family Id: {familyId}, user Id: {userId}");
            throw new InvalidOperationException($"Family User relationship not found family Id: {familyId}, user Id: {userId}");
        }
        return familyUser;
    }

    public async Task<List<FamilyUserResponse>> GetFamilyUsersByUserId(int userId)
    {
       
        List<FamilyUser> familyUsers = await _context.FamilyUsers
                                                .Include(fu => fu.Family)
                                                .Include(fu => fu.User)  
                                                .Where(fu => fu.UserId == userId)  
                                                .ToListAsync();
                                                
        if (familyUsers == null || familyUsers.Count == 0)
        {
            Logger.Error($"No families for {userId}");
            throw new InvalidOperationException($"No families for {userId}");
        }

        List<FamilyUserResponse> familyUserResponses = new List<FamilyUserResponse>();

        foreach(FamilyUser familyUser in familyUsers)
        {
            FamilyUserResponse familyUserResponse = new FamilyUserResponse
            {
                FamilyId = familyUser.FamilyId,
                UserId = familyUser.UserId,
                FamilyRole = familyUser.FamilyRole,
                IsApproved = familyUser.IsApproved
            };

            familyUserResponses.Add(familyUserResponse);

        }

        return familyUserResponses;
    }

    public async Task<List<FamilyUserResponse>> GetFamilyUsersByFamilyId(int familyId)
    {
        List<FamilyUser> familyUsers = await _context.FamilyUsers
                                                .Include(fu => fu.Family)
                                                .Include(fu => fu.User)  
                                                .Where(fu => fu.FamilyId == familyId)  
                                                .ToListAsync();
                                                
        if (familyUsers == null || familyUsers.Count == 0)
        {
            Logger.Error($"No users for {familyId}");
            throw new InvalidOperationException($"No users for {familyId}");
        }

        List<FamilyUserResponse> familyUserResponses = new List<FamilyUserResponse>();

        foreach(FamilyUser familyUser in familyUsers)
        {
            FamilyUserResponse familyUserResponse = new FamilyUserResponse
            {
                FamilyId = familyUser.FamilyId,
                UserId = familyUser.UserId,
                FamilyRole = familyUser.FamilyRole,
                IsApproved = familyUser.IsApproved
            };

            familyUserResponses.Add(familyUserResponse);

        }

        return familyUserResponses;
    }

    public async Task AddFamilyUser(FamilyUserRequest familyUserRequest, int userId)
    {
        Family? family = await _familyService.GetFamilyByGuid(familyUserRequest.FamilyShareCode);
        if (family == null) 
        {
            Logger.Error($"Family not found");
            throw new InvalidOperationException("Family not found");
        }
        
        try
        {
            FamilyUser familyUser = new FamilyUser()
            {
                FamilyId = family.Id,
                UserId = userId,
                FamilyRole = familyUserRequest.FamilyRole,
                IsApproved = familyUserRequest.IsApproved ?? false
            };

            _context.FamilyUsers.Add(familyUser);
            await _context.SaveChangesAsync();
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

    public async Task ApproveFamilyUser(int familyId, int userId)
    {
        try
        {
            FamilyUser familyUser = await GetFamilyUser(familyId, userId);

            familyUser.IsApproved = true;

            _context.FamilyUsers.Update(familyUser);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            Logger.Error($"Database error on approving familyId {familyId} and userId {userId}: {ex.Message}");
            throw new Exception("An error occurred while updating the database.", ex);
        }
        catch (Exception ex)
        {
            Logger.Error($"Unexpected error on approving familyId {familyId} and userId {userId}: {ex.Message}");
            throw new Exception("Unexpected error while updating record to database", ex);
        }
    }

    public async Task DeleteFamilyUser(int familyId, int userId)
    {
        try
        {
            FamilyUser familyUser = await GetFamilyUser(familyId, userId);
            _context.FamilyUsers.Remove(familyUser);
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



