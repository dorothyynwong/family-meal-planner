using System.ComponentModel.DataAnnotations;

namespace FamilyMealPlanner.Models;

public class UserUpdateRequest
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
}
