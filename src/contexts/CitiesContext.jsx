import {
  useState,
  useEffect,
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";

const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext();
function CitiesProvider({ children }) {
  const initialState = {
    cities: [],
    isLoading: false,
    currentCity: {},
    error: "",
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const { cities, isLoading, currentCity, error } = state;

  function reducer(state, action) {
    switch (action.type) {
      case "loading/start":
        return { ...state, isLoading: true };
      case "error":
        return { ...state, isLoading: false, error: action.payload };
      case "cities/loaded":
        return { ...state, cities: action.payload, isLoading: false };
      case "city/created":
        return {
          ...state,
          cities: [...state.cities, action.payload],
          isLoading: false,
          currentCity: action.payload,
        };
      case "city/deleted":
        return {
          ...state,
          isLoading: false,
          cities: state.cities.filter((el) => el.id !== action.payload),
          currentCity: {},
        };

      case "currentCity":
        return { ...state, currentCity: action.payload, isLoading: false };

      default:
        throw new Error("Action not found");
    }
  }
  useEffect(function () {
    async function fetchCities() {
      try {
        // setIsLoading(true);
        dispatch({ type: "loading/start" });
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        //setCities(data);
        dispatch({ type: "cities/loaded", payload: data });
      } catch (err) {
        console.error(err);
        dispatch({ type: "error", payload: "There was an error loading data" });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(async function getCity(id) {
    try {
      //setIsLoading(true);
      dispatch({ type: "loading/start" });
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      //setCurrentCity(data);
      dispatch({ type: "currentCity", payload: data });
    } catch (err) {
      console.error(err);
      dispatch({ type: "error", payload: "There was an error loading data" });
    }
  }, []);

  async function createCity(newCity) {
    try {
      //setIsLoading(true);
      dispatch({ type: "loading/start" });
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      //setCities((cities) => [...cities, data]);
      dispatch({ type: "city/created", payload: data });
    } catch (err) {
      console.error(err);
      dispatch({
        type: "error",
        payload: "There was an error creating a city",
      });
    }
  }

  async function deleteCity(id) {
    try {
      //setIsLoading(true);
      dispatch({ type: "loading/start" });
      const res = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      //setCities((arr) => arr.filter((city) => city.id !== id));
      dispatch({ type: "city/deleted", payload: id });
    } catch (err) {
      console.error(err);
      dispatch({
        type: "error",
        payload: "There was an error deleting a city",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error(
      "Cities context was used outside of the cities provider scope"
    );

  return context;
}

export { CitiesProvider, useCities };
