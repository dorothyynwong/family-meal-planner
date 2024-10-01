import _ from "lodash";
import { MealDetailsInterface} from "../Api/apiInterface";

export interface EventInterface {
    title: string[];
    start: Date;
    end: Date;
    type: string[];
}

export function convertMealsToEvents(meals: MealDetailsInterface[]) {
    const groupedByDate = _.groupBy(meals, 'date')
    console.log(groupedByDate);
    return groupedByDate;
}