using System.ComponentModel.DataAnnotations;
using FamilyMealPlanner.Enums;

namespace FamilyMealPlanner.Models;

public class FamilyUserRequest
{
    [Required]
    public Guid FamilyShareCode{ get; set; }
    public FamilyRoleType FamilyRole { get; set; }
    public bool? IsApproved{ get; set; }
}
