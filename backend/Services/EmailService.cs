using NLog;
using SendGrid;
using SendGrid.Helpers.Mail;

public interface IEmailService
{
    Task SendEmailAsync(string recipentEmail, string recipentName, string subject, string plainTextContent, string htmlContent);
}


public class EmailService(IConfiguration configure) : IEmailService
{
    private readonly IConfiguration _configure = configure;
    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();
    public async Task SendEmailAsync(string recipentEmail, string recipentName, string subject, string plainTextContent, string htmlContent)
    {
        var apiKey = _configure["SendGrid_API_Key"];
        var client = new SendGridClient(apiKey);

        var from = new EmailAddress(_configure["SendGrid_Email"], "Family Meal Planner");
        var to = new EmailAddress(recipentEmail, recipentName);

        var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
        var response = await client.SendEmailAsync(msg);
        var responseBody = await response.Body.ReadAsStringAsync();
        if (response.StatusCode != System.Net.HttpStatusCode.Accepted)
        {
            Logger.Error(responseBody);
            throw new InvalidOperationException("Failed to send email.");
        }
    }
}