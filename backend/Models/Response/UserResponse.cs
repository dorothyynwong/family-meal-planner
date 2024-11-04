using System.ComponentModel.DataAnnotations;
using FamilyMealPlanner.Enums;

namespace FamilyMealPlanner.Models;

public class UserResponse
{
    public int Id {get; set;}
    public string Email {get; set;}

    public string? Nickname {get; set;}
    public string? AvatarColor {get; set;}
    public string? AvatarUrl {get; set;}

    public List<int> FamilyId {get; set;}

}
