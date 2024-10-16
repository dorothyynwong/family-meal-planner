using FamilyMealPlanner;
using FamilyMealPlanner.Enums;
using FamilyMealPlanner.Models;
using FamilyMealPlanner.Models.Data;
using FamilyMealPlanner.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;


[TestFixture]
public class FamilyServiceTests
{
    private IFamilyService _familyService;
    private FamilyMealPlannerContext _context;
    private UserManager<User> _userManager;
    private RoleManager<Role> _roleManager;

    [SetUp]
    public void Setup()
    {
        var serviceCollection = new ServiceCollection();
        serviceCollection.AddDbContext<FamilyMealPlannerContext>(options =>
            options.UseSqlite("DataSource=:memory:"));

        serviceCollection.AddIdentity<User, Role>()
            .AddEntityFrameworkStores<FamilyMealPlannerContext>()
            .AddDefaultTokenProviders();

        var mockUserManagerLogger = new Mock<ILogger<UserManager<User>>>();
        var mockRoleManagerLogger = new Mock<ILogger<RoleManager<Role>>>();
        var mockDataProtectorTokenProviderLogger = new Mock<ILogger<DataProtectorTokenProvider<User>>>();

        serviceCollection.AddSingleton(mockUserManagerLogger.Object);
        serviceCollection.AddSingleton(mockRoleManagerLogger.Object);
        serviceCollection.AddSingleton(mockDataProtectorTokenProviderLogger.Object);

        var serviceProvider = serviceCollection.BuildServiceProvider();

        _context = serviceProvider.GetService<FamilyMealPlannerContext>();
        _userManager = serviceProvider.GetService<UserManager<User>>();
        _roleManager = serviceProvider.GetService<RoleManager<Role>>();

        _context.Database.OpenConnection();

        _context.Database.EnsureCreated();

        var builder = new ConfigurationBuilder();
        IConfigurationRoot configuration = builder.Build();

        _familyService = new FamilyService(_context);

        SeedDatabaseAsync(_context).Wait();
    }


    [TearDown]
    public void TearDown()
    {
        _context.Dispose();
        _userManager.Dispose();
        _roleManager.Dispose();
    }

    private async Task SeedDatabaseAsync(FamilyMealPlannerContext context)
    {
        var user1 = new User { Email = "user1@abc.com", UserName = "user1@abc.com", Nickname = "user1" };
        var user2 = new User { Email = "user2@abc.com", UserName = "user2@abc.com", Nickname = "user2" };
        var user3 = new User { Email = "user3@abc.com", UserName = "user3@abc.com", Nickname = "user3" };
        var password = "Pa$$word1";

        await _userManager.CreateAsync(user1, password);
        await _userManager.CreateAsync(user2, password);
        await _userManager.CreateAsync(user3, password);

        var initialFamilies = new List<Family>
        {
            new Family { FamilyName = "Family 1", FamilyShareCode = Guid.Parse("dfe6a97e-b4c7-43de-990c-448b80632a69")},
            new Family { FamilyName = "Family 2", FamilyShareCode = Guid.Parse("bddd8146-5b02-443e-8844-c047b3373254")},
            new Family { FamilyName = "Family 3", FamilyShareCode = Guid.Parse("99a888f2-5ce7-47da-8ef6-ea2fc2bd4ab6")},
        };

        if (!context.Families.Any())
        {
            context.Families.AddRange(initialFamilies);
            context.SaveChanges();
        }
        var initialFamilyUsers = new List<FamilyUser>
        {
            new FamilyUser { UserId = 1, FamilyId = 1, FamilyRole = FamilyRoleType.Cook },
            new FamilyUser { UserId = 1, FamilyId = 2, FamilyRole = FamilyRoleType.Eater },
            new FamilyUser { UserId = 2, FamilyId = 1, FamilyRole = FamilyRoleType.Eater },
        };

        if (!context.FamilyUsers.Any())
        {
            context.FamilyUsers.AddRange(initialFamilyUsers);
            context.SaveChanges();
        }
    }

    [Test]
    public async Task AddFamilyWithUser_Return_FamilyId()
    {
        int userId = 1;

        FamilyRequest familyRequest = new FamilyRequest();
        familyRequest.FamilyName = "Test Family";

        int familyId = await _familyService.AddFamilyWithUser(familyRequest, userId);

        var newFamily = await _familyService.GetFamilyById(familyId);

        familyId.Should().BePositive();
        newFamily.FamilyName.Should().Be(familyRequest.FamilyName);
        newFamily.FamilyShareCode.ToString().Should().NotBeNullOrEmpty();
    }

    [Test]
    public async Task AddFamilyWithUserWithoutFamilyName_Return_Exception()
    {
        int userId = 1;

        FamilyRequest familyRequest = new FamilyRequest();
        familyRequest.FamilyName = "";


        var exception = Assert.ThrowsAsync<ArgumentException>(async () =>
        {
            int familyId = await _familyService.AddFamilyWithUser(familyRequest, userId);
        });
    }

    [Test]
    public async Task GetFamilyByGuid_Return_Family()
    {
        Guid guid = Guid.Parse("99a888f2-5ce7-47da-8ef6-ea2fc2bd4ab6");

        var family = await _familyService.GetFamilyByGuid(guid);
        family.Should().NotBeNull();
        family.FamilyName.Should().Be("Family 3");
    }

    [Test]
    public async Task GetFamilyByUserId_Return_FamilyResponses()
    {
        int userId = 1;

        var familyResponses = await _familyService.GetFamilyByUserId(userId);
        var family1 = familyResponses[0];
        var family2 = familyResponses[1];

        familyResponses.Should().NotBeNull();
        family1.FamilyName.Should().Be("Family 1");
        family2.FamilyName.Should().Be("Family 2");
        family1.FamilyShareCode.Should().Be("dfe6a97e-b4c7-43de-990c-448b80632a69");
        family2.FamilyShareCode.Should().Be("bddd8146-5b02-443e-8844-c047b3373254");
    }

    [Test]
    public async Task UpdateFamily_Return_Family()
    {
        int familyId = 1;

        FamilyRequest familyRequest = new FamilyRequest();
        familyRequest.FamilyName = "Test Update Family";

        await _familyService.UpdateFamily(familyRequest, familyId);

        var newFamily = await _familyService.GetFamilyById(familyId);

        newFamily.Should().NotBeNull();
        newFamily.FamilyName.Should().Be(familyRequest.FamilyName);
        newFamily.FamilyShareCode.Should().Be("dfe6a97e-b4c7-43de-990c-448b80632a69");
    }

    [Test]
    public void UpdateNonExistFamily()
    {
        int familyId = 100;
        FamilyRequest familyRequest = new FamilyRequest();
        familyRequest.FamilyName = "Test Update Family";

        var exception = Assert.ThrowsAsync<Exception>(async () =>
        {
            await _familyService.UpdateFamily(familyRequest, familyId);
        });

    }

    [Test]
    public async Task DeleteFamily()
    {
        int familyId = 3;
        await _familyService.DeleteFamily(familyId);

        var exception = Assert.ThrowsAsync<InvalidOperationException>(async () =>
        {
            await _familyService.GetFamilyById(familyId);
        });
    }

    [Test]
    public void DeleteNonExistFamily()
    {
        int familyId = 100;
        var exception = Assert.ThrowsAsync<Exception>(async () =>
        {
            await _familyService.DeleteFamily(familyId);
        });

    }


}