import MealDaily from "../../Components/MealDaily/MealDaily"

function Home() {

  return (
    <>
    <MealDaily mealDate={new Date()} familyId={0} userId={0} isByFamily={false}/>
    </>
  )
}

export default Home
