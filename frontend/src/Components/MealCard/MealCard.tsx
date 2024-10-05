import { MealDetailsInterface } from "../../Api/apiInterface";
import { Card, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";

interface MealProps {
    meal: MealDetailsInterface
}

const MealCard: React.FC<MealProps> = ({ meal }) => {
    return (
        <Card sx={{ maxWidth: 345, m:2 }} className="meal-card">
            <CardHeader title={meal.mealType} className={meal.mealType} />
            {(meal.recipeDefaultImage) && <CardMedia
                component="img"
                height="194"
                image={meal.recipeDefaultImage?meal.recipeDefaultImage: ""}
                alt={meal.recipeName}
            />}
            <CardContent>
            <Typography gutterBottom variant="subtitle1" component="div">
                {meal.recipeName}
            </Typography>
                {meal.notes}
            </CardContent>
        </Card>
    )
}

export default MealCard;