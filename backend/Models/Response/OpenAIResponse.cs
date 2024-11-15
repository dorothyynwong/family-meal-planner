using System.Text.Json.Serialization;

namespace FamilyMealPlanner.Models;

public class OpenAIResponse
{
    [JsonPropertyName("id")]
    public string Id { get; set; }

    [JsonPropertyName("object")]
    public string Object { get; set; }

    [JsonPropertyName("created")]
    public long Created { get; set; }

    [JsonPropertyName("model")]
    public string Model { get; set; }

    [JsonPropertyName("choices")]
    public List<Choice> Choices { get; set; }

    [JsonPropertyName("usage")]
    public Usage Usage { get; set; }
}

public class Choice
{
    [JsonPropertyName("index")]
    public int Index { get; set; }

    [JsonPropertyName("message")]
    public Message Message { get; set; }

    [JsonPropertyName("logprobs")]
    public object Logprobs { get; set; }

    [JsonPropertyName("finish_reason")]
    public string FinishReason { get; set; }
}

public class Message
{
    [JsonPropertyName("role")]
    public string Role { get; set; }

    [JsonPropertyName("content")]
    public string Content { get; set; }
}

public class Usage
{
    [JsonPropertyName("prompt_tokens")]
    public int PromptTokens { get; set; }

    [JsonPropertyName("completion_tokens")]
    public int CompletionTokens { get; set; }

    [JsonPropertyName("total_tokens")]
    public int TotalTokens { get; set; }

    [JsonPropertyName("prompt_tokens_details")]
    public TokenDetails PromptTokensDetails { get; set; }

    [JsonPropertyName("completion_tokens_details")]
    public TokenDetails CompletionTokensDetails { get; set; }
}

public class TokenDetails
{
    [JsonPropertyName("cached_tokens")]
    public int CachedTokens { get; set; }

    [JsonPropertyName("reasoning_tokens")]
    public int ReasoningTokens { get; set; }
}

public class SchoolMenuResponse
{
    [JsonPropertyName("week_menu")]
    public List<WeekMenuResponse> WeekMenu { get; set; }
}

public class WeekMenuResponse
{
    [JsonPropertyName("days")]
    public List<DayMenuResponse> DayMenus {get; set;}
}

public class DayMenuResponse
{
    [JsonPropertyName("day")]
    public string Day { get; set; }

    [JsonPropertyName("meals")]
    public List<SchoolMealResponse> SchoolMeals { get; set; }
}

public class SchoolMealResponse
{
    [JsonPropertyName("meal_name")]
    public string MealName { get; set; }

    [JsonPropertyName("category")]
    public string Category { get; set; }

    [JsonPropertyName("allergens")]
    public List<string> Allergens { get; set; }
}
