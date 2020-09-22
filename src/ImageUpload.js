import React, { useState } from "react";
import { Button } from "@material-ui/core";
import firebase from 'firebase'
import { storage, db } from "./firebase";
import './ImageUpload.css'

function ImageUpload({username}) {
	const [image, setImage] = useState(null);
	const [progress, setProgress] = useState(0);
	const [caption, setCaption] = useState("");

	//event handlers
	const handleChange = (e) => {
		if (e.target.files[0]) {
			//set the state of the images
			setImage(e.target.files[0]);
		}
	};
	//image upload
	const handleUpload = () => {
		const uploadTask = storage.ref(`images/${image.name}`).put(image);
		uploadTask.on(
			"state_changed",
			(snapshot) => {
				//progress function of image uploading
				const progress = Math.round(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100
				);
				setProgress(progress);
			},
			(error) => {
				//error function
				console.log(error);
				alert(error.message);
			},
			() => {
				//get download link 
				storage
					.ref("images")
					.child(image.name)
					.getDownloadURL()
					.then(url => {
						db.collection("posts").add({
							//get the latest timestamp
							timestamp: firebase.firestore.FieldValue.serverTimestamp(),
							caption: caption,
							imageUrl: url,
							username: username
						})
						setProgress(0);
						setCaption("");
						setImage(null)
					});
			}
		);
	};
	return (
        <div className="imageUpload">
            <progress className="imageUplaod__progresss" value={progress} max="100" />
			<input
				type="text"
				placeholder="Enter a caption ...."
				onChange={(event) => setCaption(event.target.value)}
				value={caption}
			/>
			<input type="file" onChange={handleChange} />
			<Button onClick={handleUpload}> Upload </Button>
		</div>
	);
}

export default ImageUpload;
