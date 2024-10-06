namespace FamilyMealPlanner.Models.Request;

public class UserLoginRequest
{
    public required string UserName { get; set; }
    public required string Password { get; set; }
}
