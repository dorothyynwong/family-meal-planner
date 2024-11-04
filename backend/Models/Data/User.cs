using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace FamilyMealPlanner.Models.Data;

public class User : IdentityUser<int>
{
    [Required]
    public string Nickname { get; set; }

    public ICollection<FamilyUser> FamilyUsers { get; set; }
    public string? AvatarColor {get; set;}
    public string? AvatarUrl {get; set;}
}
