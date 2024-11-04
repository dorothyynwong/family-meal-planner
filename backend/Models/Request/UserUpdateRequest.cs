using System.ComponentModel.DataAnnotations;

namespace FamilyMealPlanner.Models;

public class UserUpdateRequest
{
    public string? Nickname { get; set; }
    public string? AvatarColor { get; set; }
    public string? AvatarUrl    { get; set; }
}
