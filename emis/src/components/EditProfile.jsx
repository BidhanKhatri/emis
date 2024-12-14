import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
  useToast,
  Box,
  Button,
  Input,
  FormLabel,
  Heading,
  Avatar,
  VStack,
  HStack,
  Divider,
  FormControl,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [userData, setUserData] = useState({
    address: '',
    phone_no: '',
    Father_name: '',
    Mother_name: '',
    Parents_phone_no: '',
    DOB: '',
    Photo: null,
  });

  const [loading, setLoading] = useState(true);
  const [photoPreview, setPhotoPreview] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const { authToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserProfile = async () => {
      
      if (authToken && authToken.access) {
        try {
          const response = await axios.get('/proxy/user/profile/', {
            headers: {
              Authorization: `Bearer ${authToken.access}`,
            },
          });

          const profileData = response.data.profile;

          setUserData({
            address: profileData.address || '',
            phone_no: profileData.phone_no || '',
            Father_name: profileData.Father_name || '',
            Mother_name: profileData.Mother_name || '',
            Parents_phone_no: profileData.Parents_phone_no || '',
            DOB: profileData.DOB || '',
            Photo: profileData.Photo || null,
          });

          const photoURL = `http://10.5.15.11:8000${profileData.Photo}`; // Adjust base URL as needed
          setPhotoPreview(photoURL);
        } catch (error) {
          toast({
            title: 'Error loading profile',
            description: 'Unable to load user profile data.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUserData({ ...userData, Photo: file });

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('address', userData.address);
    formData.append('phone_no', userData.phone_no);
    formData.append('Father_name', userData.Father_name);
    formData.append('Mother_name', userData.Mother_name);
    formData.append('Parents_phone_no', userData.Parents_phone_no);
    formData.append('DOB', userData.DOB);
    if (userData.Photo) {
      formData.append('Photo', userData.Photo);
    }

    try {
      await axios.put('/proxy/user/update/', formData, {
        headers: {
          Authorization: `Bearer ${authToken.access}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/edit-profile');
    } catch (error) {
      toast({
        title: 'Error updating profile',
        description: error.response?.data?.message || 'An error occurred while updating the profile.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <Box
      maxW="600px"
      mx="auto"
      mt="10"
      p={6}
      bg="white"
      borderRadius="md"
      boxShadow="lg"
    >
      
        <Heading as="h2" size="lg" textAlign="center" color="blue.600">
          Edit Profile
        </Heading>
        <Box />

      {loading ? (
        <Flex justify="center" align="center">
          <Spinner size="lg" />
        </Flex>
      ) : (
        <form onSubmit={handleSubmit}>
          <VStack spacing={6} align="start">
            <HStack spacing={4}>
              <Avatar size="xl" src={photoPreview} />
              <FormControl>
                <FormLabel>Profile Photo</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </FormControl>
            </HStack>

            <FormControl>
              <FormLabel>Address</FormLabel>
              <Input
                name="address"
                value={userData.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
                bg="gray.50"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Phone Number</FormLabel>
              <Input
                name="phone_no"
                value={userData.phone_no}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                bg="gray.50"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Father's Name</FormLabel>
              <Input
                name="Father_name"
                value={userData.Father_name}
                onChange={handleInputChange}
                placeholder="Enter father's name"
                bg="gray.50"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Mother's Name</FormLabel>
              <Input
                name="Mother_name"
                value={userData.Mother_name}
                onChange={handleInputChange}
                placeholder="Enter mother's name"
                bg="gray.50"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Parents' Phone Number</FormLabel>
              <Input
                name="Parents_phone_no"
                value={userData.Parents_phone_no}
                onChange={handleInputChange}
                placeholder="Enter parents' phone number"
                bg="gray.50"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Date of Birth</FormLabel>
              <Input
                name="DOB"
                type="date"
                value={userData.DOB}
                onChange={handleInputChange}
                bg="gray.50"
              />
            </FormControl>

            <Divider />

            <Button
              colorScheme="blue"
              type="submit"
              isLoading={loading}
              width="full"
            >
              Save Changes
            </Button>
          </VStack>
        </form>
      )}
    </Box>
  );
};

export default EditProfile;
