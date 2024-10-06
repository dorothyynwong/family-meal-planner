using System.ComponentModel.DataAnnotations;

namespace FamilyMealPlanner.Models;

public class UserRequest
{
    [Required]
    [StringLength(256, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 256 characters.")]
    public string UserName { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long.")]
    public string Password { get; set; }

    [Required]
    [EmailAddress(ErrorMessage = "Invalid email format.")]
    public string Email { get; set; }
    
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
}
