import { MealDetailsInterface } from "../Api/apiInterface";

export const mockMealDetails: MealDetailsInterface[] = [
    {
      id: 1,
      date: "2024-11-09",
      recipeId: 101,
      recipeName: "Spaghetti Bolognese",
      recipeDefaultImage: "https://example.com/spaghetti.jpg",
      userId: 10,
      familyId: 5,
      mealType: "Dinner",
      addedByUserId: 10,
      notes: "Family favorite, add extra cheese!",
      schoolMealId: 2001,
      schoolMealName: "Pizza Friday",
    },
    {
      id: 2,
      date: "2024-11-10",
      recipeId: 102,
      recipeName: "Chicken Curry",
      recipeDefaultImage: "https://example.com/chickencurry.jpg",
      userId: 11,
      familyId: 6,
      mealType: "Lunch",
      addedByUserId: 11,
      notes: "Use extra spices for more flavor.",
      schoolMealId: 2002,
      schoolMealName: "Taco Tuesday",
    },
    {
      id: 3,
      date: "2024-11-11",
      recipeId: 103,
      recipeName: "Vegetable Stir Fry",
      recipeDefaultImage: "https://example.com/stirfry.jpg",
      userId: 12,
      familyId: 7,
      mealType: "Dinner",
      addedByUserId: 12,
      notes: "Add cashews for extra crunch.",
      schoolMealId: 2003,
      schoolMealName: "Sandwich Day",
    },
  ];
  