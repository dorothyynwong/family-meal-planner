using System.ComponentModel.DataAnnotations;
using FamilyMealPlanner.Enums;

namespace FamilyMealPlanner.Models;

public class FamilyUserRequest
{
    [Required]
    public int UserId{ get; set; }
    [Required]
    public int FamilyId{ get; set; }
    [Required]
    public FamilyRoleType FamilyRole { get; set; }
    public bool? IsApproved{ get; set; }
}
