using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddSchoolMenuWeekCommence : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SchoolMenuWeeks",
                columns: table => new
                {
                    WeekCommercing = table.Column<DateOnly>(type: "date", nullable: false),
                    SchoolMenuId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SchoolMenuWeeks", x => x.WeekCommercing);
                    table.ForeignKey(
                        name: "FK_SchoolMenuWeeks_SchoolMenus_SchoolMenuId",
                        column: x => x.SchoolMenuId,
                        principalTable: "SchoolMenus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Recipes_AddedByUserId",
                table: "Recipes",
                column: "AddedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_SchoolMenuWeeks_SchoolMenuId",
                table: "SchoolMenuWeeks",
                column: "SchoolMenuId");

            migrationBuilder.AddForeignKey(
                name: "FK_Recipes_AspNetUsers_AddedByUserId",
                table: "Recipes",
                column: "AddedByUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Recipes_AspNetUsers_AddedByUserId",
                table: "Recipes");

            migrationBuilder.DropTable(
                name: "SchoolMenuWeeks");

            migrationBuilder.DropIndex(
                name: "IX_Recipes_AddedByUserId",
                table: "Recipes");
        }
    }
}
