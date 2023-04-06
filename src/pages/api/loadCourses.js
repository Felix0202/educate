import axios from "axios";

export default async function handler(req, res) {
    try {
        console.log("req")
        const data = await axios.post('http://localhost/educate/server.php?loadCourses=true', req.body)
        console.log(data.data)
        res.status(200).json(data.data)
    } catch (error) {
        //console.error(error);
        res.status(200).json({message: "Server Problems!"})
    }
}