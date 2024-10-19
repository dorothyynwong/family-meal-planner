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
public class FamilyUserServiceTests
{
    private IFamilyUserService _familyUserService;
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
        _familyUserService = new FamilyUserService(_context, _familyService);

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
            new FamilyUser { UserId = 1, FamilyId = 1, FamilyRole = FamilyRoleType.Cook, IsApproved=true },
            new FamilyUser { UserId = 1, FamilyId = 2, FamilyRole = FamilyRoleType.Eater, IsApproved=true },
            new FamilyUser { UserId = 2, FamilyId = 1, FamilyRole = FamilyRoleType.Eater, IsApproved=false },
            new FamilyUser { UserId = 3, FamilyId = 1, FamilyRole = FamilyRoleType.Eater, IsApproved=true },
        };

        if (!context.FamilyUsers.Any())
        {
            context.FamilyUsers.AddRange(initialFamilyUsers);
            context.SaveChanges();
        }
    }

    [Test]
    public async Task AddFamilyUser_Success()
    {
        int userId = 1;
        int familyId = 3;
        Guid familyShareCode = Guid.Parse("99a888f2-5ce7-47da-8ef6-ea2fc2bd4ab6");
        string familyRole = "Eater";

        FamilyUserRequest familyUserRequest = new FamilyUserRequest();
        familyUserRequest.FamilyShareCode = familyShareCode;
        familyUserRequest.FamilyRole = familyRole;

        await _familyUserService.AddFamilyUser(familyUserRequest, userId);

        var newFamilyUser = await _familyUserService.GetFamilyUser(familyId, userId);

        newFamilyUser.Should().NotBeNull();
        newFamilyUser.FamilyRole.Should().Be((FamilyRoleType)Enum.Parse(typeof(FamilyRoleType), familyRole));
        newFamilyUser.IsApproved.Should().BeFalse();
    }

    [Test]
    public async Task ApproveFamilyUser_Success()
    {
        int userId = 2;
        int familyId = 1;

        await _familyUserService.ApproveFamilyUser(familyId, userId);

        var newFamilyUser = await _familyUserService.GetFamilyUser(familyId, userId);

        newFamilyUser.Should().NotBeNull();
        newFamilyUser.IsApproved.Should().BeTrue();

    }


    [Test]
    public async Task UpdateFamilyUserRole_Success()
    {
        int familyId = 1;
        int userId = 2;
        string familyRole = "Eater";

        FamilyRoleUpdateRequest familyRoleUpdateRequest = new FamilyRoleUpdateRequest();
        familyRoleUpdateRequest.FamilyId = familyId;
        familyRoleUpdateRequest.UserId = userId;
        familyRoleUpdateRequest.NewRole = familyRole;

        await _familyUserService.UpdateFamilyUserRole(familyRoleUpdateRequest);

        var newFamilyUser = await _familyUserService.GetFamilyUser(familyId, userId);

        newFamilyUser.Should().NotBeNull();
        newFamilyUser.FamilyRole.Should().Be((FamilyRoleType)Enum.Parse(typeof(FamilyRoleType), familyRole));

    }

    [Test]
    public void ApproveNonExistFamilyUser()
    {
        int familyId = 100;
        int userId = 100;
        string familyRole = "Eater";

        FamilyRoleUpdateRequest familyRoleUpdateRequest = new FamilyRoleUpdateRequest();
        familyRoleUpdateRequest.FamilyId = familyId;
        familyRoleUpdateRequest.UserId = userId;
        familyRoleUpdateRequest.NewRole = familyRole;

        var exception = Assert.ThrowsAsync<Exception>(async () =>
        {
            await _familyUserService.UpdateFamilyUserRole(familyRoleUpdateRequest);
        });

    }

    [Test]
    public void UpdateNonExistFamilyUser()
    {
        int familyId = 100;
        int userId = 100;
        string familyRole = "Eater";

        FamilyRoleUpdateRequest familyRoleUpdateRequest = new FamilyRoleUpdateRequest();
        familyRoleUpdateRequest.FamilyId = familyId;
        familyRoleUpdateRequest.UserId = userId;
        familyRoleUpdateRequest.NewRole = familyRole;

        var exception = Assert.ThrowsAsync<Exception>(async () =>
        {
            await _familyUserService.UpdateFamilyUserRole(familyRoleUpdateRequest);
        });

    }

    [Test]
    public async Task DeleteFamilyUser()
    {
        int familyId = 1;
        int userId = 3;
        await _familyUserService.DeleteFamilyUser(familyId, userId);

        var exception = Assert.ThrowsAsync<Exception>(async () =>
        {
            await _familyUserService.GetFamilyUser(familyId, userId);
        });
    }

    [Test]
    public void DeleteNonExistFamilyUser()
    {
        int familyId = 100;
        int userId = 100;
        var exception = Assert.ThrowsAsync<Exception>(async () =>
        {
            await _familyUserService.DeleteFamilyUser(familyId, userId);
        });

    }

    [Test]
    public async Task IsUserCook_Return_True()
    {
        int familyId = 1;
        int userId = 1;
        bool result = await _familyUserService.IsCook(familyId, userId);

        result.Should().BeTrue();
    }

    [Test]
    public async Task IsUserCook_Return_False()
    {
        int familyId = 1;
        int userId = 3;
        bool result = await _familyUserService.IsCook(familyId, userId);

        result.Should().BeFalse();
    }

    [Test]
    public async Task IsSameFamily_ReturnTrue()
    {
        int userId1 = 1;
        int userId2 = 2;

        bool result = await _familyUserService.IsSameFamily(userId1, userId2);
        result.Should().BeTrue();
    }

    [Test]
    public async Task IsSameFamily_ReturnFalse()
    {
        int userId1 = 3;
        int userId2 = 4;

        bool result = await _familyUserService.IsSameFamily(userId1, userId2);
        result.Should().BeFalse();
    }

}