using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class ChangeToUseGuidInsteadOfHashInFamily : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HashedFamilyCode",
                table: "Families");

            migrationBuilder.DropColumn(
                name: "Salt",
                table: "Families");

            migrationBuilder.AddColumn<Guid>(
                name: "FamilyShareCode",
                table: "Families",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FamilyShareCode",
                table: "Families");

            migrationBuilder.AddColumn<string>(
                name: "HashedFamilyCode",
                table: "Families",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Salt",
                table: "Families",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
