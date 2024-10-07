using System.ComponentModel.DataAnnotations;
using FamilyMealPlanner.Enums;

namespace FamilyMealPlanner.Models;

public class FamilyUserRequest
{
    [Required]
    public int UserId{ get; set; }
    [Required]
    public Guid FamilyShareCode{ get; set; }
    [Required]
    public FamilyRoleType FamilyRole { get; set; }
    public bool? IsApproved{ get; set; }
}
