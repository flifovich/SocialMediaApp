
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/button/Button";
import { LeftSidebar } from "../../components/LeftSidebar/LeftSidebar";
import { RightSidebar } from "../../components/RightSidebar/RightSidebar";
import classes from "./Feed.module.scss";
import { useAuthentication } from "../../../authentication/contexts/AuthenticationContextProvider";
import { useEffect, useState } from "react";
import { Post } from "../../components/Post/Post";
import { Modal } from "../../components/Modal/Modal";

export function Feed(){
    const navigate = useNavigate();
    const { user } = useAuthentication();
    const [feedContent, setFeedContent] = useState<"all" | "connections">("connections")
    const [showPostingModal, setShowPostingModal] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPosts = async () => {
            try{
                const response = await fetch(import.meta.env.VITE_API_URL + 
                    "/feed" +
                    (feedContent === "connections" ? "" : "/posts"),

                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                if (!response.ok) {
                    const { message } = await response.json();
                    throw new Error(message);
                }
                const data = await response.json();
                setPosts(data);
            }catch (error) {
                if(error instanceof Error){
                    setError(error.message);
                }else {
                    setError("An error occured. Please try again later.")
                }
            }
        };
        fetchPosts();
    }, [feedContent]);

    
    

    const handlePost = async (content: string, picture: string) => {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + "/feed/posts",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ content, picture }),
                }
            );
            if (!response.ok) {
                const { message } = await response.json();
                throw new Error(message);
            }
            const newPost = await response.json();
            setPosts((prevPosts) => [newPost, ...prevPosts]);
        }catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An error occurred. Please try again later.");
            }
        }
    }

    return (
        <div className={classes.root}>
            <div className={classes.left}>
                <LeftSidebar />
            </div>
            <div className={classes.center}>
                <div className={classes.posting}>
                    <button
                        onClick={() => {
                            navigate('/profile/${user?.id}');
                        }}
                    >
                        <img 
                            src={user?.profilePicture || "/avatar.png"}
                            alt=""
                            className={`${classes.top} ${classes.avatar}`}
                        />
                    </button>
                    <Button size="large" outline onClick={() => setShowPostingModal(true)}>
                        What are you thinking?
                    </Button>
                    <Modal
                        title="Create post" 
                        onSubmit={handlePost}
                        showModal={showPostingModal}
                        setShowModal={setShowPostingModal}
                    />
                </div>
                {error && <div className={classes.error}>{error}</div>}
                <div className={classes.header}>
                    <button 
                        className={feedContent === "all" ? classes.active : ""}
                        onClick={() => setFeedContent("all")}
                    >
                        All
                    </button>
                    <button 
                        className={feedContent === "connections" ? classes.active : ""}
                        onClick={() => setFeedContent("connections")}
                    >
                        Feed
                    </button>
                </div>
                <div className={classes.feed}>
                {posts.map((post) => (
                    <Post key={post.id} post={post} setPosts={setPosts} />
                ))}
            </div>
            </div>
            
            <div className={classes.right}>
                <RightSidebar />
            </div>
        </div>
    );
}