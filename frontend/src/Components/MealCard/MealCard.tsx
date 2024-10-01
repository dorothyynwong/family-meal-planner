import { MealDetailsInterface } from "../../Api/apiInterface";

interface MealProps {
    meal: MealDetailsInterface
}

const MealCard:React.FC<MealProps> = ({meal}) => {
    return(<>{meal.id}</>)
}

export default MealCard;