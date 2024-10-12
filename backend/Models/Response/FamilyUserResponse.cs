using System.ComponentModel.DataAnnotations;
using FamilyMealPlanner.Enums;

namespace FamilyMealPlanner.Models;

public class FamilyUserResponse
{
    public int UserId{ get; set; }
    public string? UserNickName {get; set;}
    public int FamilyId{ get; set; }
    public string FamilyRole { get; set; }
    public bool IsApproved { get; set; }
}
