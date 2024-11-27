import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import NewNav from './NewNav'
import './Stats.css'
import Chart from 'chart.js/auto'
import { Line, Pie } from 'react-chartjs-2'
import { style } from '@mui/system'

export default function Stats() {
    const [statsobject, setstatsobject] = useState({})
    const { name } = useParams()
    const [datapoints, setdatapoints] = useState({})
    const [visiteddatapoints, setvisiteddatapoints] = useState({})
    const [reportdelete, setreportdelete] = useState({})
    const [posted, setposted] = useState({})
    document.body.style.backgroundColor = "black"





    useEffect(() => {
        const token = localStorage.getItem('token')
        axios.get('https://greddiit-backend-l5kk.onrender.com/api/Stats', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                name: name
            }
        }).then(res => {
            console.log(res)
            setstatsobject(res)

            const availabledata = Object.keys(res.data)

            if (availabledata.indexOf("joineduser") !== -1) {
                const keys = Object.keys(res.data.joineduser);
                const labels = keys?.map((value) => {
                    let dates = value.split(" ")
                    dates[1] = Number(dates[1]) + 1
                    dates = dates.join("/")
                    return dates
                })
                let data = keys?.map(value => res.data.joineduser[value])
                console.log(data)
                setdatapoints({
                    labels: labels,
                    datasets: [
                        {
                            label: "Growth of subgreddiit",
                            backgroundColor: "rgb(255, 99, 132)",
                            borderColor: "rgb(255, 99, 132)",
                            data: data
                        },
                    ],
                });
            }
            if (availabledata.indexOf("visiteduser") !== -1) {
                const visitedkeys = Object.keys(res.data.visiteduser);
                const visitedlabels = visitedkeys.map((value) => {
                    let dates = value.split(" ")
                    dates[1] = Number(dates[1]) + 1
                    dates = dates.join("/")
                    return dates
                })
                let visiteddata = visitedkeys.map(value => res.data.visiteduser[value].length)
                setvisiteddatapoints({
                    labels: visitedlabels,
                    datasets: [
                        {
                            label: "Number of Users",
                            backgroundColor: "green",
                            borderColor: "green",
                            data: visiteddata
                        },
                    ],
                });

            }

            if (availabledata.indexOf("reportdelete") !== -1) {
                setreportdelete({
                    labels: ["Reported", "Deleted"],
                    datasets: [
                        {
                            label: "Number of Users",
                            backgroundColor: ["green", "red"],
                            borderColor: "white",
                            data: [res.data.reportdelete[0] - res.data.reportdelete[1], res.data.reportdelete[1]]
                        },
                    ],
                })
            }

            if (availabledata.indexOf("posted") !== -1) {
                const keys = Object.keys(res.data.posted);
                const labels = keys?.map((value) => {
                    let dates = value.split(" ")
                    dates[1] = Number(dates[1]) + 1
                    dates = dates.join("/")
                    return dates
                })
                let data = keys?.map(value => res.data.posted[value])
                console.log(data)
                setposted({
                    labels: labels,
                    datasets: [
                        {
                            label: "Dailt posts",
                            backgroundColor: "rgb(255, 99, 132)",
                            borderColor: "rgb(255, 99, 132)",
                            data: data
                        },
                    ],
                });
            }

            document.getElementsByClassName("NavStats")[0].style.color = "white"
            document.getElementsByClassName("Navprofile")[0].style.color = "white"
            document.getElementsByClassName("Navmysubgreddiits")[0].style.color = "white"
            document.getElementsByClassName("Navsubgreddiits")[0].style.backgroundColor = "white"
            document.getElementsByClassName("NavJoinRequests")[0].style.color = "white"
            document.getElementsByClassName("NavUsers")[0].style.color = "white"
            document.getElementsByClassName("NavReported")[0].style.color = "white"
            document.getElementsByClassName("NavStats")[0].style.color = "white"
            document.getElementsByClassName("Navsavedposts")[0].style.color = "white"

            document.getElementsByClassName("logout")[0].style.color = "white"


        }).catch(error => console.log(error))
    }, [])

    let arrayofgraphs = ["joineduser", "visiteduser", "reportdelete", "posted"]

    const display = arrayofgraphs.map(value => {
        if (value === "joineduser" && Object.keys(datapoints).length)
            return <Line data={datapoints} />
        else if (value === "visiteduser" && Object.keys(visiteddatapoints).length)
            return <Line data={visiteddatapoints} />
        else if (value === "reportdelete" && Object.keys(visiteddatapoints).length)

            return <div className="Pie"><Pie data={reportdelete} width={10} height={10} />
            </div>
        else if (value === "posted" && Object.keys(posted).length)
            return <Line data={posted} />


    })
    return (
        <div>
            <NewNav name={name} />
            {display}
        </div>
    )

}