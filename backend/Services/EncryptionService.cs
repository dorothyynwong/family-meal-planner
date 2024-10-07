using Microsoft.AspNetCore.DataProtection;
using NLog;
using System;


public interface IEncryptionService
{
    string EncryptGuid(Guid guid);
    Guid DecryptGuid(string encryptedGuid);
}


public class EncryptionService : IEncryptionService
{
    private readonly IDataProtector _dataProtector;
    NLog.ILogger Logger = LogManager.GetCurrentClassLogger();

    public EncryptionService(IDataProtectionProvider dataProtectionProvider)
    {
        _dataProtector = dataProtectionProvider.CreateProtector("GuidEncryptionService");
    }

    public string EncryptGuid(Guid guid)
    {
        if (guid == Guid.Empty)
        {
            Logger.Error("GUID is empty");
            throw new ArgumentException("GUID cannot be empty.", nameof(guid));
        }

        try
        {
            string guidString = guid.ToString();
            return _dataProtector.Protect(guidString);
        }
        catch (Exception ex)
        {
            Logger.Error($"Failed to encrypt the GUID. {ex}");
            throw new InvalidOperationException("Failed to encrypt the GUID.", ex);
        }

    }

    public Guid DecryptGuid(string encryptedGuid)
    {
        if (string.IsNullOrEmpty(encryptedGuid))
        {
            Logger.Error("Encrypted GUID is empty");
            throw new ArgumentException("Encrypted GUID cannot be null or empty.", nameof(encryptedGuid));
        }


        try
        {
            string decryptedString = _dataProtector.Unprotect(encryptedGuid);
            return Guid.Parse(decryptedString);
        }
        catch (Exception ex)
        {
            Logger.Error($"Failed to decrypt the GUID.{ex}");
            throw new InvalidOperationException("Failed to decrypt the GUID.", ex);
        }
    }
}
