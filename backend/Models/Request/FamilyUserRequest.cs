using System.ComponentModel.DataAnnotations;
using FamilyMealPlanner.Enums;

namespace FamilyMealPlanner.Models;

public class FamilyUserRequest
{
    [Required]
    public Guid FamilyShareCode { get; set; }
    public string? FamilyRole {get; set;}
    public bool? IsApproved { get; set; }

    public FamilyRoleType GetFamilyRoleTypeEnum()
    {
        if (Enum.TryParse<FamilyRoleType>(FamilyRole, true, out var familyRoleTypeEnum))
        {
            return familyRoleTypeEnum;
        }

        throw new ArgumentException("Invalid Family Role Type");
    }
}
