using System.ComponentModel.DataAnnotations;

namespace FamilyMealPlanner.Models;

public class FamilyShareCodeRequest
{
    [Required]
    public int FamilyId {get; set;}
    [Required]
    public string SenderName {get; set;}
    [Required]
    public string RecipentName {get; set;}
    [Required]
    public string RecipentEmail {get; set;}
}