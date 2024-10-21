import { SchoolMenuWeekMealsInterface } from "../../Api/apiInterface";
import SchoolMealCard from "../SchoolMealCard/SchoolMealCard";

interface SchoolMenuCardProps {
    schoolMenu: SchoolMenuWeekMealsInterface;
    dayTypes: string[]
}

const SchoolMenuCard:React.FC<SchoolMenuCardProps> = ({schoolMenu, dayTypes}) => {
    return (
        schoolMenu && schoolMenu.schoolMeals.map((sm, index) =>
            <SchoolMealCard key={index} meal={sm} mealDays={dayTypes} />)
    )
}

export default SchoolMenuCard;