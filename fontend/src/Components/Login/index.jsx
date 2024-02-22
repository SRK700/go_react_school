import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  ChakraProvider,
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Heading,
  Text,
  Link,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";

function SignIn({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true); // Show loading spinner during the request
      const response = await axios.post("http://localhost:8000/users/login", {
        email: email,
        password: password,
      });

      if (response.data.message === "success") {
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("email", email);
        onLoginSuccess();
        toast.success("Login successful");
        navigate("/User");
      } else {
        toast.error("Login failed");
      }
    } catch (error) {
      toast.error("Login error");
    } finally {
      setLoading(false); // Hide loading spinner after the request is completed
    }
  };

  return (
    <ChakraProvider>
      <Center height="100vh">
        <Box p={4} width="400px" boxShadow="lg" borderRadius="md">
          <VStack spacing={4} align="stretch">
            <Heading as="h1" size="xl" textAlign="center" mb={4}>
              Welcome back!
            </Heading>

            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <VStack spacing={4} align="stretch">
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
                  <InputGroup size="md">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button
                  colorScheme="blue"
                  type="submit"
                  width="100%"
                  isLoading={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>

                <Text fontSize="sm" textAlign="center">
                  Don't have an account?{" "}
                  <Link color="blue.500" onClick={() => navigate("/register")}>
                    Register here.
                  </Link>
                </Text>
              </VStack>
            </form>
          </VStack>
        </Box>
      </Center>
      <ToastContainer />
    </ChakraProvider>
  );
}

SignIn.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
};

export default SignIn;
