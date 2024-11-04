using System.ComponentModel.DataAnnotations;
using FamilyMealPlanner.Enums;

namespace FamilyMealPlanner.Models;

public class UserLoginResponse
{
    public int Id { get; set; }
    public string Email{get; set;}
    public string AccessToken {get; set;}
    public string RefreshToken {get; set;}

    public string? Nickname {get; set;}
    public string? AvatarColor {get; set;}
    public string? AvatarUrl {get; set;}
    public string? AvatarFgColor {get; set;}

}
