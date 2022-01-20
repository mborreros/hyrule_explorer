import React, { useState, useEffect } from "react";

// bootstrap form components
import Row from "react-bootstrap/Row"
import Form from "react-bootstrap/Form"
import FormGroup from "react-bootstrap/FormGroup"
import FormLabel from "react-bootstrap/FormLabel"
import Button from "react-bootstrap/Button"
import Alert from 'react-bootstrap/Alert'
import Fade from 'react-bootstrap/Fade'
// custom icons
import swordFilled from "./img/sword_filled.png";
import swordEmpty from "./img/sword_empty.png";

function MonsterFormCard({ formData, setFormData, weapons }) {

  // state variables
  const [show, setShow] = useState(false)

  // create prefered weapon drop down option list from sorted weapons data
  const weaponsList = weapons.map((weapon) => {
    return <option key={weapon.id} value={weapon.name}>{weapon.name}</option>
  })

  // updates form data on user input
  function handleFormInputChange(field, value) {
    setFormData({
      ...formData,
      [field]: value
    })
  }

  // processes new and updated data on submission 
  function handleSubmit(e) {
    e.preventDefault()

    let postData = {
      method: "POST", 
      headers: {"Content-type": "application/json"}, 
      body: JSON.stringify(formData)
    }
    // checking to see if selected monster data already exists on server
    if (formData.id) {
      // patch request for monster
      postData.method = "PATCH"
      fetch(`http://localhost:3000/monsters/${formData.id}`, postData)
        .then (() => setShow(true))
        .catch(error => console.log("error", error));
    } else {
      // post request for new monster
      postData.method = "POST"
      fetch("http://localhost:3000/monsters", postData)
        .then(response => response.json())
        .then(result => {
          setFormData(result)
          setShow(true)
        })
        .catch(error => console.log("error", error));
    }
  }

  // time out on success alert
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        setShow(false)
    }, 1000);
  }}, [show])

  // setting style of custom icon images in line
  let checkStyles = `
    #checkbox-defeated~label:before{
      background-image: url(${swordEmpty})
    }
    #checkbox-defeated:checked~label:before{
      background-image: url(${swordFilled})
    }`

  return(
    <div className="col-6 form pb-2">
    <style>{checkStyles}</style>
      <div className="card shadow-sm">
        {/* updates form title based on selected monster */}
      <div className="card-header entry-name">{!formData.name ? "Select a Monster" : formData.name + " Experience"}</div>
        <div className="card-body">
        <Form onSubmit={(e) => handleSubmit(e)} className={!formData.name.length ? "disabled": ""}>
          {/* disable form if no monster is selected */}
        <fieldset disabled={!formData.name.length}>
            <Row className="form-row">
              <FormGroup className="col img-check" controlId="formBasicDefeated">
                  <Form.Check type="checkbox" id="checkbox-defeated">
                    <Form.Check.Input type="checkbox" name="defeated" checked={formData.defeated} onChange={(e) => handleFormInputChange("defeated", e.target.checked)} />
                    {/* toggle between filled and empty sword icon based on formData */}
                    <Form.Check.Label className="form-label">Defeated</Form.Check.Label>
                </Form.Check>
              </FormGroup>
              </Row>
              <Row className="form-row">
              <FormGroup className="col" controlId="formBasicDifficulty">
                <FormLabel className="me-2">
                  Difficulty:  
                </FormLabel>
                  <Form.Check inline type="radio" name="difficulty" id="option1" label="Easy" value="Easy" checked={formData.difficulty === "Easy"} onChange={(e) => handleFormInputChange("difficulty", e.target.value)}/>
                  <Form.Check inline type="radio" name="difficulty" id="option2" label="Medium" value="Medium" checked={formData.difficulty === "Medium"} onChange={(e) => handleFormInputChange("difficulty", e.target.value)}/>
                  <Form.Check inline type="radio" name="difficulty" id="option3" label="Hard" value="Hard" checked={formData.difficulty === "Hard"} onChange={(e) => handleFormInputChange("difficulty", e.target.value)}/>
              </FormGroup>
            </Row>
            <Row className="form-row">
              <FormGroup className="col" controlId="formBasicPrefWeapon">
                <FormLabel>Prefered Weapon</FormLabel>
                <Form.Select className="custom-select entry-name" id="weapon-select" name="weapon" onChange={(e) => handleFormInputChange("weapon", e.target.value)} value={formData.weapon} selected={formData.weapon}>
                  <option defaultValue value="">{weapons.length ? "Select a weapon" : "Error fetching weapons"}</option>
                  {weaponsList}
                </Form.Select>
              </FormGroup>
            </Row>
            <Row className="form-row">
              <FormGroup className="col" controlId="formBasicNotes">
                <FormLabel>Additional Notes</FormLabel>
                <Form.Control className="form-control" as="textarea" rows={2} value={formData.notes} name="notes" onChange={(e) => handleFormInputChange("notes", e.target.value)}/>
              </FormGroup>
              </Row>
            <div className="form-row row mt-4">
              <div className="col-8">
                <Alert show={show} variant="success" transition={Fade}> 
                  Successful submit!
                </Alert>
               </div> 
              <div className="col-4">
                <Button variant="primary" className="float-end" type="submit">Submit</Button>
              </div>
            </div>
          </fieldset>
          </Form>
        </div>
      </div>
    </div>

  )
}

export default MonsterFormCard;