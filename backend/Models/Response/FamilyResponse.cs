using System.ComponentModel.DataAnnotations;
using FamilyMealPlanner.Enums;
using FamilyMealPlanner.Models.Data;

namespace FamilyMealPlanner.Models;

public class FamilyResponse
{
    public int Id {get; set;}
    public string FamilyName {get; set;}
    public Guid FamilyShareCode {get; set;}
    public List<FamilyUserResponse> FamilyUsers {get; set;}

}
