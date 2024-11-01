using System.ComponentModel.DataAnnotations;

namespace FamilyMealPlanner.Models;
public class RefreshToken
{
    [Key]
    public int Id { get; set; }
    public string Token { get; set; }
    public string Username { get; set; }
    public DateTime ExpirationTime { get; set; }
}
