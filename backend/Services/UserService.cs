using FamilyMealPlanner.Models;
using FamilyMealPlanner.Models.Data;
using Microsoft.EntityFrameworkCore;
using NLog;


namespace FamilyMealPlanner.Services;

public interface IUserService
{
    Task<User> GetUserById(int userId);
    Task<List<UserResponse>> GetUserByFamilyId(int familyId);
    Task UpdateUser(UserUpdateRequest userRequest, int userId);
    Task DeleteUser(int userId);
}

public class UserService(FamilyMealPlannerContext context) : IUserService
{

    private readonly FamilyMealPlannerContext _context = context;
    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

    public async Task<User> GetUserById(int userId)
    {
        User user = await _context.Users.SingleAsync(user => user.Id == userId);
        if (user == null)
        {
            Logger.Error($"User not found {userId}");
            throw new InvalidOperationException($"User with id {userId} is not found.");
        }
        return user;
    }

    public async Task<List<UserResponse>> GetUserByFamilyId(int familyId)
    {
        List<User> users= await _context.Users
                                                .Include(user => user.FamilyUsers)
                                                .Where(user => user.FamilyUsers.Any(fu => fu.FamilyId == familyId))  
                                                .ToListAsync();
        if (users== null || users.Count == 0)
        {
            Logger.Error($"No users for family {familyId}");
            throw new InvalidOperationException($"No recipes for family {familyId}");
        }

        List<UserResponse> userResponses = new();
        foreach(User user in users)
        {
            UserResponse userResponse = new UserResponse() {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
            };
            userResponses.Add(userResponse);
        }

        return userResponses;
    }

    public async Task UpdateUser(UserUpdateRequest userRequest, int userId)
    {
        try
        {
            User user= await GetUserById(userId);

            user.Id = userId;
            user.FirstName = userRequest.FirstName;
            user.LastName = userRequest.LastName;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            Logger.Error($"Database error on userId {userId}: {ex.Message}");
            throw new Exception("An error occurred while updating the database.", ex);
        }
        catch (Exception ex)
        {
            Logger.Error($"Unexpected error on recipeId {userId}: {ex.Message}");
            throw new Exception("Unexpected error while updating record to database", ex);
        }
    }

    public async Task DeleteUser(int userId)
    {
        try
        {
            User user = await GetUserById(userId);
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            Logger.Error($"Database error on userId {userId}: {ex.Message}");
            throw new Exception("An error occurred while updating the database.", ex);
        }
        catch (Exception ex)
        {
            Logger.Error($"Unexpected error on userId {userId}: {ex.Message}");
            throw new Exception("Unexpected error while deleting record to database", ex);
        }
    }
}