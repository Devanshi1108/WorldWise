import CityItem from "./CityItem";
import Spinner from "./Spinner";
import styles from "./CityList.module.css";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";

function CityList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;
  if (!cities.length)
    return <Message message="Add your first city by cicking on the map" />;
  return (
    <ul className={styles.cityList}>
      {cities.map((el) => (
        <CityItem city={el} key={el.id} />
      ))}
    </ul>
  );
}

export default CityList;
