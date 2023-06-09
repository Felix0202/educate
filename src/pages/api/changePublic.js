import axios from "axios";

export default async function handler(req, res) {
    try {
        console.log(req.body)
        const data = await axios.post('http://localhost/educate/server.php?changePublic=true', req.body)
        res.status(200).json(data.data)
    } catch (error) {
        //console.error(error);
        res.status(200).json({error: "Server Problems!"})
    }
}