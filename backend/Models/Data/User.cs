using Microsoft.AspNetCore.Identity;

namespace FamilyMealPlanner.Models.Data;

public class User : IdentityUser<int>
{
    public string? FirstName { get; set; }
    public string? LastName { get; set;}

    public ICollection<FamilyUser> FamilyUsers { get; set; }
}
