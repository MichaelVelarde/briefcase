import axios from 'axios';

export const getData = async (coleccion) => {

  try {
		const response = await axios.get('http://localhost:5050/api/'+coleccion);
    return response.data;
	}
	catch (error) {
		console.log(error);
    return null;
	}
}
export const saveData = async (coleccion, body) => {

	try {
		const response = await axios.post('http://localhost:5050/api/'+coleccion , body);
		return response.data;
	}
	catch (error) {
		console.log(error);
		return null;
	}
}
export const removeData = async (coleccion, id) => {
	try {
		const response = await axios.delete('http://localhost:5050/api/'+coleccion +"/"+ id);
		return response.data;
	}
	catch (error) {
		console.log(error);
		return null;
	}
}
export const editData = async (coleccion,body, id) => {
	try {
		const response = await axios.put('http://localhost:5050/api/'+coleccion +"/"+ id , body);
		return response.data;
	}
	catch (error) {
		console.log(error);
		return null;
	}
}

//: /:id/:idInsumo/:cantidad
export const updateByIdAnValue = async (coleccion,id, value) => {
	try {
		const response = await axios.put('http://localhost:5050/api/'+coleccion +"/"+ id +"/"+value);
		return response.data;
	}
	catch (error) {
		console.log(error);
		return null;
	}
}