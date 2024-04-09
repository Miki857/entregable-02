import axios from 'axios';
import React, { useState } from 'react'
import './CardPollution.css';

const CardPolution = (props) => {
    const [data, setData] = useState({});//Save Pollution data.
    let updataData = {}

    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${props.latitude}&lon=${props.longitude}&appid=${props.apiKey}`;//Url to get data.

    axios.get(url)//Consult Api.
            .then((res) => {//Consult Success:
                updataData['co'] = res.data.list[0].components.co;
                updataData['nh3'] = res.data.list[0].components.nh3;
                updataData['no'] = res.data.list[0].components.no;
                updataData['no2'] = res.data.list[0].components.no2;
                updataData['o3'] = res.data.list[0].components.o3;
                updataData['pm10'] = res.data.list[0].components.pm10;
                updataData['pm2_5'] = res.data.list[0].components.pm2_5;
                updataData['so2'] = res.data.list[0].components.so2;

                switch(res.data.list[0].main.aqi){//Assign a value to use it as classname to color, depending of Pollution.
                    case 1:
                        updataData['aqi_color'] = "pollutionGood";
                        updataData['aqi'] = "Good";
                        break;
                    case 2:
                        updataData['aqi_color'] = "pollutionFair";
                        updataData['aqi'] = "Fair";
                        break;
                    case 3:
                        updataData['aqi_color'] = "pollutionModerate";
                        updataData['aqi'] = "Moderate";
                        break;
                    case 4:
                        updataData['aqi_color'] = "pollutionPoor";
                        updataData['aqi'] = "Poor";
                        break;
                    case 5:
                        updataData['aqi_color'] = "pollutionVeryPoor";
                        updataData['aqi'] = "VeryPoor";
                        break;
                }

                setData(updataData);
            })
            .catch((err) => {//Consult Error:
                console.log(err);
            });

    return (
    <div className='card'>
        <p className='title_pollution'><i className='bx bxs-cloud bx-sm'></i> POLLUTION</p>
        {/* TABLE DATA */}
        <table className='tableData'>
            <caption className={data?.aqi_color}>{data?.aqi}</caption> 
            <tbody>
                <tr>
                    <th>SO2</th>
                    <td>{data.so2}</td>
                </tr>
                <tr>
                    <th>NO2</th>
                    <td>{data.no2}</td>
                </tr>
                <tr>
                    <th>PM10</th>
                    <td>{data.pm10}</td>
                </tr>
                <tr>
                    <th>PM2.5</th>
                    <td>{data.pm2_5}</td>
                </tr>
                <tr>
                    <th>O3</th>
                    <td>{data.o3}</td>
                </tr>
                <tr>
                    <th>CO</th>
                    <td>{data.co}</td>
                </tr>
            </tbody>
        </table>

        {/* LEYEND */}
        <table className='tablePollution'>
            <caption><h4>Pollution Table in μg/m3</h4></caption>
            <tbody>
                <tr>
                    <th></th>
                    <th className='pollutionGood'>Good</th>
                    <th className='pollutionFair'>Fair</th>
                    <th className='pollutionModerate'>Moderate</th>
                    <th className='pollutionPoor'>Poor</th>
                    <th className='pollutionVeryPoor'>Very Poor</th>
                </tr>
                <tr>
                    <th>SO2</th>
                    <td>[0; 20]</td>
                    <td>[20; 80]</td>
                    <td>[80; 250]</td>
                    <td>[250; 350]</td>
                    <td>[⩾350]</td>
                </tr>
                <tr>
                    <th>NO2</th>
                    <td>[0; 40]</td>
                    <td>[40; 70]</td>
                    <td>[70; 150]</td>
                    <td>[150; 200]</td>
                    <td>[⩾200]</td>
                </tr>
                <tr>
                    <th>PM10</th>
                    <td>[0; 20]</td>
                    <td>[20; 50]</td>
                    <td>[50; 100]</td>
                    <td>[100; 200]</td>
                    <td>[⩾200]</td>
                </tr>
                <tr>
                    <th>PM2.5</th>
                    <td>[0; 10]</td>
                    <td>[10; 25]</td>
                    <td>[25; 50]</td>
                    <td>[50; 75]</td>
                    <td>[⩾75]</td>
                </tr>
                <tr>
                    <th>O3</th>
                    <td>[0; 60]</td>
                    <td>[60; 100]</td>
                    <td>[100; 140]</td>
                    <td>[140; 180]</td>
                    <td>[⩾180]</td>
                </tr>
                <tr>
                    <th>CO</th>
                    <td>[0; 4400]</td>
                    <td>[4400; 9400]</td>
                    <td>[9400-12400]</td>
                    <td>[12400; 15400]</td>
                    <td>[⩾15400]</td>
                </tr>
            </tbody>
        </table>

        {/* LEYEND TABLE */}
        <table className='tableLeyend'>
            <caption>Leyend</caption>
            <tbody>
                <tr>
                    <th>μg/m3</th>
                    <td>Micrograms per cubic meter</td>
                </tr>
                <tr>
                    <th>SO2</th>
                    <td>Sulfur Dioxide</td>
                </tr>
                <tr>
                    <th>NO2</th>
                    <td>Nitrogen Dioxide</td>
                </tr>
                <tr>
                    <th>PM10</th>
                    <td>Particles smaller than 10 micrometers</td>
                </tr>
                <tr>
                    <th>PM2.5</th>
                    <td>Particles smaller than 2.5 micrometers</td>
                </tr>
                <tr>
                    <th>O3</th>
                    <td>Ozone</td>
                </tr>
                <tr>
                    <th>CO</th>
                    <td>Carbon monoxide</td>
                </tr>
            </tbody>
        </table>
    </div>
    )
}

export default CardPolution