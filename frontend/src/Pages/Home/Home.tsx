import { useEffect, useState } from "react";
import { getFamilyListByUserId } from "../../Api/api"
import { FamilyWithUsersInterface } from "../../Api/apiInterface";
import MealDaily from "../../Components/MealDaily/MealDaily"
import StatusHandler from "../../Components/StatusHandler/StatusHandler";
import FamilyMealsCard from "../../Components/FamilyMealsCard/FamilyMealsCard";

function Home() {
  const [familyUsersList, setFamilyUsersList] = useState<FamilyWithUsersInterface[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  useEffect(() => {
    setStatus("loading");
    getFamilyListByUserId()
      .then(response => {
        setFamilyUsersList(response.data);
        setStatus("success");
      })
      .catch(error => {
        console.log("Error getting family meals", error);
        const errorMessage = error?.response?.data?.message || "Error getting family meals";
        setStatus("error");
        setErrorMessages([...errorMessages, errorMessage]);
      })
  }, []);

  return (
    <>
      <StatusHandler
        status={status}
        errorMessages={errorMessages}
        loadingMessage="Getting recipes..."
        successMessage=""
      >
        <></>
      </StatusHandler>
      <MealDaily mealDate={new Date()} familyId={0} userId={0} isByFamily={false} />
      {familyUsersList.map((fu, index) => (
                <FamilyMealsCard
                    key = {index}
                    mealDate = {new Date()}
                    data = {fu}
                />
            ))}
    </>
  )
}

export default Home
