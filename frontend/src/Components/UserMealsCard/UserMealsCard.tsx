import { Card, CardActions, CardContent, CardHeader, Collapse, IconButton, IconButtonProps, styled } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from "react";
import MealDaily from "../MealDaily/MealDaily";
import { FamilyUserInterface } from "../../Api/apiInterface";
import Avatar from "react-avatar";
import { useAuth } from "../AuthProvider/AuthProvider";

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

interface UserMealsProps {
    mealDate: Date;
    data: FamilyUserInterface;
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

const UserMealsCard: React.FC<UserMealsProps> = ({mealDate, data}) => {
    const { nickname, avatarColor, avatarFgColor } = useAuth();
    
    const [expanded, setExpanded] = useState(false);
    
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <>
            <Card sx={{ maxWidth: 345, mx:0, mb:1, p:0.5 }}>
                <CardHeader
                    avatar={
                        <Avatar  name={nickname} 
                                    color={avatarColor != "" ? avatarColor : "#796C50" } 
                                    fgColor={avatarFgColor} 
                                    size="50" 
                                    round={true}/>
                    }
                    title={data.userNickName}
                    sx={{p:0, mx:0 }}
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
                        <MealDaily mealDate={mealDate} familyId={data.familyId} userId={data.userId} isByFamily={false} isReadOnly={false}/>
                    </CardContent>
                </Collapse>
            </Card>
        </>
    )
}

export default UserMealsCard;