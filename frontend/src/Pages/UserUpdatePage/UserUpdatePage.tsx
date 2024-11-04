import { useEffect, useState } from "react";
import UserForm from "../../Components/UserForm/UserForm";
import { UserSignupInterface } from "../../Api/apiInterface";
import { getUser } from "../../Api/api";

const UserUpdatePage: React.FC = () => {
    const [userData, setUserData] = useState<UserSignupInterface>({});
    
    useEffect(() => {
        getUser()
        .then(response => setUserData(response.data))
        .catch(error => console.log(error));
    }, []);

    return (
        <>
            <UserForm data={userData} mode="edit"/>
        </>
    )
}

export default UserUpdatePage;