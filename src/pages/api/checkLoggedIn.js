import axios from "axios";

export default async function handler(req, res) {
    try {
        const data = await axios.post('http://localhost/educate/server.php?isLoggedIn=true', req.body)
        res.status(200).json(data.data)
    } catch (error) {
        console.error(error);
        res.status(200).json({message: "Server Problems!"})
    }
}