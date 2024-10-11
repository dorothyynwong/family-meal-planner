import { FamilyUserInterface, FamilyWithUsersInterface, MealDetailsInterface } from "../../Api/apiInterface";
import { Card, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { useState } from "react";

interface FamilyUsersProps {
    data: FamilyUserInterface[];
    familyName: string;
}

const FamilyCard: React.FC<FamilyUsersProps> = ({ data, familyName }) => {
    const [familyUsers, setFamilyUsers] = useState<FamilyUserInterface[]>(data);
    console.log(familyUsers);

    const handleClick = () => {

    }

    return (
        <Card sx={{ maxWidth: 345, m:2 }} className="family-user-card" onClick={handleClick}>
            <CardHeader title={familyName}  />
            <CardContent>
            {familyUsers.map(
                fu => fu.userNickName + fu.familyRole
            )}
            </CardContent>
        </Card>
    )
}

export default FamilyCard;