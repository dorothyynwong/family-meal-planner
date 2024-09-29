import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
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

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

interface RecipeCardProps {
    recipe: RecipeDetailsInterface;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
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

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    const [expanded, setExpanded] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const navigate = useNavigate();

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const menuItems = [
        { id: "display-recipe-button", label: "Details" },
        { id: "edit-recipe-button", label: "Edit" },
        { id: "delete-recipe-button", label: "Delete" },
        { id: "copy-recipe-button", label: "Copy"},
    ];

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
            default:
                break
        }
    }

    const handleCancel = () => {
        setIsDelete(false);
    }

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        Melissa Cheng
                    </Avatar>
                }
                action={
                    <OverflowMenu menuItems={menuItems} handleOptionsClick={handleOptionsClick} icon={MoreVertIcon} />
                }
                title={recipe.name}
            />
            <CardMedia
                component="img"
                height="194"
                image={recipe.defaultImageUrl? recipe.defaultImageUrl : recipe.images ? recipe.images[0] : ""}
                alt={recipe.name}
            />
            <CardContent>
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
    );
}

export default RecipeCard;