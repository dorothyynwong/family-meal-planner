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

public class PdfService() : IPdfService
{
    public List<string> ImportPdf(string filePath)
    {
        List<string> result = new List<string>();
        try
        {
            using (var pdf = PdfDocument.Open(@"C:\temp\schoolmenu2.pdf"))
            {
                var text = new StringBuilder();
                foreach (var page in pdf.GetPages())
                {
                    result.Add(page.Text);
                }
            }
            return result;
        }
        catch (Exception ex)
        {
            throw new Exception("Unable to import PDF", ex);
        }

    }
}