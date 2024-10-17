import { MealDetailsInterface } from "../../Api/apiInterface";
import { Card, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { useMeal } from "../MealContext/MealContext";

interface MealProps {
    meal: MealDetailsInterface;
}

const MealCard: React.FC<MealProps> = ({ meal }) => {
    const {setModalShow, setMealDate, setMealNotes, setSelectedMealType, setCurrentMeal, setRecipeName, setMode} = useMeal();

    const handleClick = () => {
        setModalShow(true);
        setMode("Edit");
        setCurrentMeal(meal);
        setMealDate(meal.date);
        setSelectedMealType(meal.mealType);
        setMealNotes(meal.notes? meal.notes: "");
        setRecipeName(meal.recipeName? meal.recipeName: "");
    }

    return (
        <Card sx={{ maxWidth: 345, mx:0, mb: 1 }} onClick={handleClick}>
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