import { Avatar, Card, CardActions, CardContent, CardHeader, Collapse, IconButton, IconButtonProps, styled } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from "react";
import { red } from "@mui/material/colors";
import MealDaily from "../MealDaily/MealDaily";
import { FamilyUserInterface } from "../../Api/apiInterface";

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

interface UserMealsProps {
    mealDate: Date;
    data: FamilyUserInterface;
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

const UserMealsCard: React.FC<UserMealsProps> = ({mealDate, data}) => {
    const [expanded, setExpanded] = useState(false);
    
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <>
            <Card sx={{ maxWidth: 345 }}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="user avator">
                            {data.userNickName}
                        </Avatar>
                    }
                    title={data.userNickName}
                />
                <CardActions disableSpacing>
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
                        <MealDaily mealDate={mealDate} userId={data.userId}/>
                    </CardContent>
                </Collapse>
            </Card>
        </>
    )
}

export default UserMealsCard;