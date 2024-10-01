import _ from "lodash";
import { MealDetailsInterface } from "../Api/apiInterface";

export interface EventInterface {
    title: string[];
    start: Date;
    end: Date;
    type: string[];
}

export function convertMealsToEvents(meals: MealDetailsInterface[]) {
    const groupedByDate = _.groupBy(meals, 'date')
    const events: EventInterface[] = [];
    for (let [mealDate, mealGroup] of Object.entries(groupedByDate)) {
        const titles = mealGroup.map((meal: MealDetailsInterface) => meal.name);
        const types = mealGroup.map((meal: MealDetailsInterface) => meal.mealType);
        const event: EventInterface = {
            title: titles,
            start: new Date(mealDate),
            end: new Date(mealDate),
            type: types
       }
       events.push(event);
    }
    return events;
}