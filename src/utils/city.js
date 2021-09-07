const CITY_NAME = "curCity";

const getCity = () => JSON.parse(localStorage.getItem(CITY_NAME));

const setCity = (value) => localStorage.setItem(JSON.stringify(value));

export { getCity, setCity }
