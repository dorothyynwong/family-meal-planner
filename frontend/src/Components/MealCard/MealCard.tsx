import { MealDetailsInterface } from "../../Api/apiInterface";
import { Card, CardContent, CardHeader, CardMedia } from "@mui/material";

interface MealProps {
    meal: MealDetailsInterface
}

const MealCard: React.FC<MealProps> = ({ meal }) => {
    return (
        <Card sx={{ maxWidth: 345, m:2 }}>
            <CardHeader title={meal.mealType} className={meal.mealType} />
            {(meal.recipeDefaultImage) && <CardMedia
                component="img"
                height="194"
                image={meal.recipeDefaultImage?meal.recipeDefaultImage: ""}
                alt={meal.recipeName}
            />}
            <CardContent>
                {meal.name}
            </CardContent>
        </Card>
    )
}

export default MealCard;