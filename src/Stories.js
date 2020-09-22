import React, { useState } from "react";
import Stories from "react-insta-stories";
function Storie() {
    const [stories] =useState()
	return (
		<div className="story__Begins">
            <Stories 
                stories={stories}
                defaultInterval={1500}
                width={432}
                height={768}

            />
		</div>
	);
}

export default Storie;
