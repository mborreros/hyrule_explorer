import React, { useState, useEffect } from "react";

// local component
import Item from "./item";
import InfoCard from "./info-card";
import BlankInfoCard from "./blank-info-card";
import MonsterFormCard from "./monster-form-card";
import WeaponFormCard from "./weapon-form-card";
// bootstrap form components
import Form from "react-bootstrap/Form"
import FormControl from "react-bootstrap/FormControl"
import Button from "react-bootstrap/Button"
import InputGroup from "react-bootstrap/InputGroup"

function BasePage({ pageTitle, defaultValues }) {
  
  // accessing the url params to conditionally render components
  const pathname = window.location.pathname.replace("/", "");
  // // default values for item type
  // const defaultValues = {
  //     monsters: {
  //       typeName: "monster",
  //       formValues: {
  //         name: "",
  //         defeated: false,
  //         difficulty: "",
  //         preferedWeapon: "",
  //         notes: ""
  //       }
  //     },
  //     weapons: {
  //       typeName: "weapon",
  //       formValues: {
  //         name: "",
  //         favorite: false,
  //         owned: false,
  //         notes: ""
  //       }
  //     }
  // }
  // shared state variables
  const [isItemLoaded, setIsItemLoaded] = useState(false);
  // monster state variables
  const [isMonstersLoaded, setIsMonstersLoaded] = useState(false);
  const [monstersList, setMonsters] = useState([]);
  const [selectedMonster, setSelectedMonster] = useState(false); 
  // form state variable
  // form state based on item type
  const [monsterFormData, setMonsterFormData] = useState(defaultValues.monsters.formValues);
  const [weaponFormData, setWeaponFormData] = useState(defaultValues.weapons.formValues);
  // weapons state variables
  const [isWeaponsLoaded, setIsWeaponsLoaded] = useState(false);
  const [weaponsList, setWeapons] = useState([]);
  const [selectedWeapon, setSelectedWeapon] = useState(false); 
  // search/filter state variables 
  const [inputMonstersSearch, setMonsterSearchInput] = useState("");
  const [inputWeaponsSearch, setWeaponsSearchInput] = useState("");

  // preparing and cleaning fetched data
  // compares names for sorting alphabetically
  function sortData(x, y){
    if (x.name < y.name) {return -1;}
    if (x.name > y.name) {return 1;}
    return 0;
  }
  // capitalizing strings with one work 
  function capitalizeString(str) {
    if (str.length) {
      let title = str.split(" ").map((word) => {
        return word[0].toUpperCase() + word.substring(1);
      });
      return title.join(" ")
    } else {
      return str
    }
  }
  // capitalizing strings with more than one word
  function titleCaseData(data) {
    data.forEach(obj => {
       let title = capitalizeString(obj.name)
       obj.title = title
    });
    return data;
  }

  // data fetching for weapons information from API, executed once because shared accross both pathnames 
  let sortedWeapons = [];
  useEffect(() => {
    fetch("https://botw-compendium.herokuapp.com/api/v2/category/equipment")
      .then((response) => response.json())
      .then((data) => {
        // capitalizes and sorts weapons data alphabetically by name
        sortedWeapons = titleCaseData(data.data.sort(sortData))
        setWeapons(sortedWeapons)
        setIsWeaponsLoaded(true)
      })
      .catch((error) => console.log(error), "error")
    }, []);
  // data fetching for monsters
  useEffect(() => {
    let sortedMonsters = [];
    if (pathname === "monsters") {
      fetch("https://botw-compendium.herokuapp.com/api/v2/category/monsters")
        .then((response) => response.json())
        .then((data) => {
          // capitalizes and sorts monsters data alphabetically by name
          sortedMonsters = titleCaseData(data.data.sort(sortData))
          setMonsters(sortedMonsters)
          setIsMonstersLoaded(true)
        })
        .catch(error => console.log('error', error));
    }
  }, [pathname]);

  // sets state of controlled form with submitted data
  function setFormData(type, data) {
    if (type === "monster") {
      setMonsterFormData(data)
    } else if (type === "weapon") {
      setWeaponFormData(data)
    }
  }

  // handling click of an individual monster card and setting selected monster in state
  function handleClick(type, id) {
    setIsItemLoaded(false)
    // let dataObj = defaultValues[type].formValues
    let itemType = defaultValues[type].typeName
  
    fetch(`https://botw-compendium.herokuapp.com/api/v2/entry/${id}`)
      .then((response) => response.json())
      .then((data) => {
        // set selected item state based on type
        if (itemType === "monster") {
          setSelectedMonster(data.data)
        } else if (itemType === "weapon") {
          setSelectedWeapon(data.data)}
        // once an item is selected, fetching experience data from server
        fetch(`http://localhost:3000/${itemType}s?name=${data.data.name}`)
          .then(exResponse => exResponse.json())
          .then(result => {
            // if entry exists for selected monster, set state to server data
            if (result.length) {
              setFormData(itemType, result[0])
              // if entry does not exist, setting default values 
            } else {
              setFormData(itemType, {
                ...defaultValues[pathname].formValues,
                name: data.data.name
              })
            }
            setIsItemLoaded(true)
          })
          .catch(error => console.log('error', error));
      })
  }

  // determine which info cards and forms to show based on pathname
  let showInfoCard;
  let showFormCard;
  if (pathname === "monsters") {
    showInfoCard = 
      selectedMonster ? 
      <InfoCard itemName={selectedMonster.name} id={selectedMonster.id} description={selectedMonster.description} image={selectedMonster.image} drops={selectedMonster.drops} locations={selectedMonster.common_locations} type={pathname} itemLoaded={isItemLoaded} capitalizeString={(str) => capitalizeString(str)}/> : <BlankInfoCard message={pageTitle}/>
    showFormCard = <MonsterFormCard formData={monsterFormData} setFormData={setMonsterFormData} weapons={weaponsList}/>
  } else if (pathname === "weapons") {
    showInfoCard = 
    selectedWeapon ? 
      <InfoCard itemName={selectedWeapon.name} id={selectedWeapon.id} description={selectedWeapon.description} image={selectedWeapon.image} attack={selectedWeapon.attack} defense={selectedWeapon.defense} locations={selectedWeapon.common_locations} type={pathname} itemLoaded={isItemLoaded}/> : <BlankInfoCard message={pageTitle}/>
    showFormCard = <WeaponFormCard formData={weaponFormData} setFormData={setWeaponFormData}/>
  }

  // search/filter
  function handleSearchChange(event) {
    console.log(pathname, event.target.value)
    if (pathname === "monsters") {
        setMonsterSearchInput(event.target.value)
      } else if (pathname === "weapons") {
        setWeaponsSearchInput(event.target.value)}
  }

  // clears search feature on page navgation based on pathname
  function clearSearch(pathname){
    if (pathname === "monsters"){
      setMonsterSearchInput("")
    } else if (pathname === "weapons"){
      setWeaponsSearchInput("")
    }
  }

  // creating item cards based on url path and search if applicable
  let currentData;
  let currentSearch;
  if (pathname === "monsters") {
    currentSearch = inputMonstersSearch;
    currentData = monstersList;
  } else if (pathname === "weapons") {
    currentSearch = inputWeaponsSearch;
    currentData = weaponsList;
  }
  let filteredItems = currentData.filter((item) => {
    if (currentSearch === "" ) {return item}
    else {
      return item.name.includes(currentSearch);
    }
  });
  let elements = filteredItems.map((item) => {
    return <Item key={item.id} id={item.id} itemName={item.title} image={item.image} pathname= {pathname} onClick={() => handleClick(pathname, item.id)}/>
  })



  return(
    <div className="container">
      {/* plural added to pageTitle to limit unnecessary variables */}
      <div>
      <div className="container">
      <div className="row">
        <div className="col-8">
          <h1>{pageTitle}s</h1>
        </div>
      </div>
      <div className="row py-3 justify-content-end">
        <div className="col-4">
          {/* prevents any sort of submission on search input */}
          <Form onSubmit={(event) => event.preventDefault()}>
            {/* <Form.Control type="text" placeholder={`Search ${pathname}...`} value={currentSearch} onChange={(event) => handleSearchChange(event)}/> */}
              {/* <span className={`form-control-clear ${!currentSearch.length ? "d-none" : ""}`}>&times;</span> */}
            <InputGroup>
            <FormControl placeholder={`Search ${pathname}...`} value={currentSearch} id="search-input" onChange={(event) => handleSearchChange(event)}
            />
            <Button variant="light" className={`form-control-clear ${!currentSearch.length ? "opacity-0" : ""}`} id="button-clear" onClick={() => clearSearch(pathname)}>&times;</Button>
          </InputGroup>
          </Form>
        </div>
      </div>
      </div>
      </div>
      <div>
        <div className="container overflow-scroll items">
          <div className="row row-cols-3 row-cols-md-4 flex-nowrap g-3 ">
            {/* show loading message if waiting on data */}
            {!isMonstersLoaded && !isWeaponsLoaded ? <h3>Loading...</h3> : elements}
          </div>
        </div>
        <div className="container mt-5 details">
          <div className="row">
            {/* determine whether to render blank info card or populated info card */}
            {showInfoCard}
            {/* determine which form card to display based on pathname */}
            {showFormCard}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BasePage;