using System.ComponentModel.DataAnnotations;

namespace FamilyMealPlanner.Models;

public class UserRegisterRequest
{
    [Required]
    [EmailAddress(ErrorMessage = "Invalid email format.")]
    public string Email { get; set; }
    [Required]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long.")]
    public string Password { get; set; }
    
    public string? Nickname { get; set; }
    public string? FamilyCode { get; set; }
    public string? AvatarColor { get; set; }
    public string? AvatarUrl { get; set; }
    public string? AvatarFgColor {get; set;}
}
