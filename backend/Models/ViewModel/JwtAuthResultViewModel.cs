namespace FamilyMealPlanner.Models;

public class JwtAuthResultViewModel
{
    public string AccessToken {get; set;}
    public RefreshTokenViewModel RefreshToken {get; set;}

}
