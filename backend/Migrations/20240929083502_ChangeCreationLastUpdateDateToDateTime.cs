using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class ChangeCreationLastUpdateDateToDateTime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "LastUpdatedDate",
                table: "Recipes",
                newName: "LastUpdatedDateTime");

            migrationBuilder.RenameColumn(
                name: "CreationDate",
                table: "Recipes",
                newName: "CreationDateTime");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "LastUpdatedDateTime",
                table: "Recipes",
                newName: "LastUpdatedDate");

            migrationBuilder.RenameColumn(
                name: "CreationDateTime",
                table: "Recipes",
                newName: "CreationDate");
        }
    }
}
