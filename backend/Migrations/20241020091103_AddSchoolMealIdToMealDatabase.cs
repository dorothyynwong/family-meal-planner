using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddSchoolMealIdToMealDatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SchoolMealId",
                table: "Meals",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Meals_SchoolMealId",
                table: "Meals",
                column: "SchoolMealId");

            migrationBuilder.AddForeignKey(
                name: "FK_Meals_SchoolMeals_SchoolMealId",
                table: "Meals",
                column: "SchoolMealId",
                principalTable: "SchoolMeals",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Meals_SchoolMeals_SchoolMealId",
                table: "Meals");

            migrationBuilder.DropIndex(
                name: "IX_Meals_SchoolMealId",
                table: "Meals");

            migrationBuilder.DropColumn(
                name: "SchoolMealId",
                table: "Meals");
        }
    }
}
