import axios from "axios";

export default async function handler(req, res) {
    console.log("test")
    try {
        const data = await axios.post('http://localhost/educate/server.php?loginUser=true', req.body)
        res.status(200).json(data.data)
    } catch (error) {
        console.error(error);
        res.status(200).json({error: "Server Problems!"})
    }
}