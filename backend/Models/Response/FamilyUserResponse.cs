using System.ComponentModel.DataAnnotations;
using FamilyMealPlanner.Enums;

namespace FamilyMealPlanner.Models;

public class FamilyUserResponse
{
    public int UserId{ get; set; }
    public int FamilyId{ get; set; }
    public FamilyRoleType FamilyRole { get; set; }
    public bool IsApproved { get; set; }
}
