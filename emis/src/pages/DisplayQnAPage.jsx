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
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { AuthContext } from "../context/AuthContext";
import LoadingGif from "../assets/loading-gif.gif";

const DisplayQnAPage = () => {
  const [qnas, setQnas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [answerName, setAnswerName] = useState(""); // State for questionName

  const [expandedQnAId, setExpandedQnAId] = useState(null);
  const [userID, setUserID] = useState("");
  const [subjectID, setSubjectID] = useState("");
  const toast = useToast();
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

  const handleUpvote = async (qid) => {
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
      console.log("Token:", authToken);

      const config = {
        headers: {
          Authorization: `Bearer ${authToken.access}`,
          "Content-Type": "application/json",
        },
      };

      // Step 1: Create Question
      const answerResponse = await axios.post(
        `/proxy/roles/community/answers/create/`,
        answerData,
        config
      );

      console.log("Question created:", answerResponse.data);

      // Show success message
      toast({
        title: "QnA Created",
        description: "QnA has been created successfully!",
        status: "success",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });

      // Reset fields
      setAnswerName("");
      // setqid("");
    } catch (error) {
      console.error(
        "Error creating QnA:",
        error.response?.data || error.message
      );
      toast({
        title: "Error Creating QnA",
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

  const handleDownvote = async (qid) => {
    const config = {
      headers: {
        Authorization: `Bearer ${authToken.access}`,
        "Content-Type": "application/json",
      },
    };

    const payload = { qid: qid, vote: 0 };

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

  const filteredQnAs = qnas.filter((qna) =>
    qna.questionName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <Box p="6">
      {/* Flex container for horizontal filtering */}
      <Flex
        mb="4"
        alignItems="center"
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
      </Flex>

      <Button
        bg="blue.600"
        color="white"
        _hover={{ bg: "blue.700" }}
        _active={{ bg: "blue.800" }}
        onClick={handleFilterQuestions}
        size="lg"
        boxShadow="lg"
        paddingX="8"
        marginBottom={"6"}
      >
        Filter Questions
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
             <Text fontWeight="bold">{qna.questionName}</Text>
             <Text fontSize="sm" color="gray.500">
               {qna.user.username} {" "} | {" "} 
               {qna.subject.subjectName} {" "} | {" "} 
               {new Date(qna.date).toLocaleString()}{" "}
             </Text>
             <Button
               size="sm"
               mt="2"
               onClick={() =>
                 setExpandedQnAId(expandedQnAId === qna.qid ? null : qna.qid)
               }
             >
               {expandedQnAId === qna.qid ? "Hide Answers" : "Show Answers"}
             </Button>
       
             <Button size="sm" ml="2" mt="2" colorScheme="green">
               Update
             </Button>
             <Button
               size="sm"
               ml="2"
               mt="2"
               colorScheme="red"
               onClick={() => handleDeleteQnA(qna.qid)}
             >
               Delete
             </Button>
       
             <Collapse in={expandedQnAId === qna.qid} animateOpacity>
               <Box mt="4">
                 <Text fontWeight="bold">Answers:</Text>
                 <Box
                   maxHeight="300px" // Set a fixed height for the answers section
                   overflowY="auto" // Add vertical scrollbar when content overflows
                   bg="gray.50"
                   p="2"
                 >
                   {/* Sort answers by vote count in descending order */}
                   {qna.answers
                     .sort((a, b) => b.vote_count - a.vote_count) // Sorting answers by vote_count
                     .map((answer) => (
                       <Box key={answer.aid} p="2" my="2">
                         <Flex alignItems="center">
                           <VStack mr="4">
                             <IconButton
                               size="sm"
                               icon={<ChevronUpIcon />}
                               onClick={() => handleUpvote(answer.aid)}
                             />
                             <Text>{answer.votes}</Text>
                             <IconButton
                               size="sm"
                               icon={<ChevronDownIcon />}
                               onClick={() => handleDownvote(answer.aid)}
                             />
                           </VStack>
                           <Box flex="1">
                             <Text>{answer.answerName}</Text>
                             <Text fontSize="sm" color="gray.500">
                               Answered by {answer.user.username} on{" "}
                               {new Date(answer.created_at).toLocaleString()}
                             </Text>
                             <Text fontSize="sm" color="gray.500">
                               Total vote: {answer.vote_count} 
                             </Text>
                           </Box>
                         </Flex>
                       </Box>
                     ))}
                 </Box>
       
                 {/* New answer input section */}
                 <FormControl mt="4">
                   <Input
                     placeholder="Write your answer..."
                     value={answerName}
                     onChange={(e) => setAnswerName(e.target.value)}
                     backgroundColor="white"
                     borderColor="gray.300"
                     _hover={{ borderColor: "gray.500" }}
                     _focus={{ borderColor: "teal.500" }}
                     padding="6"
                     borderRadius="md"
                   />
                   <Button
                     mt="2"
                     colorScheme="teal"
                     onClick={() => handleAddAnswer(qna.qid)} // Pass the QnA ID
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
