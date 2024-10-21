import { Card, CardActions, CardContent, CardHeader, Collapse, IconButton, IconButtonProps, styled } from "@mui/material";
import { SchoolMenuWeekMealsInterface } from "../../Api/apiInterface";
import SchoolMealCard from "../SchoolMealCard/SchoolMealCard";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from "react";

interface SchoolMenuCardProps {
    schoolMenu: SchoolMenuWeekMealsInterface;
    dayTypes: string[];
    index: number;
}
interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
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

const SchoolMenuCard: React.FC<SchoolMenuCardProps> = ({ schoolMenu, dayTypes, index }) => {
    const [expanded, setExpanded] = useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card sx={{ maxWidth: 345, mx: 0, mb: 1, p: 0.5 }}>
            <CardHeader title={`School Menu ${index}`} />
            <CardContent>
                Week Commencing: 
                {schoolMenu.weekCommencing.join(",")}
            </CardContent>
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
                    {schoolMenu && schoolMenu.schoolMeals.map((sm, index) =>
                        <SchoolMealCard key={index} meal={sm} mealDays={dayTypes} />)}
                </CardContent>
            </Collapse>
        </Card>
    )
}

export default SchoolMenuCard;