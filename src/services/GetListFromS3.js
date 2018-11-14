// http://localhost:4000/uploads/post-one
import { API_BASE } from '../config';


export const getListFromS3 = (bucket) => {
    return fetch(`${API_BASE}/uploads/${bucket}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((value) => {
            return value.data.Contents.map(el => el.Key)
        })
        .catch(error => console.log(error));
}

export const deleteListFromS3 = (path, file) => {

    var data = new FormData()
    data.append('fileToDelete', file);

    console.log(path, file);

    return fetch(`${API_BASE}/uploads/${path}/${file}`, {
        method: 'DELETE',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
        },
    })
        .then((res) => res.json())
        .then((value) => {
            return value
        })
        .catch(error => console.log(error));
}


export const addToListS3 = (bucket, image) => {
    const imageFile = new FormData()
    imageFile.append('image', image);

    return fetch(`http://localhost:4000/uploads/${bucket}`, {
        method: 'POST',
        body: imageFile,
        headers: {
            'Accept': 'application/json',
        }
    })
        .then((res) => res.json())
        .then((data) => data)
        .catch(err => err)
}