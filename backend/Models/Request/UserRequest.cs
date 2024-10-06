using System.ComponentModel.DataAnnotations;

namespace FamilyMealPlanner.Models;

public class UserRequest
{
    public string UserName { get; set; }
    public string Password { get; set; }
    public string Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
}
