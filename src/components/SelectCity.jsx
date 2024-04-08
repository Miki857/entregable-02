import React, { useEffect, useState } from 'react'
import list from '../js/listCities';
import './SelectCityStyle.css';

const SelectCity = (props) => {
    const [countrySelected, setcountrySelected] = useState("");//To detect a change in the city and make use of the 2nd useEffect.

    const onChangeCountry = () => {
        setcountrySelected(document.querySelector(".countrySelecter").value);
    }

    useEffect(() => {//This is executed only once. Here we place the entire list of COUNTRIES in the Select Tag [countrySelecter].
        for(const a in list){
            const newOption = document.createElement("option");//Create the Option.
            newOption.appendChild(document.createTextNode("" + a));//Assign it a text to display.
            document.querySelector(".countrySelecter").appendChild(newOption);//Add it to the Select Tag in DOMM.
        }
        
        document.querySelector(".countrySelecter").addEventListener("change", onChangeCountry);
    }, []);

    useEffect(() => {//Here we place the entire list of CITIES in the Select Tag [citySelecter]. This is executed every time the user chooses a COUNTRY.
        if(countrySelected != ""){
            //First we delete the current list of cities:
            const cityElements = document.querySelectorAll(".cityOption");//We get all the Option.
            for(const elem of cityElements){
                elem.remove();
            }

            for(const city of list[countrySelected]){
                const newOption = document.createElement("option");//Create the Option
                newOption.appendChild(document.createTextNode("" + city));//Assign it a text to display.
                newOption.setAttribute("value", "" + city);//Assign it a value Attribute.
                newOption.setAttribute("class", "cityOption");//Assign it a class Attribute. We will use it to catch them later and remove them from the Select Tag when user pick another country.
                document.querySelector(".citySelecter").appendChild(newOption);//Add it to the Select Tag in DOMM.
            }
        }
    }, [countrySelected]);

    return (
        <>
            <div className='card'>
                <p className='subtitulo'>Look for a city:</p>

                <select name="country" className="countrySelecter">
                    <option value="">Using Current Location</option>
                </select>

                <select name="city" className="citySelecter">
                    <option value="">--</option>
                </select>

                <button className='button' onClick={props.button}>Get Data</button>
                
            </div>
        </>
    )
}

export default SelectCity