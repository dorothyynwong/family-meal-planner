import { MealDetailsInterface } from "../../Api/apiInterface";
import { Card, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { useMeal } from "../MealContext/MealContext";
import OverflowMenu from "../OverflowMenu/OverflowMenu";
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface MealProps {
    meal: MealDetailsInterface;
    isReadOnly: boolean;
}

const MealCard: React.FC<MealProps> = ({ meal, isReadOnly }) => {
    const { setModalShow, setMealDate, setMealNotes, setSelectedMealType, setCurrentMeal, setRecipeName, setMode } = useMeal();

    const menuItems = [
        { id: "display-recipe-button", label: "Details" },
        { id: "copy-recipe-button", label: "Copy" }
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

    return (
        <Card sx={{ maxWidth: 345, mx: 0, mb: 1 }} onClick={handleClick}>
            <CardHeader
                title={meal.mealType}
                className={meal.mealType}
                action={<OverflowMenu menuItems={menuItems} handleOptionsClick={handleClick} icon={MoreVertIcon} />}
            />
            {(meal.recipeDefaultImage) && <CardMedia
                component="img"
                height="194"
                image={meal.recipeDefaultImage ? meal.recipeDefaultImage : ""}
                alt={meal.recipeName}
            />}
            <CardContent>
                <Typography gutterBottom variant="subtitle1" component="div">
                    {meal.schoolMealId && meal.schoolMealId >= 0 ? meal.schoolMealName : meal.recipeName}
                </Typography>
                {meal.notes}
            </CardContent>
        </Card>
    )
}

export default MealCard;