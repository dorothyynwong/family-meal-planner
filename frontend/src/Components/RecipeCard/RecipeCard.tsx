import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { RecipeDetailsInterface } from '../../Api/apiInterface';
import RecipeInstructionDisplay from '../RecipeDisplay/RecipeInstructionDisplay';
import "./RecipeCard.scss";
import OverflowMenu from '../OverflowMenu/OverflowMenu';
import { useNavigate } from 'react-router-dom';
import RecipeDeleteConfirmation from '../RecipeDeleteConfirmation/RecipeDeleteConirmation';
import { useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { MdAddCard } from 'react-icons/md';
import { useMeal } from '../MealContext/MealContext';
import Avatar from 'react-avatar';
// import MealForm from '../MealForm/MealForm';
// import dayjs from 'dayjs';

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

interface RecipeCardProps {
    recipe: RecipeDetailsInterface;
    isFromMealForm? : boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme }) => ({
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
    variants: [
        {
            props: ({ expand }) => !expand,
            style: {
                transform: 'rotate(0deg)',
            },
        },
        {
            props: ({ expand }) => !!expand,
            style: {
                transform: 'rotate(180deg)',
            },
        },
    ],
}));

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, isFromMealForm}) => {
    const [expanded, setExpanded] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const navigate = useNavigate();
    const { 
        setSelectedRecipe,
        setModalShow,
        setMode, 
        setFormType,
        setIsFromRecipeList,
        setRecipeName,
    } = useMeal();

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const baseMenuItems = [
        { id: "display-recipe-button", label: "Details" },
        { id: "copy-recipe-button", label: "Copy" },
        { id: "add-my-meal-button", label: "Add as My Meal"},
        { id: "add-family-meal-button", label: "Add as Family Meal"}
    ];
    
    const ownerMenuItems = [
        { id: "edit-recipe-button", label: "Edit" },
        { id: "delete-recipe-button", label: "Delete" }
    ];
    
    const menuItems = recipe.isOwner ? [...baseMenuItems, ...ownerMenuItems] : baseMenuItems;

    const handleOptionsClick = (option: string) => {
        switch (option) {
            case "display-recipe-button":
                navigate(`/recipe-details/${recipe.id}`);
                break
            case "delete-recipe-button":
                setIsDelete(true);
                break
            case "edit-recipe-button":
                navigate(`/recipe-edit/${recipe.id}`);
                break
            case "copy-recipe-button":
                navigate(`/recipe-add/${recipe.id}`);
                break
            case "add-my-meal-button":
                setMode("Add");
                setModalShow(true);
                setSelectedRecipe(recipe);
                setFormType("recipe");
                setIsFromRecipeList(true);
                setRecipeName(recipe.name ? recipe.name : recipe.notes ? recipe.notes : "");
                break
            case "add-family-meal-button":
                setMode("Add");
                setModalShow(true);
                setSelectedRecipe(recipe);
                setFormType("family");
                setIsFromRecipeList(true);
                setRecipeName(recipe.name ? recipe.name : recipe.notes ? recipe.notes : "");
                break
            default:
                break
        }
    }

    const handleCancel = () => {
        setIsDelete(false);
    }

    const handleCardClick = () => {
        setSelectedRecipe(recipe);
        navigate(-1);
    }

    const handleCardContentClick = () => {
        navigate(`/recipe-details/${recipe.id}`);
    }

    return (
        <>
        <Card sx={{ maxWidth: 345 }}>
            <CardHeader
                avatar={
                    <Avatar name={recipe.addedByUserNickname}  size="50" round={true} />
                }
                action={isFromMealForm ? <div onClick={handleCardClick}><MdAddCard /></div> :
                    <OverflowMenu menuItems={menuItems} handleOptionsClick={handleOptionsClick} icon={MoreVertIcon} />
                }
                title={recipe.name}
            />
            {(recipe.defaultImageUrl|| (recipe.images && recipe.images[0])) && <CardMedia
                component="img"
                height="194"
                image={recipe.defaultImageUrl? recipe.defaultImageUrl : recipe.images ? recipe.images[0] : ""}
                alt={recipe.name}
                onClick={handleCardContentClick}
            />}
            <CardContent onClick={handleCardContentClick}>
                {recipe.description}
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                </IconButton>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <RecipeInstructionDisplay data={recipe} />
                </CardContent>
            </Collapse>
            {isDelete && <RecipeDeleteConfirmation data={recipe}  onCancel={handleCancel} />}
            </Card>
        </>
    );
}

export default RecipeCard;