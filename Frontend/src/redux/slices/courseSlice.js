import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiRequest from '../../utils/ApiRequest';
import { showSnackbar } from './snackbarSlice';

const initialState = {
    getAllCourses: {
        data: [],
        loading: false,
        error: null,
    },
    getCourseDetails: {
        data: null,
        loading: false,
        error: null,
    },
    createCourse: {
        data: null,
        loading: false,
        error: null,
    },
    deleteCourse: {
        data: null,
        loading: false,
        error: null,
    },
    getSubTopicsForCourse: {
        data: [],
        loading: false,
        error: null,
    },
    getCourseTopics:{
        data: [],
        loading: false,
        error: null,
    },
};

export const getAllCourses = createAsyncThunk(
    'course/getAllCourses',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const response = await ApiRequest.get('topics');
            return response.data;
        } catch (error) {
            dispatch(showSnackbar({
                message: error?.response?.data?.message || 'Failed to fetch courses',
                severity: 'error'
            }));
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

export const getCourseDetails = createAsyncThunk(
    'course/getCourseDetails',
    async (courseId, { rejectWithValue, dispatch }) => {
        try {
            const response = await ApiRequest.get(`courses/${courseId}`);
            return response.data;
        } catch (error) {
            dispatch(showSnackbar({
                message: error?.response?.data?.message || 'Failed to fetch course details',
                severity: 'error'
            }));
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

export const createCourse = createAsyncThunk(
    'course/createCourse',
    async (courseData, { rejectWithValue, dispatch }) => {
        try {
            const response = await ApiRequest.post('courses', courseData);
            dispatch(showSnackbar({
                message: 'Course created successfully',
                severity: 'success'
            }));
            return response.data;
        } catch (error) {
            dispatch(showSnackbar({
                message: error?.response?.data?.message || 'Failed to create course',
                severity: 'error'
            }));
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

export const deleteCourse = createAsyncThunk(
    'course/deleteCourse',
    async (courseId, { rejectWithValue, dispatch }) => {
        try {
            const response = await ApiRequest.delete(`courses/${courseId}`);
            dispatch(showSnackbar({
                message: 'Course deleted successfully',
                severity: 'success'
            }));
            return response.data;
        } catch (error) {
            dispatch(showSnackbar({
                message: error?.response?.data?.message || 'Failed to delete course',
                severity: 'error'
            }));
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

export const getSubTopicsForCourse = createAsyncThunk(
    'course/getSubTopicsForCourse',
    async (courseId, { rejectWithValue, dispatch }) => {
        try {
            const response = await ApiRequest.get(`courses/${courseId}/subtopics`);
            return response.data;
        } catch (error) {
            dispatch(showSnackbar({
                message: error?.response?.data?.message || 'Failed to fetch subtopics',
                severity: 'error'
            }));
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

export const getCourseTopics = createAsyncThunk(
    'course/getCourseTopics',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const response = await ApiRequest.get(`api/topics`);
            return response.data;
        } catch (error) {
            dispatch(showSnackbar({
                message: error?.response?.data?.message || 'Failed to fetch topics',
                severity: 'error'
            }));
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllCourses.pending, (state) => {
            state.getAllCourses.loading = true;
        });
        builder.addCase(getAllCourses.fulfilled, (state, action) => {
            state.getAllCourses.loading = false;
            state.getAllCourses.data = action.payload;
        });
        builder.addCase(getAllCourses.rejected, (state, action) => {
            state.getAllCourses.loading = false;
            state.getAllCourses.error = action.payload;
        })
        builder.addCase(getCourseDetails.pending, (state) => {
            state.getCourseDetails.loading = true;
        });
        builder.addCase(getCourseDetails.fulfilled, (state, action) => {
            state.getCourseDetails.loading = false;
            state.getCourseDetails.data = action.payload;
        })
        builder.addCase(getCourseDetails.rejected, (state, action) => {
            state.getCourseDetails.loading = false;
            state.getCourseDetails.error = action.payload;
        })
        builder.addCase(createCourse.pending, (state) => {
            state.createCourse.loading = true;
        });
        builder.addCase(createCourse.fulfilled, (state, action) => {    
            state.createCourse.loading = false;
            state.createCourse.data = action.payload;
        })
        builder.addCase(createCourse.rejected, (state, action) => {
            state.createCourse.loading = false;
            state.createCourse.error = action.payload;
        })  
        builder.addCase(deleteCourse.pending, (state) => {
            state.deleteCourse.loading = true;
        });
        builder.addCase(deleteCourse.fulfilled, (state, action) => {
            state.deleteCourse.loading = false;
            state.deleteCourse.data = action.payload;
        })  
        builder.addCase(deleteCourse.rejected, (state, action) => {
            state.deleteCourse.loading = false; 
            state.deleteCourse.error = action.payload;
        })
        builder.addCase(getSubTopicsForCourse.pending, (state) => {
            state.getSubTopicsForCourse.loading = true;
        });
        builder.addCase(getSubTopicsForCourse.fulfilled, (state, action) => {
            state.getSubTopicsForCourse.loading = false;
            state.getSubTopicsForCourse.data = action.payload;
        })
        builder.addCase(getSubTopicsForCourse.rejected, (state, action) => {
            state.getSubTopicsForCourse.loading = false;
            state.getSubTopicsForCourse.error = action.payload;
        })
        builder.addCase(getCourseTopics.pending, (state) => {
            state.getCourseTopics.loading = true;
        });
        builder.addCase(getCourseTopics.fulfilled, (state, action) => {
            state.getCourseTopics.loading = false;
            state.getCourseTopics.data = action.payload;
        })
        builder.addCase(getCourseTopics.rejected, (state, action) => {
            state.getCourseTopics.loading = false;
            state.getCourseTopics.error = action.payload;
        })  
    },
});

export const { } = courseSlice.actions;
export default courseSlice.reducer;
