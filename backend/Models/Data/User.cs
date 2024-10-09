using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace FamilyMealPlanner.Models.Data;

public class User : IdentityUser<int>
{
    [Required]
    public string Email {get; set;}
    public string? Nickname { get; set; }

    public ICollection<FamilyUser> FamilyUsers { get; set; }
}
