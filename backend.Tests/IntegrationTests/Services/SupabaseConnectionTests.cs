using System;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Npgsql;
using NUnit.Framework;

[TestFixture]
public class SupabaseConnectionTests
{
    private string _connectionString;

    [SetUp]
    public void SetUp()
    {
        var configuration = new ConfigurationBuilder()
            .AddUserSecrets<SupabaseConnectionTests>() 
            .Build();

        _connectionString = configuration["DB_CONNECTION_STRING"];
    }

    [Test]
    public void TestDatabaseConnection()
    {
        _connectionString.Should().NotBeNull();

         using var connection = new NpgsqlConnection(_connectionString);
        try
        {
            connection.Open();
            Assert.Pass("Connection successful!");
        }
        catch (Exception ex)
        {
            Assert.Fail($"Connection failed: {ex.Message}");
        }
    }
}
