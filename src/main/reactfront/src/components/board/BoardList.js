import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Avatar,
    Container,
    Typography,
    Box, Paper
} from '@mui/material';
import Navigation from "../../views/Navigation";

const BoardList = () => {
    const [boards, setBoards] = useState([]);
    const [user, setUser] = useState({});
    const navigation = useNavigate();
    const [cookies] = useCookies(['token']);
    const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지 상태 변수
    const postsPerPage = 10;

    useEffect(() => {
        const fetchBoardsAndComments = async () => {
            try {
                const boardResponse = await axios.get('/board');
                console.log(boardResponse);
                const boardsWithComments = await Promise.all(boardResponse.data.map(async board => {
                    const commentResponse = await axios.get(`/board/${board.boardNumber}/comments`);
                    return {
                        ...board,
                        commentCount: commentResponse.data.length
                    };
                }));
                console.log(boardsWithComments);
                setBoards(boardsWithComments);
            } catch (error) {
                console.error("Error fetching boards and comment counts:", error);
            }
        };

        fetchBoardsAndComments();

        const fetchUserData = async () => {
            const token = cookies.token;

            if (token) {
                try {
                    const userDetails = await axios.get('/api/auth/currentUser', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setUser(userDetails.data);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchUserData();
    }, [cookies.token]);

    const handleTitleClick = async (board) => {
        try {
            if (user.userId !== board.boardWriterId) { // 작성자와 현재 사용자가 다른 경우에만
                await axios.post(`/board/${board.boardNumber}/incrementView`);
            }
            navigation(`/boardDetail/${board.boardNumber}`);
        } catch (error) {
            console.error("Error incrementing view count:", error);
        }
    }

    const indexOfLastPost = currentPage * postsPerPage;  // 현재 페이지의 마지막 게시물 인덱스
    const indexOfFirstPost = indexOfLastPost - postsPerPage;  // 현재 페이지의 첫 번째 게시물 인덱스
    const currentPosts = boards.slice(indexOfFirstPost, indexOfLastPost);  // 현재 페이지의 게시물들

    const totalPages = Math.ceil(boards.length / postsPerPage);  // 총 페이지 수

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div>
            <Navigation/>
            <div align="center" style={{ paddingTop: '150px' }}>
                <Container maxWidth="md" style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '15px',
                    padding: '20px',
                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)', // 그림자 추가
                    backgroundColor: 'white' // 배경색 추가
                }}>
                    <Box display="flex" justifyContent="center" marginBottom="10px">
                        <Typography variant="h4" gutterBottom>
                            영상 공유 게시판
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="center">
                        <Typography variant="h6" style={{ marginBottom: '5px', color: '#333' }}>
                            요약한 영상을 공유해보세요❤️
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="flex-end" style={{ marginBottom: '20px' }}>
                        <Button variant="contained" color="primary" onClick={() => navigation('/boardAdd')}>
                            글작성
                        </Button>
                    </Box>
                    <Paper elevation={3} style={{borderRadius: '8px'}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>글번호</TableCell>
                                    <TableCell>제목</TableCell>
                                    <TableCell>작성자</TableCell>
                                    <TableCell>작성 날짜</TableCell>
                                    <TableCell>조회수</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentPosts.map(board => (
                                    <TableRow key={board.boardNumber}>
                                        <TableCell>{board.boardNumber}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleTitleClick(board)}>
                                                {board.boardTitle}
                                                <span style={{marginLeft: '10px', color: 'grey'}}>
                                            ({board.commentCount})
                                        </span>
                                            </Button>
                                        </TableCell>
                                        <TableCell>{board.boardWriterId}</TableCell>
                                        <TableCell>{board.boardWriteDate}</TableCell>
                                        <TableCell>{board.boardClickCount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                    <Box display="flex" justifyContent="space-between" style={{marginTop: '20px'}}>
                        <Button onClick={prevPage} disabled={currentPage === 1}>Previous</Button>
                        <Button onClick={nextPage} disabled={currentPage === totalPages}>Next</Button>
                    </Box>
                </Container>
            </div>
        </div>
    );
}

export default BoardList;