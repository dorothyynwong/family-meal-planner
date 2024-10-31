namespace FamilyMealPlanner.Models;

public class ListResponse<T>
{
    private readonly string _path;
    private readonly string _filters;

    public IEnumerable<T> Items { get; }
    public int TotalNumberOfItems { get; }
    public int Page { get; }
    public int PageSize { get; }

    public string NextPage => !HasNextPage() ? null : $"/{_path}?page={Page + 1}&pageNumber={PageSize}{_filters}";

    public string PreviousPage => Page <= 1 ? null : $"/{_path}?page={Page - 1}&pageNumber={PageSize}{_filters}";

    public ListResponse(SearchRequest search, IEnumerable<T> items, int totalNumberOfItems, string path)
    {
        Items = items;
        TotalNumberOfItems = totalNumberOfItems;
        Page = search.Page;
        PageSize = search.PageSize;
        _path = path;
        _filters = search.Filters;
    }

    private bool HasNextPage()
    {
        return Page * PageSize < TotalNumberOfItems;
    }
}

public class RecipeListResponse : ListResponse<RecipeResponse>
{
    private RecipeListResponse(SearchRequest search, IEnumerable<RecipeResponse> items, int totalNumberOfItems)
        : base(search, items, totalNumberOfItems, "recipes") { }

    public static RecipeListResponse Create(SearchRequest search, IEnumerable<RecipeResponse> recipes, int totalNumberOfItems)
    {
        return new RecipeListResponse(search, recipes, totalNumberOfItems);
    }
}