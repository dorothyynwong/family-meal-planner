using System.ComponentModel.DataAnnotations;
using FamilyMealPlanner.Enums;
using FamilyMealPlanner.Models.Data;

namespace FamilyMealPlanner.Models;

public class FamilyResponse
{
    public int FamilyId {get; set;}
    public int UserId {get; set;}
    public string FamilyName {get; set;}
    public Guid FamilyShareCode {get; set;}
    public string FamilyRole {get; set;}
    public List<FamilyUserResponse> FamilyUsers {get; set;}

}
