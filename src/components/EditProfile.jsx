import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getUserToken } from "../utils/authToken"

export default function EditProfile(props) {
    const { data } = props

    const [editForm, setEditForm] = useState({
        username: data.username,
        age: data.age,
        bio: data.bio,
        location: data.location
    })

    const token = getUserToken()
    const { id } = useParams()
    const navigate = useNavigate()
    const URL = `https://fitness-accountability.herokuapp.com/profile/${id}`

    function handleChange(event) {
        const userInput = { ...editForm }
        userInput[event.target.name] = event.target.value
        setEditForm(userInput)
    }

    async function updateProfile(e) {
        e.preventDefault()
        const updatedProfile = { ...editForm }
        try {
            const requestOptions = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedProfile),
            }
            await fetch(URL, requestOptions)
            navigate(`/`)
        }
        catch (err) {
            console.error(err)
        }
    }

    return (
        <>
            <br />
            <h1>Edit profile</h1>
            <section className="edit-post">
                <h2>Edit profile</h2>

                <form onSubmit={updateProfile}>
                    <div>
                        <label>
                            Edit username:
                            <input
                                type="text"
                                value={editForm.username}
                                name="username"
                                placeholder="edit username"
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <br />
                    <div>
                        <label>
                            Edit age:
                            <input
                                type="text"
                                value={editForm.age}
                                name="age"
                                placeholder="edit age"
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <br />
                    <div>
                        <label>
                            Edit bio:
                            <input
                                type="text"
                                value={editForm.bio}
                                name="bio"
                                placeholder="edit bio"
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <br />
                    <div>
                        <label>
                            Edit location:
                            <input
                                type="text"
                                value={editForm.location}
                                name="location"
                                placeholder="edit location"
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <br />
                    <input type="submit" value="Edit Profile" />
                </form>
            </section>
        </>
    )
}