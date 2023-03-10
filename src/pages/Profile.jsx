import { useState, useEffect, useContext } from "react"
import { useParams } from 'react-router'
import { useNavigate, Link } from "react-router-dom"
import { UserContext } from "../data"
import { clearUserToken } from "../utils/authToken"

export default function Profile() {

    // useContext data
    const { currentUserID } = useContext(UserContext)
    const { setAuth, setUser, setUserID } = useContext(UserContext)

    // useState variables
    const [profile, setProfile] = useState(undefined)
    const [posts, setPosts] = useState([])

    // useParams - useEffect dependency
    const { id } = useParams()

    const navigate = useNavigate()

    async function getAllPosts() {
        let allPosts
        try {
            const response = await fetch(`https://fitness-accountability.herokuapp.com/`)
            allPosts = await response.json()
        } catch (err) {
            console.error(err)
        } finally {
            setPosts(allPosts)
        }
    }

    async function getProfile(userProfile) {
        let result
        try {
            const response = await fetch(`https://fitness-accountability.herokuapp.com/profile/${userProfile}`)
            result = await response.json()
        } catch (err) {
            console.error(err.message)
        } finally {
            setProfile(result)
        }
    }

    useEffect(() => {
        getAllPosts()
        getProfile(id)

        return (() => {
            setPosts([])
            setProfile(undefined)
        })
    }, [id])

    function logoutUser() {
        clearUserToken()
        setUser(null)
        setUserID(null)
        setAuth(null)
        navigate(`/`)
    }

    function loaded() {

        function findPostsByOwner(owner) {
            let userPosts = []
            for (let i = 0; i < posts.length; i++) {
                if (owner === posts[i].owner) {
                    userPosts.push(posts[i])
                }
            }
            return userPosts
        }

        const userPosts = findPostsByOwner(profile._id)
        const isOwner = currentUserID === profile._id

        return (
            <div className="profile-container">
                <div className="details">
                    {profile.username ? <h1>User profile: {profile.username}</h1> : null}
                    {profile.age ? <p>Age: {profile.age}</p> : null}
                    {profile.location ? <p>Location: {profile.location}</p> : null}
                    {profile.bio ? <p>Bio: {profile.bio}</p> : null}
                    {isOwner ? <>
                        <br />
                        <button onClick={logoutUser} className="logout-button">Log Out</button>
                        {/* <EditProfile data={profile} /> */}
                    </> : null}
                </div>
                <br />
                {userPosts.length ? <>
                    {profile.username ? <><p>Posts from {profile.username}:</p>
                        <br /></> : null}
                    <div className="posts-container">{userPosts.map((post) => (
                        <Link to={`/post/${post._id}`} key={post._id}>
                            <div className="post">
                                {post.owner ? <p>{profile.username}</p> : null}
                                <img alt={post.tags} src={post.image} />
                                {post.description ? <p className="post-description">{post.description}</p> : null}
                                <p className="post-tags">
                                    {post.tags.map((tag) => `#${tag} `)}
                                </p>
                            </div>
                        </Link>
                    ))}</div>
                </> : <p className="details">No posts to show from user</p>}
            </div>
        )
    }

    function loading() {
        return (
            <h1>
                Loading...&nbsp;
                <img
                    className="spinner"
                    src="https://freesvg.org/img/1544764567.png"
                    alt="Loading animation"
                />
            </h1>
        )
    }

    return (
        <section className="Profile">
            {profile &&
                posts.length &&
                id === profile._id ?
                loaded() : loading()
            }
        </section>
    )
}