using System.ComponentModel.DataAnnotations.Schema;
using FamilyMealPlanner.Enums;
using FamilyMealPlanner.Models.Data;

namespace FamilyMealPlanner.Models;

public class FamilyUser
{
    [ForeignKey("User")]
    public int UserId { get; set; }

    [ForeignKey("Family")]
    public int FamilyId { get; set; }
    public FamilyRoleType FamilyRole { get; set; }
    public User User { get; set; }
    public Family Family  { get; set; }
}