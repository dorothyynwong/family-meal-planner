
using System.ComponentModel.DataAnnotations;

namespace FamilyMealPlanner.Models;

public class Family
{
    [Key]
    public int Id { get; set; }
    public string? Name {get; set;}
}