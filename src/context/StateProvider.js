import React, {useState, createContext} from "react";

export const stateContext = createContext()


function StateProvider (props) {

	// const [client, setClient] = useState({
	// 																			id: "", 
	// 																			businessName: "", 
	// 																			slug: ""
	// });

	const [currentUser, setCurrentUser] = useState (null);

	return (

		// <stateContext.Provider value = { { client, setClient } }>
		<stateContext.Provider value = { { currentUser, setCurrentUser } }>
			{props.children}
		</stateContext.Provider >
	)

}

export default StateProvider