using System.ComponentModel.DataAnnotations;
using FamilyMealPlanner.Enums;

namespace FamilyMealPlanner.Models;

public class UserResponse
{
    public int Id {get; set;}
    public string UserName {get; set;}
    public string Email {get; set;}

    public string? FirstName {get; set;}
    public string? LastName {get; set;}
    public List<int> FamilyId {get; set;}

}
