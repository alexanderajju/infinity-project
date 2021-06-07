import React, { useState, useEffect } from "react";
import {
  MenuItem,
  Select,
  FormControl,
  Card,
  CardContent,
  Button,
} from "@material-ui/core";
import "./App.css";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import Login from "./Login";
import { auth, provider } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser, logout } from "./user/userSlice";

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 10.8505,
    lng: 76.2711,
  });
  const [mapZoom, setMapZoom] = useState(10);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [Type, setType] = useState("Water level");
  // const [user, setUser] = useState("");

  // useEffect(() => {
  //   auth.onAuthStateChanged((authUser) => {
  //     if (authUser) {
  //       // console.log(authUser.displayName);
  //       setUser(authUser.displayName);
  //     } else {
  //       console.log("no authUser");
  //     }
  //   });
  // }, []);

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log("authUser>>>>>>>>>>>>>>>>>>>>>>", authUser);
        dispatch(
          setUser({
            uid: authUser.providerId,
            photo: authUser.photoURL,
            email: authUser.email,
            displayName: authUser.displayName,
          })
        );
      } else {
        dispatch(logout);
      }
    });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
            flag: country.countryInfo.flag,
          }));

          const sortedData = sortData(data);
          setMapCountries(data);
          setTableData(sortedData);
          setCountries(countries);
        });
    };
    getCountriesData();
    const thinkspeakData = async () => {
      await fetch(
        "https://api.thingspeak.com/channels/1282256/feeds.json?api_key=N91NI9U7NPKLDUEW&results=2"
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(">>>>>>>>>>>>>>", data.feeds[data.feeds.length - 1]);
          console.log(">>>>>>>>>>>>>>" + data.feeds.length);

          setCountryInfo({
            todayCases:
              data.feeds[data.feeds.length - 1].field2 ??
              data.feeds[data.feeds.length - 2].field2,
            todayRecovered: 500,
            todayDeaths:
              data.feeds[data.feeds.length - 1].field1 ??
              data.feeds[data.feeds.length - 2].field1,
          });
        });
    };
    thinkspeakData();
  }, []);

  const onCountryChange = async (event) => {
    if (event.target.value === "worldwide") {
      console.log("Kerala");
    }
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);

        //All of the data ...
        // from the country response
        setCountryInfo(data);
        console.log("data >>>>>>>>>>>>>>>>>>>>", data);
        data.countryInfo
          ? setMapCenter([data.countryInfo?.lat, data.countryInfo?.long])
          : setMapCenter({
              lat: 11.2359,
              lng: 75.7855,
            });
        setMapZoom(10);
      });
  };

  const Typefun = (value, type) => {
    setCasesType(value);
    setType(type);
  };

  function googleSignout() {
    auth.signOut().then(
      function () {
        console.log("Signout Succesfull");
        window.location.reload();
      },
      function (error) {
        console.log("Signout Failed");
      }
    );
  }

  return user ? (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Infinity Systems</h1>
          <FormControl
            style={{ display: "flex", flexDirection: "row" }}
            className="app__dropdown"
          >
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Kerala</MenuItem>

              {countries.map((country, index) => (
                <MenuItem value={country.value}>WB {index + 1}</MenuItem>
              ))}
            </Select>
            <Button onClick={googleSignout}>Logout</Button>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            // onClick={((e) => setCasesType("cases"), setType("Water Level"))}
            onClick={(e) => Typefun("cases", "Water Temperature")}
            title="Water Temperature"
            // cases={TSpeak}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />

          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => Typefun("recovered", "Water Height")}
            title="Water Height"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => Typefun("deaths", "Water Flow")}
            title="Water Flow"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Water level</h3>
          <Table countries={tableData} />
          <h3> {Type}</h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  ) : (
    <Login />
  );
}

export default App;
