import { MealDetailsInterface } from "../../Api/apiInterface";
import { Card, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { useMeal } from "../MealContext/MealContext";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface MealProps {
    meal: MealDetailsInterface;
    isReadOnly: boolean;
}

const MealCard: React.FC<MealProps> = ({ meal, isReadOnly }) => {
    const { setModalShow, setMealDate, setMealNotes, setSelectedMealType, setCurrentMeal, setRecipeName, setMode } = useMeal();
    const navigate = useNavigate();

    const handleClick = () => {
        if (!isReadOnly) {
            setModalShow(true);
            setMode("Edit");
            setCurrentMeal(meal);
            setMealDate(meal.date);
            setSelectedMealType(meal.mealType);
            setMealNotes(meal.notes ? meal.notes : "");
            setRecipeName(meal.recipeName ? meal.recipeName : "");
        }
    }

    const handleRecipeClick = () => {
       navigate(`/recipe-details/${meal.recipeId}`);
    }

    return (
        <Card sx={{ maxWidth: 345, mx: 0, mb: 1 }}>
            <CardHeader
                title={meal.mealType}
                className={meal.mealType}
                action={!isReadOnly && <FaEdit onClick={handleClick}/>}
            />
            {(meal.recipeDefaultImage) && <CardMedia
                component="img"
                height="194"
                image={meal.recipeDefaultImage ? meal.recipeDefaultImage : ""}
                alt={meal.recipeName}
                onClick={handleRecipeClick}
            />}
            <CardContent onClick={handleRecipeClick}>
                <Typography gutterBottom variant="subtitle1" component="div">
                    {meal.schoolMealId && meal.schoolMealId >= 0 ? meal.schoolMealName : meal.recipeName}
                </Typography>
                {meal.notes}
            </CardContent>
        </Card>
    )
}

export default MealCard;