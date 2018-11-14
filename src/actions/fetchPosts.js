import { API_BASE_URL } from '../config';

export const FETCH_POSTS_REQUEST = 'FETCH_POSTS_REQUEST';
export const fetchPostsRequest = () => ({
    type: FETCH_POSTS_REQUEST
});

export const FETCH_POSTS_SUCCESS = 'FETCH_POSTS_SUCCESS';
export const fetchPostsSuccess = posts => ({
    type: FETCH_POSTS_SUCCESS,
    posts
});

export const FETCH_POSTS_ERROR = 'FETCH_POSTS_ERROR';
export const fetchPostsError = error => ({
    type: FETCH_POSTS_ERROR,
    error
})

export const fetchPosts = (num, category) => dispatch => {
    dispatch(fetchPostsRequest());
    let cat = category ? category : ' ';

    fetch(`${API_BASE_URL}/${cat}/${num}`)
        .then(res => {
            return res.json()
        })
        .then(posts => {
            return dispatch(fetchPostsSuccess(posts))
        })
        .catch(err => dispatch(fetchPostsError(err)));
}