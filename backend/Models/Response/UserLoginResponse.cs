using System.ComponentModel.DataAnnotations;
using FamilyMealPlanner.Enums;

namespace FamilyMealPlanner.Models;

public class UserLoginResponse
{
    public int Id { get; set; }
    public string UserName {get; set;}
    public string AccessToken {get; set;}
    public string RefreshToken {get; set;}

    public string? Nickname {get; set;}

}
