import { MealDetailsInterface } from "../../Api/apiInterface";
import { Card, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { useMeal } from "../MealContext/MealContext";
import OverflowMenu from "../OverflowMenu/OverflowMenu";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from "react-router-dom";

interface MealProps {
    meal: MealDetailsInterface;
    isReadOnly: boolean;
}

const MealCard: React.FC<MealProps> = ({ meal, isReadOnly }) => {
    const { setModalShow, setMealDate, setMealNotes, setSelectedMealType, setCurrentMeal, setRecipeName, setMode } = useMeal();
    const navigate = useNavigate();

    const menuItems = [
        { id: "display-recipe-button", label: "Recipe Details" },
        { id: "edit-meal-button", label: "Edit Meal" }
    ];

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

    const handleOptionsClick = (option: string) => {
        switch (option) {
            case "display-recipe-button":
                navigate(`/recipe-details/${meal.recipeId}`);
                break
            case "edit-meal-button":
                if (!isReadOnly) {
                    setModalShow(true);
                    setMode("Edit");
                    setCurrentMeal(meal);
                    setMealDate(meal.date);
                    setSelectedMealType(meal.mealType);
                    setMealNotes(meal.notes ? meal.notes : "");
                    setRecipeName(meal.recipeName ? meal.recipeName : "");
                }
                break
            default:
                break
        }
    }

    return (
        <Card sx={{ maxWidth: 345, mx: 0, mb: 1 }}>
            <CardHeader
                title={meal.mealType}
                className={meal.mealType}
                action={<OverflowMenu menuItems={menuItems} handleOptionsClick={handleOptionsClick} icon={MoreVertIcon} />}
            />
            {(meal.recipeDefaultImage) && <CardMedia
                component="img"
                height="194"
                image={meal.recipeDefaultImage ? meal.recipeDefaultImage : ""}
                alt={meal.recipeName}
            />}
            <CardContent onClick={handleClick}>
                <Typography gutterBottom variant="subtitle1" component="div">
                    {meal.schoolMealId && meal.schoolMealId >= 0 ? meal.schoolMealName : meal.recipeName}
                </Typography>
                {meal.notes}
            </CardContent>
        </Card>
    )
}

export default MealCard;