import { FamilyUserInterface } from "../../Api/apiInterface";
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { useState } from "react";
import FamilyRoleSelectBox from "../FamilyRoleSelectBox/FamilyRoleSelectBox";
import { updateFamilyRole } from "../../Api/api";
import StatusHandler from "../StatusHandler/StatusHandler";
import FamilyCodeForm from "../FamilyCodeForm/FamilyCodeForm";

interface FamilyUsersProps {
    data: FamilyUserInterface[];
    familyId: number;
    familyName: string;
    familyCode: string;
    currentUserRole: string;
    roles: string[];
}

const FamilyCard: React.FC<FamilyUsersProps> = ({ data, familyId, familyName, familyCode, currentUserRole, roles }) => {
    const [familyUsers, setFamilyUsers] = useState<FamilyUserInterface[]>(data);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [modalShow, setModalShow] = useState(false);

    const handleRoleChange = (index: number, newRole: string, familyId: number, userId: number) => {
        const updatedUsers = [...familyUsers];
        updatedUsers[index].familyRole = newRole;
        setFamilyUsers(updatedUsers);

        updateFamilyRole({ familyId, userId, newRole })
            .then(response => {
                if (response.statusText === "OK") {
                    setStatus("success");
                }
            })
            .catch(error => {
                const errorMessage = error?.response?.data?.message || "Error updating family role";
                setStatus("error");
                setErrorMessages([...errorMessages, errorMessage]);
            });
    };

    return (
        <Card sx={{ maxWidth: 345, m: 2 }}>
            <StatusHandler
                status={status}
                errorMessages={errorMessages}
                loadingMessage="Updating family role ..."
                successMessage=""
            ><></>
            </StatusHandler>
            <CardHeader title={familyName} />
            <CardContent>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {familyUsers.map(
                        (fu, index) => (
                            <ListItem key={index} alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar>{fu.userNickName}</Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={fu.userNickName}
                                />
                                {currentUserRole === "Cook" ? (
                                    <FamilyRoleSelectBox
                                        defaultRole={fu.familyRole}
                                        roles={roles}
                                        onRoleChange={(newRole: string) => handleRoleChange(index, newRole, fu.familyId, fu.userId)}
                                    />) : (fu.familyRole)}
                            </ListItem>
                        )
                    )}
                </List>
            </CardContent>
            <CardActions>
                {currentUserRole === "Cook" ? familyCode : ""}
                {currentUserRole === "Cook" && 
                    <Button id="share-family-button"  onClick={() => setModalShow(true)}>Share Family Code</Button>}
            </CardActions>
            {modalShow && <FamilyCodeForm  modalShow={modalShow} setModalShow={setModalShow} f_id={familyId} f_name={familyName}/>}
        </Card >
    )
}

export default FamilyCard;