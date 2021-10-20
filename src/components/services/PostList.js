import React, { useCallback, useState} from 'react';
import axios from 'axios';


const apiURL = 'http://192.168.7.22/api';

function Postlist(){
    const [users, setUsers] = useState();
    const [requestError, setRequestError] = useState();
    const fetchData = useCallback(async () => {
        try{
            //////////////////////////////////////////////////////////
            ////////////////////      token       \\\\\\\\\\\\\\\\\\\\
            const token_body = new URLSearchParams();
            token_body.append('username', 'amir');
            token_body.append('password', '1234');
            const token_config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            const token_result = await axios.post(`${apiURL}/v2.0.0/users/login`, token_body, token_config);
            //console.log('token_result.data:')
            //console.log(token_result.data)
            const access_token = token_result.data.access_token;
            const token_type = token_result.data.token_type;
            //////////////////////////////////////////////////////////
            //////////////////// grooming_results \\\\\\\\\\\\\\\\\\\\
            // const grooming_body = {
            //     "grooming_id": 0
            // };
            // const grooming_result = await axios.post(`${apiURL}v2.0.0/algorithms/grooming/result?grooming_id=1`, grooming_body);
            //////////////////////////////////////////////////////////
            //////////////////// traffic matrices \\\\\\\\\\\\\\\\\\\\
            const traffic_config = {
                headers: {"Authorization" : `${token_type} ${access_token}`}
            };
            const traffic_result = await axios.get(`${apiURL}/v2.0.0/traffic_matrices?id=1&version=1`, traffic_config);
            setUsers(traffic_result.data);
            //console.log('traffic_result.data:',traffic_result)
            //console.log(traffic_result.data)
            //console.log('traffic_result.data[0].data.demands:')
            //console.log(traffic_result.data[0].data.demands)
        }
        catch(err){
            setRequestError(err.message)
        }
    });
    return fetchData();
}
export default Postlist;