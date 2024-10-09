using System.ComponentModel.DataAnnotations;

namespace FamilyMealPlanner.Models;

public class UserUpdateRequest
{
    public string? Nickname { get; set; }
}
