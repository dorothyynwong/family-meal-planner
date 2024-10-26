<<<<<<< HEAD
import { Card, CardActions, CardContent, CardHeader, Collapse, IconButton, IconButtonProps, styled } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from "react";
import MealDaily from "../MealDaily/MealDaily";
import { FamilyWithUsersInterface } from "../../Api/apiInterface";
=======
import {  Card, CardActions, CardContent, CardHeader, Collapse, IconButton, IconButtonProps, styled } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from "react";
import MealDaily from "../MealDaily/MealDaily";
import {  FamilyWithUsersInterface } from "../../Api/apiInterface";
>>>>>>> main

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

interface FamilyMealsProps {
    mealDate: Date;
    data: FamilyWithUsersInterface | null;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { ...other } = props;
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

const FamilyMealsCard: React.FC<FamilyMealsProps> = ({mealDate, data}) => {
    const [expanded, setExpanded] = useState(false);
    
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <>
            <Card sx={{ maxWidth: 345, mx:0, mb:1, p:0.5 }}>
                <CardHeader
                    title={`Family Meals`}
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
                        {data &&
                            <MealDaily mealDate={mealDate} 
                                        familyId={data.familyId} 
                                        userId={data.userId} 
                                        isByFamily={true}/>
                        }
                    </CardContent>
                </Collapse>
            </Card>
        </>
    )
}

export default FamilyMealsCard;