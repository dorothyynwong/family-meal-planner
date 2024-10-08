namespace FamilyMealPlanner.Models;

public class RefreshTokenViewModel
{
    public string UserName {get; set;}
    public string TokenString {get; set;}
    public DateTime ExpireAt {get; set;}

}
