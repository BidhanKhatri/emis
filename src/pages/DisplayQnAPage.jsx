import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Box,
  Text,
  Button,
  Input,
  Collapse,
  FormControl,
  Flex,
  IconButton,
  VStack,
  HStack,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { CheckIcon, EditIcon } from "@chakra-ui/icons";

import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { AuthContext } from "../context/AuthContext";
import LoadingGif from "../assets/loading-gif.gif";

const DisplayQnAPage = () => {
  const [qnas, setQnas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [answerName, setAnswerName] = useState("");
  const [editedQuestionName, setEditedQuestionName] = useState("");
  const [myQnAs, setMyQnAs] = useState([]);
  const [editingQnAId, setEditingQnAId] = useState(null);
  const [expandedQnAId, setExpandedQnAId] = useState(null);
  const [userID, setUserID] = useState("");
  const [subjectID, setSubjectID] = useState("");
  const [isMyQuestions, setIsMyQuestions] = useState(false); // State for toggling "My Questions"
  const toast = useToast();
  const { userRole } = useContext(AuthContext);
  const { userIdLogin } = useContext(AuthContext);
  const { authToken } = useContext(AuthContext);

  const fetchQnAs = async () => {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${authToken.access}`,
      },
    };

    try {
      const response = await axios.get(
        `/proxy/roles/community/getdata/`,
        config
      );
      setQnas(response.data.results);
      setError("");
    } catch (error) {
      setError("Failed to fetch QnAs.");
      toast({
        title: "Error fetching QnAs",
        description: error.response?.data?.message || "An error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleFilterQuestions = async () => {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${authToken.access}`,
      },
    };
    try {
      const response = await axios.post(
        `/proxy/roles/community/filterQuestions/`,
        { userID, subjectID },
        config
      );
      setQnas(response.data);
      setError("");
    } catch (error) {
      setError("Failed to filter questions.");
      toast({
        title: "Error filtering questions",
        description: error.response?.data?.message || "An error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyAnswer = async (qid, aid) => {
    const config = {
      headers: {
        Authorization: `Bearer ${authToken.access}`,
        "Content-Type": "application/json",
      },
    };
    const payload = { qid, aid };
    try {
      await axios.post(
        `/proxy/roles/community/verifiedAnswerForQuestions/`,
        payload,
        config
      );
      toast({
        title: "Answer Verified",
        description: "The answer has been verified successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchQnAs();
    } catch (error) {
      toast({
        title: "Error Verifying Answer",
        description:
          error.response?.data?.message ||
          "An error occurred while verifying the answer.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpvote = async (aid) => {
    const config = {
      headers: {
        Authorization: `Bearer ${authToken.access}`,
        "Content-Type": "application/json",
      },
    };

    const payload = { qid: qid, vote: 1 };

    try {
      await axios.post(`/proxy/roles/community/scoreSection/`, payload, config);
      toast({
        title: "Upvoted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchQnAs();
    } catch (error) {
      toast({
        title: "Error upvoting",
        description: "Could not upvote. Try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const handleAddAnswer = async (qid) => {
    const answerData = { answerName, qid };
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authToken.access}`,
          "Content-Type": "application/json",
        },
      };
      const answerResponse = await axios.post(
        `/proxy/roles/community/answers/create/`,
        answerData,
        config
      );
      toast({
        title: "Answer Added",
        description: "Answer has been added successfully!",
        status: "success",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
      setAnswerName("");
    } catch (error) {
      console.error(
        "Error adding answer:",
        error.response?.data || error.message
      );
      toast({
        title: "Error Adding Answer",
        description:
          error.response?.data?.message ||
          error.message ||
          "An error occurred while creating the QnA.",
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDownvote = async (aid) => {
    const config = {
      headers: {
        Authorization: `Bearer ${authToken.access}`,
        "Content-Type": "application/json",
      },
    };
    const payload = { aid: aid, vote: 0 };
    try {
      await axios.post(`/proxy/roles/community/scoreSection/`, payload, config);
      toast({
        title: "Downvoted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchQnAs();
    } catch (error) {
      toast({
        title: "Error downvoting",
        description: "Could not downvote. Try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteQnA = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${authToken.access}`,
        "Content-Type": "application/json",
      },
    };
    try {
      await axios.delete(
        `/proxy/roles/community/questions/delete/${id}/`,
        config
      );
      fetchQnAs();
      toast({
        title: "QnA Deleted",
        description: "QnA has been deleted successfully!",
        status: "success",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error Deleting QnA",
        description:
          error.response?.data?.error ||
          "An error occurred while deleting the QnAs.",
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const handleUpdateQuestion = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${authToken.access}`,
        "Content-Type": "application/json",
      },
    };
    const payload = { questionName: editedQuestionName };
    try {
      await axios.put(
        `/proxy/roles/community/questions/edit/${id}/`,
        payload,
        config
      );
      toast({
        title: "Question Updated",
        description: "The question has been updated successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setQnas((prevQnAs) =>
        prevQnAs.map((qna) =>
          qna.qid === id ? { ...qna, questionName: editedQuestionName } : qna
        )
      );
      setEditingQnAId(null);
    } catch (error) {
      toast({
        title: "Error Updating Question",
        description: error.response?.data?.message || "An error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const filteredQnAs = qnas
    .filter((qna) =>
      qna.questionName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((qna) => {
      // Show only user's questions if "My Questions" is selected
      if (isMyQuestions) return qna.user.id === userIdLogin;
      return true; // Show all questions if "All Questions" is selected
    });

  useEffect(() => {
    fetchQnAs();
  }, []);

  if (loading) {
    return (
      <Flex direction="column" align="center" justify="center" height="75vh">
        <img src={LoadingGif} alt="Loading..." className="h-16 w-16" />
        <Text fontSize="lg">Loading QnAs...</Text>
      </Flex>
    );
  }

  return (
    <Box p="0" mt={{ base: "105", lg: "0" }}>
      <Flex
        mb="4"
        alignItems={{ base: "left", lg: "center" }}
        gap="4"
        direction={{ base: "column", md: "row" }}
      >
        <FormControl flex="1">
          <Input
            placeholder="Enter User ID"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
            backgroundColor="white"
            borderColor="gray.300"
            _hover={{ borderColor: "gray.500" }}
            _focus={{ borderColor: "teal.500" }}
            padding="6"
            borderRadius="md"
          />
        </FormControl>

        <FormControl flex="1">
          <Input
            placeholder="Enter Subject ID"
            value={subjectID}
            onChange={(e) => setSubjectID(e.target.value)}
            backgroundColor="white"
            borderColor="gray.300"
            _hover={{ borderColor: "gray.500" }}
            _focus={{ borderColor: "teal.500" }}
            padding="6"
            borderRadius="md"
          />
        </FormControl>

        <Input
          placeholder="Search QnAs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          backgroundColor="white"
          flex="2"
          borderColor="gray.300"
          _hover={{ borderColor: "gray.500" }}
          _focus={{ borderColor: "teal.500" }}
          padding="6"
          borderRadius="md"
        />
        <Button
          bg="blue.600"
          color="white"
          _hover={{ bg: "blue.700" }}
          _active={{ bg: "blue.800" }}
          onClick={handleFilterQuestions}
          size="lg"
          boxShadow="lg"
          paddingX="8"
          marginBottom={{ base: "2", lg: "0" }}
        >
          Filter Questions
        </Button>
      </Flex>
      <Button
        bg="blue.600"
        color="white"
        _hover={{ bg: "blue.700" }}
        _active={{ bg: "blue.800" }}
        onClick={() => setIsMyQuestions(!isMyQuestions)}
        size="lg"
        boxShadow="lg"
        paddingX="8"
        marginBottom={"6"}
      >
        {isMyQuestions ? "Show All Questions" : "My Questions"}
      </Button>

      {error && <Text color="red.500">{error}</Text>}

      <VStack spacing="4" align="stretch">
        {filteredQnAs.map((qna) => (
          <Box
            key={qna.qid}
            p="4"
            borderWidth="1px"
            borderRadius="md"
            shadow="md"
            bg="white"
          >
            <Flex alignItems="center">
              <Box flex="1">
                {editingQnAId === qna.qid ? (
                  <>
                    <Input
                      value={editedQuestionName}
                      onChange={(e) => setEditedQuestionName(e.target.value)}
                      placeholder="Edit Question Name"
                    />
                    <HStack mt="2">
                      <Button
                        colorScheme="blue"
                        onClick={() => handleUpdateQuestion(qna.qid)}
                      >
                        Save
                      </Button>
                      <Button
                        colorScheme="gray"
                        onClick={() => setEditingQnAId(null)}
                      >
                        Cancel
                      </Button>
                    </HStack>
                  </>
                ) : (
                  <>
                    <Text fontWeight="bold">{qna.questionName}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {qna.user.username} | {qna.subject.subjectName} |{" "}
                      {new Date(qna.date).toLocaleString()}
                    </Text>
                  </>
                )}

                <HStack mt="2">
                  {qna.user.id === userIdLogin && (
                    <>
                      <Button
                        size="sm"
                        colorScheme="green"
                        onClick={() => {
                          setEditingQnAId(qna.qid);
                          setEditedQuestionName(qna.questionName);
                        }}
                      >
                        Update
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDeleteQnA(qna.qid)}
                      >
                        Delete
                      </Button>
                    </>
                  )}

                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() =>
                      setExpandedQnAId(
                        expandedQnAId === qna.qid ? null : qna.qid
                      )
                    }
                  >
                    {expandedQnAId === qna.qid
                      ? "Hide Answers"
                      : "Show Answers"}
                  </Button>
                </HStack>

                <Collapse in={expandedQnAId === qna.qid} animateOpacity>
                  <Box mt="4">
                    <Text fontWeight="bold">Answers:</Text>
                    <Box maxHeight="300px" overflowY="auto" bg="gray.50" p="2">
                      {qna.answers
                        .sort((a, b) => {
                          if (a.aid === qna.verifiedAnswerID) return -1;
                          if (b.aid === qna.verifiedAnswerID) return 1;
                          return b.vote_count - a.vote_count;
                        })
                        .map((answer) => (
                          <Box
                            key={answer.aid}
                            p="2"
                            my="2"
                            bg={
                              qna.verifiedAnswerID === answer.aid
                                ? "green.50"
                                : "gray.50"
                            }
                            borderRadius="md"
                          >
                            <Flex alignItems="center">
                              <VStack mr="4">
                                <IconButton
                                  size="sm"
                                  icon={<ChevronUpIcon />}
                                  onClick={() => handleUpvote(answer.aid)}
                                />
                                <Text>{answer.vote_count}</Text>
                                <IconButton
                                  size="sm"
                                  icon={<ChevronDownIcon />}
                                  onClick={() => handleDownvote(answer.aid)}
                                />
                              </VStack>
                              <Box flex="1">
                                <Text
                                  fontWeight={
                                    qna.verifiedAnswerID === answer.aid
                                      ? "bold"
                                      : "normal"
                                  }
                                  color={
                                    qna.verifiedAnswerID === answer.aid
                                      ? "green.600"
                                      : "black"
                                  }
                                >
                                  {answer.answerName}
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                  Answered by {answer.user.username} on{" "}
                                  {new Date(answer.created_at).toLocaleString()}
                                </Text>
                                {qna.verifiedAnswerID === answer.aid &&
                                  userRole !== "Student" && (
                                    <Text
                                      fontSize="sm"
                                      color="green.600"
                                      mt="1"
                                    >
                                      <strong>Verified</strong> by{" "}
                                      {qna.VerifiedBy.username}
                                    </Text>
                                  )}
                              </Box>
                              {qna.verifiedAnswerID !== answer.aid &&
                                userRole !== "Student" && (
                                  <Flex
                                    direction="column"
                                    align="flex-start"
                                    mr="4"
                                  >
                                    <IconButton
                                      aria-label="Verify Answer"
                                      icon={<CheckIcon />}
                                      colorScheme="green"
                                      size="sm"
                                      onClick={() =>
                                        handleVerifyAnswer(qna.qid, answer.aid)
                                      }
                                    />
                                  </Flex>
                                )}
                              {/* 
{answer.user.id === userIdLogin && (
  <Flex direction="column" align="flex-start" mr="4">
    <IconButton
      aria-label="Edit Answer"
      icon={<EditIcon />}
      colorScheme="blue"
      size="sm"
      onClick={() => {
        
      }}
      mb="2" 
    />
  </Flex>
)} */}
                            </Flex>
                          </Box>
                        ))}
                    </Box>

                    <FormControl mt="4">
                      <Input
                        placeholder="Write your answer..."
                        value={answerName}
                        onChange={(e) => setAnswerName(e.target.value)}
                      />
                      <Button
                        mt="2"
                        colorScheme="teal"
                        onClick={() => handleAddAnswer(qna.qid)}
                      >
                        Add Answer
                      </Button>
                    </FormControl>
                  </Box>
                </Collapse>
              </Box>
            </Flex>
            <Divider mt="4" />
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default DisplayQnAPage;
