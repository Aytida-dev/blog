import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Flex,
  Textarea,
  Button,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import CustomAlert from "../components/Alert";

export default function Signuppage() {
  const [penName, setPenName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bio, setBio] = useState("");

  const [allCorrect, setAllCorrect] = useState(false);

  const [showAlert, setShowAlert] = useState({ status: "" });

  const checkAllCorrect = () => {
    if (
      penName.length > 0 &&
      email.length > 0 &&
      password.length > 0 &&
      confirmPassword.length > 0 &&
      password === confirmPassword
    ) {
      setAllCorrect(true);
    } else {
      setAllCorrect(false);
    }
  };
  useEffect(() => {
    checkAllCorrect();
  }, [penName, email, password, confirmPassword]);

  const handleOnSubmit = async (e) => {
    const data = {
      username: penName,
      email,
      password,
      confirmPassword,
      bio: bio || "Oops i forgot to write my bio",
    };
    const response = await fetch("http://localhost:4000/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log(result);
    if (result.message === "user signed up") {
      setShowAlert({ status: "success" });

    }
    if (result.message === "User already exists") {
      setShowAlert({ status: "warning" });
    }
    if (result.status === 404) {
      setShowAlert({ status: "error" });
    }
  };

  useEffect(() => {
    setTimeout(() => {
    setShowAlert({ status: "" });
    },4000) // Hide the alert initially
  
    if (showAlert.status === "success") {
      setTimeout(() => {
        setShowAlert({ status: "" }); // Hide the alert after 4 seconds
        window.location.href = "/login"; // Redirect to the login page
      }, 3000);
    }
  }, [showAlert.status]);
  

  
  return (
    <Flex
      justifyContent={"center"}
      m={"2px"}
      direction={"column"}
      alignItems={"center"}
      mt={"20px"}
      gap={"10px"}
    >
      {/* add a switch statement for the alert */}
      {showAlert.status === "success" && (
        <CustomAlert
          status={"success"}
          title={"Account created successfully"}
          discription={"Redirecting to login page"}
        />
      )}
      {showAlert.status === "error" && (
        <CustomAlert
          status={"error"}
          title={"Error while registering"}
          discription={"Please try again"}
        />
      )}
      {showAlert.status === "warning" && (
        <CustomAlert
          status={"warning"}
          title={"User already exists"}
          discription={"Please go to login page"}
        />
      )}
      <FormControl maxWidth={"500px"} isRequired>
        <FormLabel>Pen name</FormLabel>
        <Input
          type="text"
          value={penName}
          onChange={(e) => setPenName(e.target.value)}
        />
        {/* {email==="" && <FormErrorMessage>Email is required</FormErrorMessage>} */}
      </FormControl>
      <FormControl maxWidth={"500px"} isRequired>
        <FormLabel>Email </FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl maxWidth={"500px"} isRequired>
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <FormControl
        maxWidth={"500px"}
        isRequired
        isInvalid={password !== confirmPassword}
      >
        <FormLabel>Confirm Password</FormLabel>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <FormErrorMessage>Passwords do not match</FormErrorMessage>
      </FormControl>
      <FormControl maxWidth={"500px"}>
        <FormLabel>Bio</FormLabel>
        <Textarea
          type="text"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </FormControl>
      <Button onClick={() => handleOnSubmit()} isDisabled={!allCorrect}>
        Register
      </Button>
    </Flex>
  );
}
