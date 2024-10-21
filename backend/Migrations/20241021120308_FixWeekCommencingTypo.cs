using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class FixWeekCommencingTypo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "WeekCommercing",
                table: "SchoolMenuWeeks",
                newName: "WeekCommencing");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "WeekCommencing",
                table: "SchoolMenuWeeks",
                newName: "WeekCommercing");
        }
    }
}
