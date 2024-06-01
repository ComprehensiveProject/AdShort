import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {Button, TextField, Container, Typography, Box, Paper} from '@mui/material';

const BoardEdit = () => {
    const [board, setBoard] = useState({ boardTitle: '', boardContent: '' });
    const [selectedImage, setSelectedImage] = useState(null); // 선택된 이미지 파일
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const { boardId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBoardDetail = async () => {
            try {
                const response = await axios.get(`/board/${boardId}`);
                setBoard(response.data);
                setImagePreview(response.data.boardImage);
                setVideoPreview(response.data.boardVideo);
            } catch (error) {
                console.error("Error fetching board details:", error);
            }
        };

        fetchBoardDetail();
    }, [boardId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBoard(prevState => ({ ...prevState, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);

            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target.result);
            }
            reader.readAsDataURL(file);
        }
    };

    const handleVideoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedVideo(file);

            const reader = new FileReader();
            reader.onload = (event) => {
                setVideoPreview(event.target.result);
            }
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append('boardTitle', board.boardTitle);
            formData.append('boardContent', board.boardContent);
            if (selectedImage) {
                formData.append('boardImage', selectedImage);
            }
            if (selectedVideo) {
                formData.append('boardVideo', selectedVideo);
            }

            await axios.put(`/board/${boardId}`, formData);
            navigate(`/boardDetail/${boardId}`);
            alert("수정이 완료되었습니다. ")
        } catch (error) {
            console.error("Error updating board:", error);
        }
    };

    return (
        <div style={{ paddingTop: '150px' }}>
            <Container maxWidth="md">
                <Paper elevation={3} style={{ padding: '20px', borderRadius: '8px' }}>
                    <Typography variant="h4" gutterBottom align="center">
                        게시물 수정하기
                    </Typography>

                    <TextField
                        fullWidth
                        label="제목"
                        name="boardTitle"
                        variant="outlined"
                        value={board.boardTitle}
                        onChange={handleInputChange}
                        style={{ marginBottom: '20px' }}
                    />

                    <TextField
                        fullWidth
                        label="내용"
                        name="boardContent"
                        variant="outlined"
                        multiline
                        rows={4}
                        value={board.boardContent}
                        onChange={handleInputChange}
                    />

                    <Box mt={2}>
                        {imagePreview && <img src={imagePreview} alt="Post Preview" style={{ width: '100%', maxHeight: 300, marginBottom: '20px', borderRadius: 0 }} />}
                        {videoPreview && <img src={videoPreview} alt="Post Preview" style={{ width: '100%', maxHeight: 300, marginBottom: '20px', borderRadius: 0 }} />}
                        <input accept="image/*" style={{ display: 'none' }} id="board-image-input" type="file" onChange={handleImageChange} />
                        <input accept="video/*" style={{ display: 'none' }} id="board-video-input" type="file" onChange={handleVideoChange} />
                        <label htmlFor="board-image-input">
                            <Button variant="contained" component="span">사진 변경</Button>
                        </label>
                        <label htmlFor="board-video-input">
                            <Button variant="contained" component="span" style={{ marginLeft: '10px' }}>비디오 변경</Button>
                        </label>
                    </Box>

                    <Button variant="contained" color="primary" onClick={handleUpdate} style={{ marginTop: '20px' }}>
                        수정하기
                    </Button>
                </Paper>
            </Container>
        </div>
    );
}

export default BoardEdit;