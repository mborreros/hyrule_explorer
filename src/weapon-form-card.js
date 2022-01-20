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
import heartFilled from "./img/heart_filled.png";
import heartEmpty from "./img/heart_empty.png";
import bagFilled from "./img/bag_filled.png";
import bagEmpty from "./img/bag_empty.png";

function WeaponFormCard({ formData, setFormData }) {

  // state variables
  const [show, setShow] = useState(false)
  
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
      fetch(`http://localhost:3000/weapons/${formData.id}`, postData)
        .then (() => setShow(true))
        .catch(error => console.log("error", error));
    } else {
      // post request for new monster
      postData.method = "POST"
      fetch("http://localhost:3000/weapons", postData)
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
    #checkbox-favorite~label:before{
      background-image: url(${heartEmpty})
    }
    #checkbox-favorite:checked~label:before{
      background-image: url(${heartFilled})
    }
    #checkbox-owned~label:before{
      background-image: url(${bagEmpty})
    }
    #checkbox-owned:checked~label:before{
      background-image: url(${bagFilled})
    }
    `
  return(
    <div className="col-6 form pb-2">
        <style>{checkStyles}</style>

      <div className="card shadow-sm">
        {/* updates form title based on selected weapon */}
      <div className="card-header entry-name">{!formData.name ? "Select a Weapon" : formData.name + " History"}</div>
        <div className="card-body">
        <Form onSubmit={(e) => handleSubmit(e)} className={!formData.name.length ? "disabled": ""}>
          {/* disable form if no weapon is selected */}
        <fieldset disabled={!formData.name.length}>
            <Row className="form-row">
              <FormGroup className="col-3 img-check" controlId="formBasicOwned">
                  <div key="checkbox" className="mb-3">
                  <Form.Check type="checkbox" id="checkbox-owned">
                    <Form.Check.Input type="checkbox" name="owned" checked={formData.owned} onChange={(e) => handleFormInputChange("owned", e.target.checked)} />
                    {/* toggle between filled and empty bag icon based on formData */}
                    {/* <Form.Check.Label style={formData.owned ? { backgroundImage: `url(${bagFilled})`} : { backgroundImage: `url(${bagEmpty})` }}>Owned</Form.Check.Label> */}
                    <Form.Check.Label>Owned</Form.Check.Label>
                </Form.Check>
                </div>
              </FormGroup>
              <FormGroup className="col-3 img-check" controlId="formBasicFavorite">
              <div key="checkbox" className="mb-3">
                <Form.Check type="checkbox" id="checkbox-favorite">
                  <Form.Check.Input type="checkbox" name="favorite" checked={formData.favorite} onChange={(e) => handleFormInputChange("favorite", e.target.checked)} />
                  {/* toggle between filled and empty heart icon based on formData */}
                  {/* <Form.Check.Label style={formData.favorite ? { backgroundImage: `url(${heartFilled})`} : { backgroundImage: `url(${heartEmpty})` }}>Favorite</Form.Check.Label> */}
                  <Form.Check.Label>Favorite</Form.Check.Label>
                </Form.Check>
              </div>
              </FormGroup>
              
            </Row>
            <div className="form-row">
              <FormGroup className="col" controlId="formBasicNotes">
                <FormLabel className="form-label">Additional Notes</FormLabel>
                <Form.Control className="form-control" as="textarea" rows={3} value={formData.notes} name="notes" onChange={(e) => handleFormInputChange("notes", e.target.value)}/>
              </FormGroup>
          
            </div>
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

export default WeaponFormCard;