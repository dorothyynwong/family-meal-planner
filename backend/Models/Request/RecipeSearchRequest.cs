namespace FamilyMealPlanner.Models;
public class SearchRequest
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public virtual string Filters => "";
}


public class RecipeSearchRequest : SearchRequest
{
    public int? AddedByUserId {get; set;}
    public int? FamilyId{ get; set; }
    public string? RecipeName {get; set;}
    public string? OrderBy  {get; set;}
    public override string Filters
    {
        get
        {
            var filters = "";

            if (RecipeName != null)
            {
                filters += $"&recipeName={RecipeName}";
            }
            
            if (AddedByUserId != null)
            {
                filters += $"&addedByUserId={AddedByUserId}";
            }
            
            if (FamilyId != null)
            {
                filters += $"&familyId={FamilyId}";
            }

            return filters;
        }
    }
}