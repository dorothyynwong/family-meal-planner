using System.ComponentModel.DataAnnotations;

namespace FamilyMealPlanner.Models;

public class FamilyRequest
{
    [Required]
    public string FamilyName { get; set; }
}
