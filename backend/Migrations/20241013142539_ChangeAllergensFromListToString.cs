using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class ChangeAllergensFromListToString : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Allergens",
                table: "SchoolMeals",
                type: "text",
                nullable: false,
                oldClrType: typeof(List<string>),
                oldType: "text[]");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<List<string>>(
                name: "Allergens",
                table: "SchoolMeals",
                type: "text[]",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");
        }
    }
}
