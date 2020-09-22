import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { db, auth } from "./firebase";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from "react-instagram-embed";
function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const useStyles = makeStyles((theme) => ({
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
	//stores the set of states to be passed
	const classes = useStyles();
	const [modalStyle] = useState(getModalStyle);
	const [posts, setPosts] = useState([]);
	const [open, setOpen] = useState(false);
	const [openSignIn, setOpenSignIn] = useState(false);
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [user, setUser] = useState(null); //handle user sessions

	//listens auny single time a authentication happens
	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((authUser) => {
			if (authUser) {
				//log in user
				setUser(authUser);
			} else {
				//user logged out
				setUser(null);
			}
		});
		return () => {
			//perfom cleanup actions to avoid spamming(detatch)
			unsubscribe();
		};
	}, [user, username]);
	//useEffects runs code based on a specific condition
	useEffect(() => {
		//code run begins here pulling from database  //onsnapshot fires off when a single change happens
		db.collection("posts")
			.orderBy("timestamp", "desc")
			.onSnapshot((snapshot) => {
				//looops through the firebase database and gets a given id
				setPosts(
					snapshot.docs.map((doc) => ({
						id: doc.id,
						post: doc.data(),
					}))
				);
			});

		//code runs only once when it refreshes
	}, []);
	//signup event
	const signUp = (event) => {
		event.preventDefault();
		//create user
		auth.createUserWithEmailAndPassword(email, password)
			.then((authUser) => {
				return authUser.user.updateProfile({
					displayName: username,
				});
			})
			//throw any error at modal through backend validation of firebase
			.catch((error) => alert(error.message));
	};
	const signIn = (event) => {
		event.preventDefault();
		auth.signInWithEmailAndPassword(email, password).catch((error) =>
			alert(error.message)
		);
		//modal closses after sign in
		setOpenSignIn(false);
	};
	return (
		<div className="App">
			<Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
				<div style={modalStyle} className={classes.paper}>
					<form type="submit" className="app__signup">
						<center>
							<img
								className="app__headerImage"
								src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
								alt=""
							/>
						</center>
						<Input
							placeholder="email"
							type="text"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Input
							placeholder="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button onClick={signIn}>Sign in</Button>
					</form>
				</div>
			</Modal>
			<Modal open={open} onClose={() => setOpen(false)}>
				<div style={modalStyle} className={classes.paper}>
					<form type="submit" className="app__signup">
						<center>
							<img
								className="app__headerImage"
								src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
								alt=""
							/>
						</center>
						<Input
							placeholder="username"
							type="usernmae"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
						<Input
							placeholder="email"
							type="text"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Input
							placeholder="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button onClick={signUp}>Sign Up</Button>
					</form>
				</div>
			</Modal>
			<div className="app__header">
				<img
					className="app__headerImage"
					src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
					alt=""
				/>
				{user ? (
					<Button onClick={() => auth.signOut()}>Log out</Button>
				) : (
					<div className="app__loginContainer">
						<Button onClick={() => setOpenSignIn(true)}>
							Sign In
						</Button>
						<Button onClick={() => setOpen(true)}>Sign Up</Button>
					</div>
				)}
			</div>
			<div className="app__posts">
				<div className="app__postsLeft">
					{posts.map(({ id, post }) => (
						<Post
							key={id} postId={id}
							user={user}
							username={post.username}
							caption={post.caption}
							imageUrl={post.imageUrl}
						/>
					))}
				</div>
				<div className="app__postsRight">
					<InstagramEmbed
						url="https://www.instagram.com/p/B4-RE5YHd0d/"
						maxWidth={320}
						hideCaption={false}
						containerTagName="div"
						protocol=""
						injectScript
						onloading={() => {}}
						onSuccess={() => {}}
						onAfterRender={() => {}}
						onFailure={() => {}}
					/>
				</div>
			</div>
			{user?.displayName ? (
				<ImageUpload username={user.displayName} />
			) : (
				<h3>Sorry you need to login to upload</h3>
			)}
		</div>
	);
}

export default App;
