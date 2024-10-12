using System.Text;
using FamilyMealPlanner.Models;
using Microsoft.EntityFrameworkCore;
using NLog;
using UglyToad.PdfPig;
using UglyToad.PdfPig.DocumentLayoutAnalysis.TextExtractor;


namespace FamilyMealPlanner.Services;

public interface IPdfService
{
    List<string> ImportPdf(string filePath);
}

public class PdfService(FamilyMealPlannerContext context) : IPdfService
{
    private readonly FamilyMealPlannerContext _context = context;
    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

    // public string ImportPdf(string filePath)
    public List<string> ImportPdf(string filePath)
    {
        List<string> result = new List<string>();
        using (var pdf = PdfDocument.Open(@"C:\temp\schoolmenu.pdf"))
        {
            var text = new StringBuilder();
            foreach (var page in pdf.GetPages())
            {
                // text.AppendLine(page.Text);
                result.Add(page.Text);

            }
            // return text.ToString();
        }
        return result;
    }
}