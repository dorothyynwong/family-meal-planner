
using System.ComponentModel.DataAnnotations;

namespace FamilyMealPlanner.Models;

public class Family
{
    [Key]
    public int Id { get; set; }
    public string? FamilyName {get; set;}
    public string EncryptedGuid {get; set;}

    public ICollection<FamilyUser> FamilyUsers { get; set; }
}