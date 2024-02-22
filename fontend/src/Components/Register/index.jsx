import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import {
    ChakraProvider,
    Box,
    VStack,
    FormControl,
    FormLabel,
    Input,
    Button,
    Heading,
} from "@chakra-ui/react";
import "react-toastify/dist/ReactToastify.css";

function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!email || !password || !name) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post("http://localhost:8000/users", {
                email: email,
                password: password,
                name: name,
            });

            if (response.status === 200) {
                navigate("/login");
                toast.success("Registration successful");
            } else {
                toast.error("Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Registration error:", error.message);
            toast.error("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ChakraProvider>
            <Box p={4} boxShadow="md" borderRadius="md" bg="white" maxW="400px" mx="auto">
                <VStack spacing={4} align="stretch">
                    <Heading as="h1" size="xl" textAlign="center" mb={3}>
                        Register
                    </Heading>

                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4} align="stretch">
                            <FormControl id="name">
                                <FormLabel>Name</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </FormControl>

                            <FormControl id="email">
                                <FormLabel>Email address</FormLabel>
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </FormControl>

                            <FormControl id="password">
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </FormControl>

                            <Button
                                colorScheme="blue"
                                type="submit"
                                isLoading={loading}
                                _hover={{ bg: 'blue.500' }}
                            >
                                {loading ? "Registering..." : "Register"}
                            </Button>
                        </VStack>
                    </form>
                </VStack>
            </Box>
            <ToastContainer />
        </ChakraProvider>
    );
}

export default Register;
