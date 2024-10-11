using System.ComponentModel.DataAnnotations;

namespace FamilyMealPlanner.Models;

public class FamilyRoleUpdateRequest
{
    [Required]
    public int FamilyId { get; set; }
    [Required]
    public int UserId { get; set; }
    [Required]
    public string FamilyRole { get; set; }
}
