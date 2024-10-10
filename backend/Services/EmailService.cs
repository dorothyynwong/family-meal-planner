using NLog;
using SendGrid;
using SendGrid.Helpers.Mail;

public interface IEmailService
{
    Task SendEmailAsync(string email, string subject, string message);
}


public class EmailService(IConfiguration configure) : IEmailService
{
    private readonly IConfiguration _configure = configure;
    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();
    public async Task SendEmailAsync(string email, string subject, string message)
    {
        var apiKey = _configure["SendGrid:API_KEY"];
        var client = new SendGridClient(apiKey);
        var from = new EmailAddress("dorothywyn.familyplanner@gmail.com", "Family Meal Planner");
        var to = new EmailAddress(email, "Example User");
        var plainTextContent = "and easy to do anywhere with C#.";
        var htmlContent = "<strong>and easy to do anywhere with C#.</strong>";
        var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
        var response = await client.SendEmailAsync(msg);
        var responseBody = await response.Body.ReadAsStringAsync();
        if (response.StatusCode != System.Net.HttpStatusCode.Accepted)
        {
            Logger.Error(responseBody);
            throw new InvalidOperationException("Failed to send email.");
        }
        Logger.Debug(responseBody);
    }
}