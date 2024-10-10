import { Card, CardContent, CardHeader } from "@mui/material";

interface FamilyCardProps {
    familyName: string;
    userNames: string[];
    familyRoles: string[];
}

const FamilyCard: React.FC<FamilyCardProps> = ({ familyName, userNames, familyRoles}) => {
    const handleClick = () => {

    }

    return (
        <Card sx={{ maxWidth: 345, m:2 }} className="meal-card" onClick={handleClick}>
            <CardHeader title={familyName}/>
            <CardContent>
            {
                userNames.map(
                    user => ();

                    
                )
            }
            </CardContent>
        </Card>
    )
}

export default FamilyCard;