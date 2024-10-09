using Microsoft.AspNetCore.Identity;

namespace FamilyMealPlanner.Models.Data;

public class User : IdentityUser<int>
{
    public string? Nickname { get; set; }

    public ICollection<FamilyUser> FamilyUsers { get; set; }
}
