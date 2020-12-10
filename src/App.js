import { Button, emphasize, Input, makeStyles, Modal } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./App.css";
import { auth, db } from "./firebase";
import ImageUpload from "./ImageUpload";
import Post from "./Post";
import InstagramEmbed from "react-instagram-embed";

const useStyles = makeStyles((theme) => ({
  modal: {
    padding: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [user, setUser] = useState(null);

  const classes = useStyles();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, [user, username]);

  const signUp = (e) => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => {
        alert(error.message);
        setUsername("");
        setEmail("");
        setPassword("");
      });

    setOpen(false);
  };

  const signIn = (e) => {
    e.preventDefault();

    auth.signInWithEmailAndPassword(email, password).catch((error) => {
      alert(error.message);
      setEmail("");
      setPassword("");
    });

    setOpenSignIn(false);
  };

  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        className={classes.modal}
      >
        <div className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className=""
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="instagram"
              />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        className={classes.modal}
      >
        <div className={classes.paper}>
          <form className="app__signin">
            <center>
              <img
                className=""
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="instagram"
              />
            </center>
            <Input
              placeholder="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>

      <div className="app__container">
        <div className="app__header">
          <img
            className="app__headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="instagram"
          />
          {user ? (
            <Button color="secondary" onClick={() => auth.signOut()}>
              Sign Out
            </Button>
          ) : (
            <div className="app__loginContainer">
              <Button
                className={classes.button}
                color="primary"
                onClick={() => setOpenSignIn(true)}
              >
                Sign In
              </Button>
              <Button color="primary" onClick={() => setOpen(true)}>
                Sign Up
              </Button>
            </div>
          )}
        </div>

        <div className="app__posts">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
              date={post.date}
            />
          ))}
        </div>
      </div>
      <hr />
      <div className="app__footer">
        {user?.displayName ? (
          <ImageUpload username={user.displayName} />
        ) : (
          <h3 align="center">⚠️ Sorry, you need to login to upload</h3>
        )}
      </div>
    </div>
  );
}

export default App;
