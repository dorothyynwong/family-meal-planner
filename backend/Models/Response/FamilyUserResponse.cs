using System.ComponentModel.DataAnnotations;
using FamilyMealPlanner.Enums;

namespace FamilyMealPlanner.Models;

public class FamilyUserResponse
{
    public int UserId{ get; set; }
    public string? UserNickName {get; set;}
    public string? AvatarColor {get; set;}
    public string? AvatarFgColor {get; set;}
    public string? AvatarUrl {get; set;}
    public int FamilyId{ get; set; }
    public string FamilyRole { get; set; }
    public bool IsApproved { get; set; }
}
