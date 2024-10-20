using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class ChangeKeyOfSchoolMenuWeek : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_SchoolMenuWeeks",
                table: "SchoolMenuWeeks");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SchoolMenuWeeks",
                table: "SchoolMenuWeeks",
                columns: new[] { "WeekCommercing", "SchoolMenuId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_SchoolMenuWeeks",
                table: "SchoolMenuWeeks");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SchoolMenuWeeks",
                table: "SchoolMenuWeeks",
                column: "WeekCommercing");
        }
    }
}
